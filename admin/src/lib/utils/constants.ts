export const ORDER_STATUS = {
  PENDING: 'Pending',
  PAID: 'Paid',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  COMPLETED: 'Completed',
  CANCELED: 'Canceled',
};

export const PAYMENT_METHODS = [
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'e_wallet', label: 'E-Wallet' },
  { value: 'cod', label: 'Cash on Delivery' },
];