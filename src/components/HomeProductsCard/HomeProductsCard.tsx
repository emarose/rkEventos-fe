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
      className="shadow-lg bg-opacity-75 gap-2"
      id="homeEventCard"
    >
      {popularProducts.products.map((product: PopularProduct) => (
        <Card.Body className="border-bottom border-info ">
          <Row
            key={product.product_id}
            className="d-flex align-items-center justify-content-center"
          >
            <Col sm={6} md={6}>
              <p>{product.description}</p>
            </Col>
            <Col sm={3} md={3}>
              <p className="text-info text-center text-nowrap">
                Cantidad
                <small
                  className="d-block"
                  style={{ fontWeight: 500, fontSize: "larger" }}
                >
                  {product.quantity}
                </small>
              </p>
            </Col>
            <Col sm={3} md={3} className="text-right text-nowrap">
              <p className="text-info">
                Ganancias
                <small
                  className="d-block fs-5"
                  style={{ fontWeight: 500, letterSpacing: 0.85 }}
                >
                  {product.profits_currency}
                </small>
              </p>
            </Col>
          </Row>
        </Card.Body>
      ))}
    </Card>
  );
};

export default HomeProductsCard;
