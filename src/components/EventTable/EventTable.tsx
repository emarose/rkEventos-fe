import React from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import { useMediaQuery } from "react-responsive";

const EventTable = ({ event }: any) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <>
      <Container>
        <Row
          style={{ maxWidth: 700, margin: "auto" }}
          className="bg-info shadow-lg border rounded border-info bg-opacity-25 p-4 d-flex justify-content-center gap-4 text-capitalize mt-4"
        >
          <Col>
            <p>Id Evento: #{event[0].event_id} </p>
            <p>Descripción: {event[0].event_description} </p>
            <p>Costo: {event[0].cost} </p>
          </Col>
          <Col>
            <p>Fecha: {new Date(event[0].event_date).toLocaleDateString()} </p>
            <p>Direccion: {event[0].address} </p>
            <p>Recaudación: </p>
          </Col>
          <hr />
          <Row className="m-0 p-0">
            <Col>
              <p>Cantidad de ordenes: </p>
              <p>Mayor Orden: </p>
            </Col>
            <Col>
              <p>Cobrado en efectivo: </p>
              <p>Cobrado por otros medios: </p>
            </Col>
          </Row>
        </Row>
      </Container>

      <h4 className="mt-4 mb-3">Ordenes del evento</h4>

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
              <th style={{ maxWidth: "8ch" }}>Cantidad</th>
            )}
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {event.map((order: any, index: number) => {
            return (
              <>
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
                        <td
                          style={{ textAlign: "right" }}
                          //rowSpan={order.products.length}
                        >
                          {order.order_total}
                        </td>
                      ) : (
                        <td></td>
                      )}
                    </tr>
                  )
                )}
              </>
            );
          })}
        </tbody>
      </Table>
    </>
  );
};

export default EventTable;
