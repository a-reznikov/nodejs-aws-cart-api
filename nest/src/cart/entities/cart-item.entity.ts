import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { CartEntity } from './cart.entity';
import { ProductEntity } from './product.entity';

@Entity('cart_items')
export class CartItemEntity {
  @PrimaryColumn('uuid')
  cart_id: string;

  @PrimaryColumn('uuid')
  product_id: string;

  @Column({ type: 'integer', nullable: false })
  count: number;

  @ManyToOne(() => CartEntity, (cart) => cart.items)
  @JoinColumn({ name: 'cart_id', referencedColumnName: 'id' })
  cart: CartEntity;

  @ManyToOne(() => ProductEntity, (product) => product.cartItems)
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product: ProductEntity;
}
