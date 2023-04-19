import React, { useEffect, useState } from "react";
import AxiosInstance from "../../config/apiClient";
import { useTable } from "react-table";
import { OrderData } from "../../types/types";
import OrdersTable from "../../components/OrdersTable/OrdersTable";
import {
  Accordion,
  AccordionButton,
  Card,
  Col,
  Container,
  Form,
  ListGroup,
  Row,
  Table,
} from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import EventTable from "../../components/EventTable/EventTable";

const ViewOrders = () => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const [ordersData, setOrdersData] = useState<Order[]>([]);
  const [eventOptions, setEventOptions] = useState<[]>([]);
  const [eventData, setEventData] = useState<[]>([]);
  const [showEventTable, setShowEventTable] = useState<Boolean>(false);

  interface Order {
    order_id: string;
    event_name: string;
    payment_method: string;
    product_name: string;
    quantity: number;
    product_price: number;
    total: number;
    order_total: number;
  }
  /* const ordersByOrderId = ordersData.reduce((acc: any, order: any) => {
    if (!acc[order.order_id]) {
      acc[order.order_id] = [];
    }
    acc[order.order_id].push(order);

    return acc;
  }, {});
 */

  /*   order_id: string;
  event_name: string;
  payment_method: string;
  order_total: number;
  products: {
    product_name: string;
    product_price: number;
    quantity: number;
    total: number;
  }[]; */

  /*  const ordersByOrderId = ordersData.reduce((map, order: OrderData) => {
    const orderId = order.order_id;
    const orderDetails = {
      order_id: order.order_id,
      event_name: order.event_name,
      payment_method: order.payment_method,
      order_total: order.order_total,
      products: [
        {
          product_name: order.products[0].product_name,
          quantity: order.products[0].quantity,
          product_price: order.products[0].product_price,
          total: order.products[0].total,
        },
      ],
    };

    if (map.has(orderId)) {
      const existingOrder = map.get(orderId);
      if (existingOrder) {
        existingOrder.products.push({
          product_name: order.products[0].product_name,
          quantity: order.products[0].quantity,
          product_price: order.products[0].product_price,
          total: order.products[0].total,
        });
        existingOrder.order_total += order.order_total;
      }
    } else {
      map.set(orderId, orderDetails);
    }

    return map;
  }, new Map<string, OrderData>()); */

  const groupedOrders = ordersData.reduce(
    (acc: { [key: string]: Order[] }, order) => {
      if (!acc[order.order_id]) {
        acc[order.order_id] = [];
      }
      acc[order.order_id].push(order);
      return acc;
    },
    {}
  );

  const getAllOrders = async () => {
    await AxiosInstance.get("/orders")
      .then((response) => {
        setOrdersData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getEventLabels = async () => {
    await AxiosInstance.get("/events/getLabels")
      .then((response) => {
        let data = response["data"].rows;

        const draft = data.map((event: any) => ({
          label: `${event.description} - ${new Date(
            event.event_date
          ).toLocaleDateString()}`,
          event_date: event.date,
          description: event.description,
          value: { event_id: event.event_id },
        }));

        setEventOptions(draft);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSelectEvent = async (e: any) => {
    let event_id = e.target.value;

    await AxiosInstance.get(`/events/getById/${event_id}`)
      .then((response) => {
        setEventData(response.data);

        setShowEventTable(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getAllOrders();
    getEventLabels();
  }, []);

  return (
    <Container>
      <h1 className="text-info my-4">Info</h1>
      <Form
        /*  onSubmit={handleSubmit()} */
        className="d-flex flex-column gap-4"
      >
        <Form.Label>Ver ordenes por evento</Form.Label>
        <Controller
          name="event"
          control={control}
          rules={{ required: "Seleccione un Evento" }}
          render={({ field: { value, onChange } }) => (
            <Form.Select
              className="form-control bg-dark bg-opacity-75 text-info border-info"
              value={value}
              style={{ textTransform: "capitalize" }}
              onChange={(e) => handleSelectEvent(e)}
            >
              <option value={""}>Seleccione</option>
              {eventOptions.map((eventOption: any, i: number) => (
                <option key={i} value={eventOption.value.event_id}>
                  {eventOption.label}
                </option>
              ))}
            </Form.Select>
          )}
        />

        {/*  <Form.Group controlId="orderByOrderId">
            <Form.Label>Buscar Orden por Id</Form.Label>
            <Form.Control
              className="form-control bg-dark bg-opacity-75 text-info border-info"
              isInvalid={!!errors.description}
              type="text"
              placeholder="Muestra los detalles de la orden por Id"
              {...register("description", { required: true })}
            />
            {errors.description && (
              <Form.Text className="text-danger">
                Ingrese el nombre del evento
              </Form.Text>
            )}
          </Form.Group> */}
      </Form>
      {showEventTable && <EventTable event={eventData} />}
      {/*  <OrdersTable orders={groupedOrders} /> */}
    </Container>
  );
};

export default ViewOrders;
