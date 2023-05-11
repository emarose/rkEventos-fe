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
      {popularProducts.products.map(
        (product: PopularProduct, index: number) => (
          <Card.Body
            className="border-bottom border-info"
            key={product.product_id}
          >
            <Row
              key={product.product_id}
              className="d-flex align-items-center justify-content-center"
            >
              <Col sm={7} md={7} className="align-self-end">
                <p className="text-info text-center text-nowrap " style={{}}>
                  {index === 0 && "Producto"}
                  <small
                    className="d-block "
                    style={{
                      fontSize: "larger",
                      textOverflow: "ellipsis",
                      width: "100%",

                      overflow: "hidden",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {product.description}
                  </small>
                </p>
              </Col>
              <Col sm={2} md={2}>
                <p className="text-info text-center text-nowrap">
                  {index === 0 && "Cantidad"}
                  <small
                    className="d-block"
                    style={{ fontWeight: 500, fontSize: "larger" }}
                  >
                    {product.quantity}
                  </small>
                </p>
              </Col>
              <Col sm={3} md={3} className="text-right text-nowrap">
                <p className="text-info ">
                  {index === 0 && "Ganancias"}
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
        )
      )}
    </Card>
  );
};

export default HomeProductsCard;
