import { Payment } from './type';

export const DEFAULT_PAYMENT: Payment = {
  type: 'credit_card',
};

export const findOrderParams = {
  relations: ['cart'],
  select: {
    cart: {
      updated_at: true,
      status: true,
    },
  },
};
