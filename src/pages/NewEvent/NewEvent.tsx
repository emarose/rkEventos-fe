import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Form, Button, Alert, Container } from "react-bootstrap";
import AxiosInstance from "../../config/apiClient";
import Notification from "../../components/Notification/Notification";
import { RxCheck, RxCross2, RxPencil1, RxTrash } from "react-icons/rx";
import Swal from "sweetalert2";

type FormValues = {
  event_id: number;
  description: string;
  cost: number;
  event_date: string;
  address: string;
};

const NewEvent: React.FC = () => {
  const {
    register,
    reset,
    handleSubmit,

    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

  const [addedEvents, setAddedEvents] = useState<FormValues[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<Number | null>(null);
  const [isEditing, setIsEditing] = useState<Object>({});

  const submitEvent = async (data: FormValues) => {
    await AxiosInstance.post("/events/add", data)
      .then((response) => {
        if (response.status === 200) {
          Notification.fire({
            icon: "success",
            position: "bottom",
            title: "Evento ingresado exitosamente!",
          });
          reset();
          getAllEvents();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getAllEvents = async () => {
    await AxiosInstance.get("/events")
      .then((response) => {
        let addedEvents = response["data"].rows;
        setAddedEvents(addedEvents);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleConfirmDelete = async (event: any, event_id: number) => {
    event.stopPropagation();

    await AxiosInstance.delete(`/events/${event_id}`)
      .then((response) => {
        getAllEvents();
        reset();
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDeleteEvent = (event: any, event_id: number) => {
    event.stopPropagation();
    setConfirmDelete(event_id);
  };

  const handleEditEvent = (
    event: any,
    { event_id, description, cost, event_date, address }: FormValues
  ) => {
    event.stopPropagation();
    setIsEditing({
      product_id: event_id,
      description: description,
      cost: cost,
      event_date: event_date,
      address: address,
    });
    setValue("description", description);
    setValue("event_date", new Date(event_date).toISOString().split("T")[0]);
    setValue("address", address);
    setValue(
      "cost",
      Number(
        cost.toString().replace(/\./g, "").replace(",", ".").replace(/\$/g, "")
      )
    );
  };

  const handleConfirmEdition = async () => {
    let editionValues = Object.values(isEditing);
    let event_id = editionValues[0];

    let newDescription = watch("description");
    let newCost = watch("cost");
    let newEvent_date = watch("event_date");
    let newAddress = watch("address");
    let newData = {
      event_id: event_id,
      description: newDescription,
      cost: newCost,
      event_date: newEvent_date,
      address: newAddress,
    };

    await AxiosInstance.put(`/events/${event_id}`, newData)
      .then((response) => {
        setIsEditing({});
        reset();

        if (response.status === 200) {
          Notification.fire({
            icon: "success",
            position: "bottom",
            title: "Editado correctamente!",
          });
        }

        getAllEvents();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCancelEdition = () => {
    setIsEditing({});
    reset();
  };

  const handleEventDetails = (
    event: any,
    { event_id, description, cost, event_date, address }: FormValues
  ) => {
    event.preventDefault();
    event.stopPropagation();

    Swal.fire({
      title: `Descripción: ${description}<br/> Costo: ${cost}<br/> Fecha: ${new Date(
        event_date
      ).toLocaleDateString("es-AR", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      })}<br/> Dirección: ${address}`,

      showCloseButton: true,
      showCancelButton: true,
      confirmButtonColor: "rgba(23, 162, 184, 1)",
      confirmButtonText: "Editar",
      cancelButtonColor: "rgba(220, 53, 69, 1)",
      cancelButtonText: "Eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        handleEditEvent(event, {
          event_id,
          description,
          cost,
          event_date,
          address,
        });
      } else if (result.dismiss === Notification.DismissReason.cancel) {
        handleConfirmDelete(event, event_id);
      }
    });
  };

  useEffect(() => {
    getAllEvents();
  }, []);

  return (
    <Container>
      <h1 className="text-info my-4">Nuevo Evento</h1>

      <Form
        onSubmit={handleSubmit(submitEvent)}
        className="d-flex flex-column gap-4"
      >
        <Form.Group controlId="description">
          <Form.Label>Nombre / Descripción</Form.Label>
          <Form.Control
            className="form-control bg-dark bg-opacity-75 text-info border-info"
            type="text"
            placeholder="Ingrese un nombre para el evento."
            {...register("description", { required: true })}
          />
          {errors.description && (
            <Alert variant="danger">Ingrese un nombre para el evento.</Alert>
          )}
        </Form.Group>

        <Form.Group controlId="cost">
          <Form.Label>Costo</Form.Label>
          <Form.Control
            placeholder="Ingrese el costo del stand/evento."
            className="form-control bg-dark bg-opacity-75 text-info border-info"
            type="number"
            {...register("cost", { required: true, min: 0 })}
          />
          {errors.cost?.type === "required" && (
            <Alert variant="danger">Ingrese el costo del stand.</Alert>
          )}
          {errors.cost?.type === "min" && (
            <Alert variant="danger">Costo debe ser mayor o igual a 0</Alert>
          )}
        </Form.Group>

        <Form.Group controlId="event_date">
          <Form.Label>Fecha de Realización</Form.Label>
          <Form.Control
            className="form-control bg-dark bg-opacity-75 text-info border-info"
            type="date"
            {...register("event_date", { required: true })}
          />
          {errors.event_date && (
            <Alert variant="danger">Ingrese la fecha del evento.</Alert>
          )}
        </Form.Group>

        <Form.Group controlId="address">
          <Form.Label>Lugar / Dirección</Form.Label>
          <Form.Control
            placeholder="Ingrese el lugar de realización del evento."
            className="form-control bg-dark bg-opacity-75 text-info border-info"
            type="text"
            {...register("address", { required: true })}
          />
          {errors.address && (
            <Alert variant="danger">
              Ingrese el lugar o dirección del evento
            </Alert>
          )}
        </Form.Group>

        {Object.keys(isEditing).length > 0 ? (
          <span className="d-flex gap-4 mx-4">
            <Button
              className="btn bg-info bg-opacity-25 shadow-lg mt-4 w-50"
              type="button"
              onClick={handleConfirmEdition}
            >
              Confirmar Edición
            </Button>
            <Button
              className="btn bg-dark btn-outline-light bg-opacity-25 shadow-lg mt-4  w-50"
              type="button"
              onClick={handleCancelEdition}
            >
              Cancelar
            </Button>
          </span>
        ) : (
          <Button className="btn btn-info shadow-lg mt-4" type="submit">
            Finalizar
          </Button>
        )}
      </Form>

      {addedEvents.length > 0 && (
        <>
          <p className="text-info mt-5">Eventos ingresados</p>
          <Container className="p-2 border-info border rounded d-flex justify-content-center gap-2 flex-wrap">
            {addedEvents.map((event: FormValues) => (
              <span
                onClick={(e) => handleEventDetails(e, event)}
                key={event.event_id}
                style={{ cursor: "pointer" }}
                className="bg-info bg-opacity-25 py-1 px-3 rounded d-flex gap-2 align-items-center justify-content-between "
              >
                <span
                  style={{
                    textTransform: "capitalize",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                >
                  {event.description}
                </span>
                <span className="">{event.cost}</span>
                <span className="">
                  {new Date(event.event_date).toLocaleDateString("es-AR", {
                    month: "2-digit",
                    day: "2-digit",
                    year: "numeric",
                  })}
                </span>
                <span className="">{event.address}</span>
                <span className="py-1 s px-2 rounded gap-2 position-relative displayButtons">
                  {confirmDelete === event.event_id && (
                    <div
                      style={{ translate: -30 }}
                      className="confirmDeletionButtons d-flex position-absolute bottom-100 gap-2 p-1"
                    >
                      <button
                        type="button"
                        onClick={(e) => handleConfirmDelete(e, event.event_id)}
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
                        style={{ width: 40, height: 40, zIndex: 100 }}
                        className="btn btn-danger shadow-lg d-flex justify-content-center align-items-center rounded-circle p-2"
                      >
                        <RxCross2 size={18} />
                      </button>
                    </div>
                  )}
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={(e) => handleDeleteEvent(e, event.event_id)}
                  >
                    <RxTrash size={20} />
                  </Button>
                  <Button
                    variant="outline-info"
                    size="sm"
                    onClick={(e) => handleEditEvent(e, event)}
                  >
                    <RxPencil1 size={20} />
                  </Button>
                </span>
              </span>
            ))}
          </Container>
        </>
      )}
    </Container>
  );
};

export default NewEvent;
