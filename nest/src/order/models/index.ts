import { Address, OrderStatus, Payment } from '../type';

export type Order = {
  id?: string;
  userId: string;
  items: Array<{ productId: string; count: number }>;
  cartId: string;
  address: Address;
  statusHistory: Array<{
    status: OrderStatus.OPEN;
    timestamp: number;
    comment: string;
  }>;
};

export const DEFAULT_PAYMENT: Payment = {
  type: 'credit_card',
};
