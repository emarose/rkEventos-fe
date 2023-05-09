export type Event = {
  event_id: string;
  balance_currency: string;
  balance: number;
  cost: string;
  best_order: { order_id: number; order_total: string };
  event_date: string;
  description: string;
  grand_total: string;
  address: string;
};

export type EventLabel = {
  label: string;
  value: {
    event_id: string;
    cost: string;
    event_date: string;
    address: string;
  };
};

export type EventProps = {
  order_id: string;
  payment_method: string;
  grand_total: string,
  discounted_order_total: string;
  discount?: any;
  products: Product[];
  order_total: string;
  best_order: BestOrder;
  event_description: string;
  event_date: string;
  cost: string;
  address: string;
  event_id: string;
  order_count: string;
  balance: string;
  payment_methods: PaymentMethods;

};

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

export type Order = {
  order_id: string;

  payment_method: string;
  products: Product[];
  order_total: string;
  event_description: string;
  event_date: string;
  cost: string;
  address: string;
  event_id: string;
  discount: number;
  discounted_order_total: string
}

export type OrderFormData = {
  event: string;
  discount: string;
  paymentMethod: string;
  products: {
    product_id: string;
    quantity: number;
  }[];
  totalPrice: number;
};

export type BestOrder = {
  order_id: number;
  order_total: string;
};

export type Product = {
  description: string;
  price: string;
  quantity: number;
}

export type ProductLabel = {
  label: string;
  value: {
    product_id: string;
    price: string;
    description: string;
  };
};

export type PaymentMethods = {
  efectivo?: string;
  transferencia?: string;
};