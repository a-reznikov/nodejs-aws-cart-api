import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { CartEntity } from './cart.entity';
import { ProductEntity } from './product.entity';
import { Exclude } from 'class-transformer';

@Entity('cart_items')
export class CartItemEntity {
  @PrimaryColumn('uuid')
  @Exclude()
  cart_id: string;

  @PrimaryColumn('uuid')
  @Exclude()
  product_id: string;

  @Column({ type: 'integer', nullable: false })
  count: number;

  @ManyToOne(() => CartEntity, (cart) => cart.items)
  @JoinColumn({ name: 'cart_id', referencedColumnName: 'id' })
  cart: CartEntity;

  @ManyToOne(() => ProductEntity, (product) => product.cartItems)
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product: ProductEntity;

  constructor(partial: Partial<CartItemEntity>) {
    Object.assign(this, partial);
  }
}
