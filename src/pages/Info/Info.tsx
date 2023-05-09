import { useEffect, useState } from "react";
import AxiosInstance from "../../config/apiClient";
import { useParams } from "react-router-dom";
import { Container, Form } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import EventTable from "../../components/EventTable/EventTable";
import OrderTable from "../../components/OrderTable/OrderTable";
import { EventLabel, Order } from "../../types/types";

const Info = () => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    clearErrors,
    setError,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const [eventLabels, setEventLabels] = useState<EventLabel[]>([]);
  const [eventData, setEventData] = useState<[]>([]);
  const [orderData, setOrderData] = useState<Order | null>(null);
  const [showOrderTable, setShowOrderTable] = useState<Boolean>(false);
  const [showEventTable, setShowEventTable] = useState<Boolean>(false);

  const { params_eventid, params_orderid } = useParams();

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

        setEventLabels(draft);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSelectEvent = async (event: any, eventId?: string) => {
    let event_id =
      eventId || (event.target ? event.target.value : params_eventid);

    if (event_id) {
      await AxiosInstance.get(`/events/getById/${event_id}`)
        .then((response) => {
          setEventData(response.data);
          setShowEventTable(true);
          setShowOrderTable(false);
          setValue("orderId", null);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleSelectOrderId = async (event: any) => {
    let order_id = event.target ? event.target.value : params_orderid;
    if (order_id) {
      await AxiosInstance.get(`/orders/getById/${order_id}`)
        .then((response) => {
          let data: Order = response.data;

          if (Object.keys(data).length === 0) {
            setError("orderId", { type: "value" }, { shouldFocus: true });
            setShowOrderTable(false);
          } else {
            clearErrors("orderId");
            setOrderData(response.data[0]);
            setShowOrderTable(true);
            setShowEventTable(false);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  useEffect(() => {
    if (params_eventid) {
      handleSelectEvent(params_eventid);
    }

    if (params_orderid) {
      handleSelectOrderId(params_orderid);
    }
    getEventLabels();
  }, [params_eventid, params_orderid]);

  return (
    <Container>
      <h1 className="text-info my-4">Info</h1>
      <Form className="d-flex flex-column gap-4">
        <Form.Label>Ver órdenes por evento</Form.Label>
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
              <option value="">Seleccione una opción</option>
              {eventLabels.map((eventOption: any, i: number) => (
                <option key={i} value={eventOption.value.event_id}>
                  {eventOption.label}
                </option>
              ))}
            </Form.Select>
          )}
        />

        <Form.Group controlId="orderByOrderId">
          <Form.Label>Buscar Orden por ID</Form.Label>
          <Form.Control
            className="form-control bg-dark bg-opacity-75 text-info border-info"
            type="number"
            min={1}
            placeholder="# Ingrese la ID de la orden"
            {...register("orderId")}
            onChange={(e) => {
              handleSelectOrderId(e);
            }}
            isInvalid={!!errors.orderId}
          />
          {errors.orderId && (
            <Form.Text className="text-danger">
              ID de Orden inexistente
            </Form.Text>
          )}
        </Form.Group>
      </Form>

      {showEventTable && (
        <EventTable event={eventData} fetchData={handleSelectEvent} />
      )}
      {showOrderTable && (orderData ? <OrderTable order={orderData} /> : null)}
    </Container>
  );
};

export default Info;
