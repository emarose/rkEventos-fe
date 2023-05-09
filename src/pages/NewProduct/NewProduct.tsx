import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Form, Button, Container } from "react-bootstrap";
import { RxPencil1, RxCheck, RxTrash, RxCross2 } from "react-icons/rx";
import AxiosInstance from "../../config/apiClient";
import Notification from "../../components/Notification/Notification";
import Swal from "sweetalert2";

type FormValues = {
  product_id: number;
  price: number;
  description: string;
};

const NewProduct: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

  const [addedProducts, setAddedProducts] = useState<FormValues[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<Number | null>(null);
  const [isEditing, setIsEditing] = useState<Object>({});

  const submitProduct = async (data: FormValues) => {
    await AxiosInstance.post("/products/add", data)
      .then((response) => {
        if (response.status === 200) {
          Notification.fire({
            icon: "success",
            position: "bottom",
            title: "Producto ingresado exitosamente!",
          });

          reset();
          getAllProducts();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getAllProducts = async () => {
    await AxiosInstance.get("/products")
      .then((response) => {
        let addedProducts = response["data"].rows;
        setAddedProducts(addedProducts /* .slice(0, 10) */);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleConfirmDelete = async (event: any, product_id: number) => {
    event.stopPropagation();

    await AxiosInstance.delete(`/products/${product_id}`)
      .then((response) => {
        getAllProducts();
        reset();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDeleteProduct = (event: any, product_id: number) => {
    event.stopPropagation();
    setConfirmDelete(product_id);
  };

  const handleEditProduct = (
    event: any,
    { product_id, description, price }: FormValues
  ) => {
    event.stopPropagation();
    setIsEditing({
      product_id: product_id,
      description: description,
      price: price,
    });
    setValue("description", description);
    setValue(
      "price",
      Number(
        price.toString().replace(/\./g, "").replace(",", ".").replace(/\$/g, "")
      )
    );
  };

  const handleConfirmEdition = async () => {
    let editionValues = Object.values(isEditing);
    let product_id = editionValues[0];

    let newDescription = watch("description");
    let newPrice = watch("price");

    let newData = {
      product_id: product_id,
      description: newDescription,
      price: newPrice,
    };

    await AxiosInstance.put(`/products/${product_id}`, newData)
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

        getAllProducts();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCancelEdition = () => {
    setIsEditing({});
    reset();
  };

  const handleProductDetails = (
    event: any,
    { product_id, price, description }: FormValues
  ) => {
    event.preventDefault();
    event.stopPropagation();

    Swal.fire({
      title: `Descripción: ${description}<br/>Precio: ${price}`,
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonColor: "rgba(23, 162, 184, 1)",
      confirmButtonText: "Editar",
      cancelButtonColor: "rgba(220, 53, 69, 1)",
      cancelButtonText: "Eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        handleEditProduct(event, { product_id, price, description });
      } else if (result.dismiss === Notification.DismissReason.cancel) {
        handleConfirmDelete(event, product_id);
      }
    });
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <Container>
      <h1 className="text-info my-4">Nuevo Producto</h1>
      <Form
        onSubmit={handleSubmit(submitProduct)}
        className="d-flex flex-column gap-4"
      >
        <Form.Group controlId="description">
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            className="form-control bg-dark bg-opacity-75 text-info border-info"
            isInvalid={!!errors.description}
            type="text"
            placeholder="Ingrese una descripción para el producto."
            {...register("description", { required: true })}
          />
          {errors.description && (
            <Form.Text className="text-danger">
              Ingrese la descripción del producto.
            </Form.Text>
          )}
        </Form.Group>

        <Form.Group controlId="price">
          <Form.Label>Precio</Form.Label>
          <Form.Control
            className="form-control bg-dark bg-opacity-75 text-info border-info"
            isInvalid={!!errors.price}
            type="number"
            placeholder="$"
            {...register("price", { required: true, min: 0 })}
          />
          {errors.price?.type === "required" && (
            <Form.Text className="text-danger">
              Ingrese el precio del producto.
            </Form.Text>
          )}
          {errors.price?.type === "min" && (
            <Form.Text className="text-danger">Precio mínimo: 0</Form.Text>
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
          <Button className="btn btn-info shadow-lg my-4" type="submit">
            Finalizar
          </Button>
        )}
      </Form>

      {addedProducts.length > 0 && (
        <>
          <h5 className="text-info text-center mb-4 mt-5">
            Productos Ingresados
          </h5>
          <Container style={{ maxWidth: 1000 }} className="">
            {addedProducts.map((product: FormValues) => (
              <div
                onClick={(e) => handleProductDetails(e, product)}
                key={product.product_id}
                style={{
                  cursor: "pointer",
                  border: "1px solid transparent",
                }}
                className="bg-info p-2 my-1 bg-opacity-25 rounded"
              >
                <div className="mx-1 row d-flex align-items-center">
                  <span
                    className="col-md-7"
                    style={{
                      textTransform: "capitalize",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {product.description}
                  </span>
                  <span className="col-md-3">{product.price}</span>
                  <span className="col-md-1 rounded gap-2 position-relative displayButtons">
                    {confirmDelete === product.product_id && (
                      <div
                        style={{ translate: -30 }}
                        className="confirmDeletionButtons d-flex position-absolute bottom-100 gap-2 p-1"
                      >
                        <button
                          type="button"
                          onClick={(e) =>
                            handleConfirmDelete(e, product.product_id)
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
                      onClick={(e) =>
                        handleDeleteProduct(e, product.product_id)
                      }
                    >
                      <RxTrash size={20} />
                    </Button>
                    <Button
                      variant="outline-info"
                      size="sm"
                      onClick={(e) => handleEditProduct(e, product)}
                    >
                      <RxPencil1 size={20} />
                    </Button>
                  </span>
                </div>
              </div>
            ))}
          </Container>
        </>
      )}
    </Container>
  );
};

export default NewProduct;
