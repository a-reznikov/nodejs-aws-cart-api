import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { CartItemEntity } from './cart-item.entity';
import { Transform } from 'class-transformer';

@Entity('products')
export class ProductEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @Transform(({ value }) => Number(parseFloat(value).toFixed(2)))
  price: number;

  @OneToMany(() => CartItemEntity, (cartItem) => cartItem.product)
  cartItems: CartItemEntity[];
}
