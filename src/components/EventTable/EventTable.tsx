import React, { useState } from "react";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import { useMediaQuery } from "react-responsive";
import { EventProps } from "../../types/types";

import AxiosInstance from "../../config/apiClient";
import { RxCheck, RxCross2, RxTrash } from "react-icons/rx";

type EventTableProps = {
  event: EventProps[];
  fetchData: (event: any, event_id: string) => void;
};

const EventTable = ({ event, fetchData }: EventTableProps) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  console.log(event);
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
        fetchData(event, event_id);
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
      {event[0] ? (
        <>
          <Container>
            <Row
              style={{ maxWidth: 700, margin: "auto" }}
              className="bg-info shadow-lg border rounded border-info bg-opacity-25 p-4 d-flex justify-content-center gap-4 text-capitalize mt-4"
            >
              <Col className="">
                <p>
                  ID Evento: <b>#{event[0].event_id}</b>
                </p>
                <p>
                  Descripción: <b>{event[0].event_description}</b>
                </p>
                <p>
                  Costo: <b>{event[0].cost}</b>
                </p>
              </Col>
              <Col>
                <p>
                  Fecha:{" "}
                  <b>{new Date(event[0].event_date).toLocaleDateString()}</b>
                </p>
                <p>
                  Direccion: <b>{event[0].address}</b>
                </p>
                <p>
                  Balance: <b>{event[0].balance}</b>
                </p>
              </Col>
              <hr />
              <Row className="m-0 p-0">
                <Col>
                  <p>
                    Cantidad de ordenes: <b>{event[0].order_count}</b>
                  </p>
                  <p>
                    Mejor Orden:{" "}
                    <b>
                      #{event[0].best_order.order_id} -{" "}
                      {event[0].best_order.order_total}
                    </b>
                  </p>
                </Col>
                <Col>
                  <p>
                    Cobrado en Efectivo:{" "}
                    <b> {event[0].payment_methods.efectivo || "-"}</b>
                  </p>
                  <p>
                    Cobrado por Transferencia:{" "}
                    <b> {event[0].payment_methods.transferencia || "-"}</b>
                  </p>
                  <hr />
                  {event[0].grand_total}
                </Col>
              </Row>
            </Row>
          </Container>

          <h4 className="mt-5 mb-4">
            Ordenes del evento{" "}
            <span className="text-info text-capitalize">
              {event[0].event_description}
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
              {event.map((order: any, index: number) => {
                return (
                  <React.Fragment key={index}>
                    {order.products.map(
                      (product: any, i: number, productRow: any) => (
                        <tr
                          key={`${index} + "_" + ${i}`}
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
                              <td>{order.discount || "$0,00"}</td>
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
                                    onClick={(e) =>
                                      handleDeleteOrder(e, order.order_id)
                                    }
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
                      )
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </Table>
        </>
      ) : (
        <Container className="text-center mt-5">
          <h2>El evento no tiene órdenes asociadas.</h2>
        </Container>
      )}
    </>
  );
};

export default EventTable;
