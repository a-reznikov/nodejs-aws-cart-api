import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from '../entities/order.entity';
import { OrderStatus } from '../type';
import { CreateOrderPayload } from '../type';
import { findOrderParams } from '../constants';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
  ) {}

  async getAll(): Promise<OrderEntity[]> {
    return this.orderRepository.find({
      ...findOrderParams,
    });
  }

  async findById(orderId: string): Promise<OrderEntity> {
    return this.orderRepository.findOne({
      where: { id: orderId },
      ...findOrderParams,
    });
  }

  async create(data: CreateOrderPayload): Promise<OrderEntity> {
    const order = this.orderRepository.create({
      ...data,
      status: OrderStatus.OPEN,
      created_at: new Date(),
      updated_at: new Date(),
    });

    const savedOrder = await this.orderRepository.save(order);
    return this.findById(savedOrder.id);
  }

  async update(
    orderId: string,
    data: Partial<OrderEntity>,
  ): Promise<OrderEntity> {
    const order = await this.findById(orderId);

    if (!order) {
      throw new Error('Order does not exist.');
    }

    const updatedOrder = this.orderRepository.merge(order, {
      ...data,
      updated_at: new Date(),
    });

    await this.orderRepository.save(updatedOrder);
    return this.findById(orderId);
  }
}
