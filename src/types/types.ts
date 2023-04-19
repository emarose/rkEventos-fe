/* export type OrderData = {
  order_id: string;
  event_name: string;
  payment_method: string;
  product_name: string;
  product_price: number;
  quantity: number;
  order_total: number;
  total: number;
}; */

/* export type OrderData = {
  order_id: string;
  event_name: string;
  payment_method: string;
  products: [{ product_name: string; product_price: number; quantity: number }];
  order_total: number;
  total: number;
}; */

export type OrderData = {
  order_id: string;
  event_name: string;
  payment_method: string;
  order_total: number;
  products: {
    product_name: string;
    product_price: number;
    quantity: number;
    total: number;
  }[];
};
