import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { CartEntity } from '../../cart/entities/cart.entity';
import { OrderStatus } from '../type';

@Entity('orders')
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  user_id: string;

  @Column({ type: 'uuid', nullable: false })
  cart_id: string;

  @ManyToOne(() => CartEntity)
  @JoinColumn({ name: 'cart_id' })
  cart: CartEntity;

  @Column({ type: 'jsonb', nullable: false })
  payment: any;

  @Column({ type: 'jsonb', nullable: false })
  delivery: any;

  @Column({ type: 'text', nullable: true })
  comments: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.OPEN,
    nullable: false,
  })
  status: OrderStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  total: number;

  @Column({ type: 'date', nullable: false })
  created_at: Date;

  @Column({ type: 'date', nullable: false })
  updated_at: Date;

  @BeforeInsert()
  updateDates() {
    const date = new Date();
    this.created_at = date;
    this.updated_at = date;
  }

  @BeforeUpdate()
  updateUpdatedAt() {
    this.updated_at = new Date();
  }
}
