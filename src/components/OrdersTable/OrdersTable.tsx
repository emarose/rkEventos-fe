import React from "react";
import { Table } from "react-bootstrap";

type Order = {
  order_id: string;
  event_name: string;
  payment_method: string;
  product_name: string;
  quantity: number;
  product_price: number;
  total: number;
  order_total: number;
};

type Orders = {
  [orderID: string]: Order[];
};

type OrdersTableProps = {
  orders: Orders;
};

function OrdersTable(props: OrdersTableProps) {
  const { orders } = props;

  return (
    <Table striped borderless hover className="table-dark">
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Event Name</th>
          <th>Payment Method</th>
          <th>Product Name</th>
          <th>Quantity</th>
          <th>Product Price</th>
          <th>Total</th>
          <th>Order Total</th>
        </tr>
      </thead>
      <tbody>
        {Object.keys(orders).map((orderID, index) => (
          <React.Fragment key={index}>
            {orders[orderID].map((order) => (
              <tr key={`${order.order_id}-${order.product_name}`}>
                <td>{order.order_id}</td>
                <td>{order.event_name}</td>
                <td>{order.payment_method}</td>
                <td>{order.product_name}</td>
                <td>{order.quantity}</td>
                <td>{order.product_price}</td>
                <td>{order.total}</td>
                <td>{order.order_total}</td>
              </tr>
            ))}
          </React.Fragment>
        ))}
      </tbody>
    </Table>
  );
}

export default OrdersTable;
