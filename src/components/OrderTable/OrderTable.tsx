import React, { useState } from "react";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import { useMediaQuery } from "react-responsive";
import { Order } from "../../types/types";
import { RxCheck, RxCross2, RxTrash } from "react-icons/rx";
import AxiosInstance from "../../config/apiClient";
import { useNavigate } from "react-router-dom";

type OrderTableProps = {
  order: Order;
};

const OrderTable = ({ order }: OrderTableProps) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const navigate = useNavigate();

  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleConfirmDeleteOrder = async (
    event: any,
    order_id: string,
    event_id: string
  ) => {
    event.stopPropagation();
    setConfirmDelete(null);

    await AxiosInstance.delete(`/orders/${order_id}`)

      .then((response) => {
        console.log(response);
        navigate(`/info/${event_id}`);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDeleteOrder = (event: any, order_id: string) => {
    event.stopPropagation();
    event.preventDefault();
    setConfirmDelete(order_id);
  };
  return (
    <>
      <Container>
        <h4 className="mt-4 mb-3">
          Orden #{order.order_id} del evento #{order.event_id} -{" "}
          <span className="text-info text-capitalize ">
            {order.event_description}
          </span>
        </h4>

        <Table
          responsive={isMobile}
          variant="dark"
          striped
          bordered
          className="text-capitalize shadow-lg"
        >
          <thead>
            <tr
              style={{
                textAlign: "left",
                letterSpacing: 0.25,
                borderBottom: "1px solid var(--info)",
              }}
            >
              <th>ID</th>
              {isMobile ? (
                <th>Pago</th>
              ) : (
                <th style={{ whiteSpace: "nowrap" }}>Método de pago</th>
              )}

              <th>Producto</th>
              <th>Precio</th>
              {isMobile ? (
                <th>#</th>
              ) : (
                <th style={{ maxWidth: "10ch" }}>Cantidad</th>
              )}
              {isMobile ? <th>Desc.</th> : <th>Descuento</th>}

              <th style={{ textAlign: "center" }}>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {order.products.map((product: any, i: number, productRow: any) => (
              <tr
                key={i}
                className=""
                style={{
                  borderBottom:
                    i + 1 === productRow.length
                      ? "2px solid var(--info)"
                      : "none",
                }}
              >
                {i === 0 ? (
                  <>
                    <td className="" rowSpan={order.products.length}>
                      #{order.order_id}
                    </td>
                    <td className="" rowSpan={order.products.length}>
                      {order.payment_method}
                    </td>
                  </>
                ) : null}

                {isMobile ? (
                  <>
                    <td>{product.description}</td>
                    <td>{product.price}</td>
                    <td>{product.quantity}</td>
                  </>
                ) : (
                  <>
                    <td className="">{product.description}</td>
                    <td style={{ textAlign: "right" }} className="">
                      {product.price}
                    </td>
                    <td style={{ textAlign: "right" }} className="">
                      {product.quantity}
                    </td>
                  </>
                )}
                {i + 1 === productRow.length ? (
                  <>
                    <td style={{ textAlign: "right" }}>
                      {order.discount || "$0,00"}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {order.discounted_order_total}
                    </td>
                  </>
                ) : (
                  <>
                    <td></td>
                    <td></td>
                  </>
                )}
                {i === 0 ? (
                  <>
                    <td className="">
                      <div className="d-flex align-items-center justify-content-center position-relative displayButtons">
                        {confirmDelete === order.order_id && (
                          <>
                            <div className="confirmDeletionButtons d-flex position-absolute bottom-100 gap-2 p-2">
                              <button
                                type="button"
                                onClick={(e) =>
                                  handleConfirmDeleteOrder(
                                    e,
                                    order.order_id,
                                    order.event_id
                                  )
                                }
                                style={{ width: 40, height: 40 }}
                                className="btn btn-success shadow-lg d-flex justify-content-center align-items-center rounded-circle p-2"
                              >
                                <RxCheck size={20} />
                              </button>
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  setConfirmDelete(null);
                                }}
                                style={{
                                  width: 40,
                                  height: 40,
                                  zIndex: 100,
                                }}
                                className="btn btn-danger shadow-lg d-flex justify-content-center align-items-center rounded-circle p-2"
                              >
                                <RxCross2 size={18} />
                              </button>
                            </div>
                          </>
                        )}
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={(e) => handleDeleteOrder(e, order.order_id)}
                        >
                          <RxTrash size={20} />
                        </Button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td></td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </>
  );
};

export default OrderTable;
