export const DELIVERY_FEE = 60;
export const FREE_DELIVERY_OVER = 500;

export const deliveryFee = (subtotal) =>
  subtotal <= 0 || subtotal >= FREE_DELIVERY_OVER ? 0 : DELIVERY_FEE;