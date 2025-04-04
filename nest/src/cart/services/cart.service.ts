import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CartEntity } from '../entities/cart.entity';
import { CartItemEntity } from '../entities/cart-item.entity';
import { randomUUID } from 'node:crypto';
import { CartStatuses, Product } from '../models';
import { OrderStatus, PutCartPayload } from 'src/order/type';
import { ProductEntity } from '../entities/product.entity';
import { OrderEntity } from 'src/order/entities/order.entity';
import { CreateOrderDto } from 'src/order/type';
import { DEFAULT_PAYMENT } from 'src/order/constants';
import { findOrderParams } from 'src/order/constants';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,
    @InjectRepository(CartItemEntity)
    private readonly cartItemRepository: Repository<CartItemEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async findByUserId(userId: string): Promise<CartEntity> {
    return this.cartRepository.findOne({
      where: { user_id: userId, status: CartStatuses.OPEN },
      relations: ['items', 'items.product'],
    });
  }

  async createByUserId(userId: string): Promise<CartEntity> {
    const cart = this.cartRepository.create({
      id: randomUUID(),
      user_id: userId,
      status: CartStatuses.OPEN,
      items: [],
    });

    return this.cartRepository.save(cart);
  }

  async findOrCreateByUserId(userId: string): Promise<CartEntity> {
    const cart = await this.findByUserId(userId);

    if (cart) {
      return cart;
    }

    return this.createByUserId(userId);
  }

  async updateByUserId(
    userId: string,
    payload: PutCartPayload,
  ): Promise<CartEntity> {
    const cart = await this.findOrCreateByUserId(userId);

    const product = await this.findOrCreateProduct(payload.product);

    let cartItem = await this.cartItemRepository.findOne({
      where: {
        cart_id: cart.id,
        product_id: product.id,
      },
    });

    if (cartItem) {
      if (payload.count === 0) {
        await this.cartItemRepository.remove(cartItem);
      } else {
        cartItem.count = payload.count;
        await this.cartItemRepository.save(cartItem);
      }
    } else if (payload.count > 0) {
      cartItem = this.cartItemRepository.create({
        cart_id: cart.id,
        product_id: payload.product.id,
        count: payload.count,
      });

      await this.cartItemRepository.save(cartItem);
    }

    return this.findByUserId(userId);
  }

  async removeByUserId(userId: string): Promise<void> {
    const cart = await this.findByUserId(userId);

    if (cart) {
      await this.cartItemRepository.delete({ cart_id: cart.id });
      await this.cartRepository.delete(cart.id);
    }
  }

  private async findOrCreateProduct(payload: Product): Promise<ProductEntity> {
    const foundedProduct = await this.productRepository.findOne({
      where: { id: payload.id },
    });

    if (foundedProduct) {
      return foundedProduct;
    }

    const newProduct = this.productRepository.create(payload);

    return await this.productRepository.save(newProduct);
  }

  async updateCartStatus(cartId: string, status: CartStatuses): Promise<void> {
    await this.cartRepository.update(cartId, { status });
  }

  async checkout(data: {
    userId: string;
    cartId: string;
    total: number;
    body: CreateOrderDto;
  }): Promise<OrderEntity> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = await queryRunner.manager.save(OrderEntity, {
        user_id: data.userId,
        cart_id: data.cartId,
        delivery: data.body.address,
        comments: data.body.address.comment,
        payment: DEFAULT_PAYMENT,
        total: data.total,
        status: OrderStatus.OPEN,
        created_at: new Date(),
        updated_at: new Date(),
      });

      await queryRunner.manager.update(CartEntity, data.cartId, {
        status: CartStatuses.ORDERED,
        updated_at: new Date(),
      });

      await queryRunner.commitTransaction();

      return await queryRunner.manager.findOne(OrderEntity, {
        where: { id: order.id },
        ...findOrderParams,
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
