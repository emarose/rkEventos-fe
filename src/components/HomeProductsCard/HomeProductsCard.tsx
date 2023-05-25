import { Card, Col, Row } from "react-bootstrap";
import { BiStar } from "react-icons/bi";
import { PopularProduct } from "../../types/types";

type HomeProductsCardProps = {
  products: PopularProduct[];
};

const HomeProductsCard = (popularProducts: HomeProductsCardProps) => {
  return (
    <Card
      bg="dark"
      text="light"
      className="shadow-lg bg-opacity-75"
      id="homeEventCard"
    >
      <Card.Body className="">
        <table className="table-borderless w-100">
          <thead style={{ textAlign: "center" }}>
            <tr className="border-bottom border-info">
              <th
                style={{
                  textAlign: "left",
                  fontWeight: 500,
                  paddingInlineStart: 15,
                }}
              >
                Producto
              </th>
              <th style={{ textAlign: "center", fontWeight: 500 }}>Cantidad</th>
              <th
                style={{
                  textAlign: "right",
                  fontWeight: 500,
                  paddingInlineEnd: 15,
                }}
              >
                Ganancias
              </th>
            </tr>
          </thead>
          <tbody>
            {popularProducts.products.map((product: PopularProduct) => (
              <tr key={product.product_id}>
                <td style={{ textTransform: "capitalize" }}>
                  {product.description}
                </td>
                <td style={{ textAlign: "center" }}>{product.quantity}</td>
                <td
                  className="text-info"
                  style={{ textAlign: "right", fontWeight: 600 }}
                >
                  {product.profits_currency}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card.Body>
    </Card>
  );
};

export default HomeProductsCard;
