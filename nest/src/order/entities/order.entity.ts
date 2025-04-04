import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CartEntity } from '../../cart/entities/cart.entity';
import { OrderStatus } from '../type';

@Entity('orders')
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'uuid' })
  cart_id: string;

  @Column({ type: 'jsonb' })
  payment: Record<string, any>;

  @Column({ type: 'jsonb' })
  delivery: Record<string, any>;

  @Column({ type: 'text', nullable: true })
  comments: string;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.OPEN })
  status: OrderStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @ManyToOne(() => CartEntity)
  @JoinColumn({ name: 'cart_id' })
  cart: CartEntity;
}
