import { useState, useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Button, Container, Form } from "react-bootstrap";
import { RxTrash } from "react-icons/rx";
import AxiosInstance from "../../config/apiClient";

type FormData = {
  event: string;
  discount: number;
  paymentMethod: string;
  products: {
    product_id: string;
    quantity: number;
  }[];
  totalPrice: number;
};

type EventOptions = {
  label: string;
  value: {
    event_id: number;
    description: string;
    cost: number;
    event_date: string;
    address: string;
  };
};

type ProductOptions = {
  label: string;
  value: {
    product_id: string;
    price: string;
    description: string;
  };
};

type SelectedProductItem = {
  product: Product;
  quantity: number;
};

type Product = {
  product_id: string;
  description: string;
  price: number;
};

const NewOrder = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [selectedProducts, setSelectedProducts] = useState<
    SelectedProductItem[]
  >([]);

  const [productOptions, setProductOptions] = useState<[]>([]);

  const [productsData, setProductsData] = useState<Product[]>([]);
  const [productQuantity, setProductQuantity] = useState<number>(1);

  const [eventsData, setEventsData] = useState<[]>([]);

  const {
    control,
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const getAllProducts = async () => {
    await AxiosInstance.get("/products")
      .then((response) => {
        let data = response["data"].rows;

        const draft = data.map((product: any) => ({
          label: product.description,
          value: {
            price: product.price,
            description: product.description,
          },
        }));

        setProductsData(data);
        setProductOptions(draft);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getAllEvents = async () => {
    await AxiosInstance.get("/events")
      .then((response) => {
        let data = response["data"].rows;

        const draft = data.map((event: any) => ({
          label: event.description,
          value: {
            event_id: event.event_id,
            cost: event.cost,
            event_date: event.event_date,
            address: event.address,
          },
        }));

        setEventsData(draft);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onSubmit = async (data: FormData) => {
    let draft = {
      event_id: JSON.parse(data.event),
      discount: data.discount || 0,
      payment_method: data.paymentMethod,
      orderProducts: selectedProducts,
    };

    await AxiosInstance.post("/orders/add", draft)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleAddProduct = () => {
    selectedProduct;
    productQuantity;
    if (selectedProduct) {
      setSelectedProducts([
        ...selectedProducts,
        { product: selectedProduct, quantity: productQuantity },
      ]);
    }
  };

  const handleRemoveProduct = (index: number) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts.splice(index, 1);
    setSelectedProducts(updatedProducts);
  };

  const handleSelectProduct = (event: any) => {
    const setProduct: Product | undefined = productsData?.find(
      (product) => product.description === event.target.value
    );
    setSelectedProduct(setProduct);
  };

  const totalPrice = useMemo(() => {
    return selectedProducts.reduce((sum, addedProduct) => {
      const productPrice = Number(
        addedProduct.product.price
          .toString()
          .replace(/\./g, "")
          .replace(",", ".")
          .replace(/\$/g, "")
      );
      return sum + productPrice * addedProduct.quantity;
    }, 0);
  }, [selectedProducts]);

  useEffect(() => {
    getAllProducts();
    getAllEvents();
  }, []);

  return (
    <Container>
      <h1 className="text-info my-4">Nueva Orden</h1>
      <Form
        onSubmit={handleSubmit(onSubmit)}
        className="d-flex flex-column gap-4"
      >
        {/* Event */}
        <Form.Group controlId="formEvent">
          <Form.Label>Evento</Form.Label>
          <Controller
            name="event"
            control={control}
            rules={{ required: "Seleccione un Evento" }}
            render={({ field: { value, onChange } }) => (
              <Form.Select
                className="form-control bg-dark bg-opacity-75 text-info border-info"
                value={value}
                style={{ textTransform: "capitalize" }}
                onChange={onChange}
              >
                <option value={""}>Seleccione</option>
                {eventsData.map((eventOption: EventOptions, i: number) => (
                  <option key={i} value={eventOption.value.event_id}>
                    {eventOption.label} -{" "}
                    {new Date(
                      eventOption.value.event_date
                    ).toLocaleDateString()}
                  </option>
                ))}
              </Form.Select>
            )}
          />
          {errors.event && <Form.Text>{errors.event.message}</Form.Text>}
        </Form.Group>

        {/* Payment Method */}
        <Form.Group controlId="formPaymentMethod">
          <Form.Label>Método de Pago</Form.Label>
          <Controller
            name="paymentMethod"
            control={control}
            rules={{ required: "Seleccione un método de pago" }}
            render={({ field: { value, onChange } }) => (
              <Form.Select
                className="form-control bg-dark bg-opacity-75 text-info border-info"
                value={value}
                onChange={onChange}
              >
                <option value={""}>Seleccione</option>
                <option value="efectivo">Efectivo</option>
                <option value="transferencia">Transferencia</option>
              </Form.Select>
            )}
          />
          {errors.paymentMethod && (
            <Form.Text>{errors.paymentMethod.message}</Form.Text>
          )}
        </Form.Group>

        {/* Products - Quantity */}
        <Form.Group
          controlId="formProducts"
          className="d-flex gap-3 align-items-end justify-content-stretch"
        >
          {/* Product */}
          <div className="col-md-8">
            <Form.Label>Productos</Form.Label>
            <Controller
              name="products"
              control={control}
              render={({ field: { onChange } }) => (
                <Form.Select
                  style={{ textTransform: "capitalize" }}
                  className="form-control bg-dark bg-opacity-75 text-info border-info"
                  onChange={(e) => handleSelectProduct(e)}
                >
                  <option value={""}>Seleccione</option>
                  {productOptions.map(
                    (productOption: ProductOptions, i: number) => (
                      <option key={i} value={productOption.value.description}>
                        {productOption.label} -{productOption.value.price}
                      </option>
                    )
                  )}
                </Form.Select>
              )}
            />
          </div>

          {/* Quantity */}
          <div className="col-md-2 col-small">
            <Form.Group controlId="quantity">
              <Form.Label>Cantidad</Form.Label>
              <input
                className="form-control bg-dark bg-opacity-75 text-info border-info"
                type="number"
                defaultValue={1}
                onChange={(e) => setProductQuantity(parseInt(e.target.value))}
              />
            </Form.Group>
          </div>

          <div className="col-md-2 col-small">
            <button
              className="btn btn-info"
              style={{ maxHeight: 38 }}
              type="button"
              onClick={handleAddProduct}
            >
              +
            </button>
          </div>
        </Form.Group>

        {selectedProducts?.length > 0 && (
          <Container fluid className="mt-4">
            <Form.Label className="text-info">
              Productos Seleccionados
            </Form.Label>

            <ul className="rounded border border-info shadow-lg p-4 ">
              {selectedProducts.map((addedProduct: any, index: number) => (
                <li
                  style={{
                    maxWidth: 600,
                    minWidth: 200,
                    textTransform: "capitalize",
                  }}
                  className="list-unstyled border gap-4 d-flex align-items-center justify-content-between border-info bg-opacity-25 bg-info my-2 py-1 px-2 rounded"
                  key={index}
                >
                  <span>{addedProduct.product.description} </span>
                  <span>{addedProduct.product.price}</span>
                  <span>({addedProduct.quantity})</span>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleRemoveProduct(index)}
                  >
                    <RxTrash size={24} />
                  </Button>
                </li>
              ))}
            </ul>

            <div className="text-info text-center">
              Total a cobrar: <b>${totalPrice}</b>
            </div>
          </Container>
        )}

        {errors.products && <Form.Text>{errors.products.message}</Form.Text>}

        {/* Discount */}
        <Form.Group controlId="formDiscount">
          <Form.Label>Descuento</Form.Label>
          <Controller
            name="discount"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Form.Control
                defaultValue={0}
                className="bg-dark bg-opacity-75 text-info border-info"
                type="number"
                step="1"
                value={value}
                onChange={onChange}
              />
            )}
          />
        </Form.Group>

        <Button className="btn btn-info shadow-lg mt-4" type="submit">
          Finalizar
        </Button>
      </Form>
    </Container>
  );
};

export default NewOrder;
