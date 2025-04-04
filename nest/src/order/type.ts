export enum OrderStatus {
  OPEN = 'OPEN',
  APPROVED = 'APPROVED',
  CONFIRMED = 'CONFIRMED',
  SENT = 'SENT',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

type StatusHistory = Array<{
  status: OrderStatus;
  timestamp: number;
  comment: string;
}>;

export type Address = {
  address: string;
  firstName: string;
  lastName: string;
  comment: string;
};

export type Payment = {
  type: string;
};

export type CreateOrderDto = {
  items: Array<{ productId: string; count: number }>;
  address: {
    comment: string;
    address: string;
    lastName: string;
    firstName: string;
  };
};

export type PutCartPayload = {
  product: { description: string; id: string; title: string; price: number };
  count: number;
};

export type CreateOrderPayload = {
  user_id: string;
  cart_id: string;
  payment: Payment;
  delivery: Record<string, any>;
  comments: string;
  total: number;
};
