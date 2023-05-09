import { Button, Card, Col, Row } from "react-bootstrap";
import {
  AiOutlineDollarCircle,
  AiOutlineFall,
  AiOutlineRise,
} from "react-icons/ai";
import { RiVipCrownLine } from "react-icons/ri";
import { Event } from "../../types/types";
import { useNavigate } from "react-router-dom";

interface HomeEventCardProps {
  event: Event;
}

const HomeEventCard = ({ event }: HomeEventCardProps) => {
  const navigate = useNavigate();

  return (
    <Card
      bg="dark"
      text="light"
      className="shadow-lg px-4 bg-opacity-75"
      id="homeEventCard"
    >
      <Card.Body>
        <Row>
          {/* Left side */}
          <Col
            style={{ minWidth: "18ch" }}
            md={4}
            className="border rounded border-info py-4 px-3 d-flex flex-column gap-2 justify-content-center align-align-items-center"
          >
            <Card.Title className="text-info text-capitalize fs-4">
              {event.description}
            </Card.Title>
            <span className="d-flex align-align-items-center justify-content-start gap-3">
              <Card.Subtitle className="mb-3 text-muted text-capitalize">
                {event.address}
              </Card.Subtitle>
              <Card.Subtitle className="mb-3 text-muted text-capitalize">
                {new Date(event.event_date).toLocaleDateString()}
              </Card.Subtitle>
            </span>
            <Button
              variant="info"
              onClick={() => navigate(`/info/${event.event_id}`)}
            >
              Ver Evento
            </Button>
          </Col>
          {/* Right side */}
          <Col md={8}>
            <Row className="border-bottom border-info">
              <Col
                xs={6}
                md={6}
                className="d-flex flex-column align-items-center justify-content-center py-3"
              >
                {/* Upper left */}
                <div className="text-center">
                  <Card.Title className="text-info">Balance</Card.Title>
                  <div className="my-2">
                    {event.balance >= 1 ? (
                      <>
                        <AiOutlineRise size={40} className="mb-2" />
                        <Card.Subtitle className="">Positivo</Card.Subtitle>
                      </>
                    ) : (
                      <>
                        <AiOutlineFall size={40} className="mb-2" />
                        <Card.Subtitle className="">Negativo</Card.Subtitle>
                      </>
                    )}
                  </div>
                </div>
              </Col>
              <Col
                xs={6}
                md={6}
                className="d-flex flex-column align-items-center justify-content-center py-3"
              >
                <div className="text-center">
                  <Card.Title className="text-info">Ganancias</Card.Title>
                  <div className="my-2">
                    <AiOutlineDollarCircle size={40} className="mb-2" />
                    <Card.Subtitle className="">
                      {event.balance_currency}
                    </Card.Subtitle>
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col
                md={12}
                className="d-flex align-items-center justify-content-center gap-5 py-4"
              >
                {/* Bottom */}
                <div className="text-center">
                  <RiVipCrownLine size={32} />
                  <Card.Title className="text-info">Mejor Orden</Card.Title>
                  <Card.Subtitle className="">
                    #{event.best_order.order_id} -{" "}
                    {event.best_order.order_total}
                  </Card.Subtitle>
                </div>
                <Button
                  variant="info"
                  className="text-nowrap"
                  onClick={() =>
                    navigate(
                      `/info/${event.event_id}/${event.best_order.order_id}`
                    )
                  }
                >
                  Ver Orden
                </Button>
              </Col>
              <Col
                md={6}
                className="d-flex justify-content-center gap-3 align-items-center"
              ></Col>
            </Row>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default HomeEventCard;
