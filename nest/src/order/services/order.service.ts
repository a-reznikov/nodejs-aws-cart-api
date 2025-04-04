import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from '../entities/order.entity';
import { OrderStatus } from '../type';
import { CreateOrderPayload } from '../type';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
  ) {}

  async getAll(): Promise<OrderEntity[]> {
    return this.orderRepository.find();
  }

  async findById(orderId: string): Promise<OrderEntity> {
    return this.orderRepository.findOne({ where: { id: orderId } });
  }

  async create(data: CreateOrderPayload): Promise<OrderEntity> {
    const order = this.orderRepository.create({
      ...data,
      status: OrderStatus.OPEN,
    });

    return this.orderRepository.save(order);
  }

  async update(
    orderId: string,
    data: Partial<OrderEntity>,
  ): Promise<OrderEntity> {
    const order = await this.findById(orderId);

    if (!order) {
      throw new Error('Order does not exist.');
    }

    const updatedOrder = this.orderRepository.merge(order, data);
    return this.orderRepository.save(updatedOrder);
  }
}
