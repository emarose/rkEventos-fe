import { useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { BsCalendarWeek } from "react-icons/bs";
import { BiBox, BiStar } from "react-icons/bi";
import { MdInfoOutline, MdOutlinePointOfSale } from "react-icons/md";
import HomeLinkCard from "../../components/HomeLinkCard/HomeLinkCard";
import HomeEventCard from "../../components/HomeEventCard/HomeEventCard";
import AxiosInstance from "../../config/apiClient";
import { Event, PopularProduct } from "../../types/types";
import HomeProductsCard from "../../components/HomeProductsCard/HomeProductsCard";

const cardsData = [
  { title: "Productos", icon: <BiBox />, href: "/new-product" },
  { title: "Eventos", icon: <BsCalendarWeek />, href: "/new-event" },
  { title: "Ordenes", icon: <MdOutlinePointOfSale />, href: "/new-order" },
  { title: "Info", icon: <MdInfoOutline />, href: "/info" },
];

const Home = () => {
  const [lastEvents, setLastEvents] = useState<Event[]>([]);
  const [popularProducts, setPopularProducts] = useState<PopularProduct[]>([]);

  const getLastEvents = async () => {
    await AxiosInstance.get("/events/getLastEvents")
      .then((response) => {
        console.log(response["data"].rows);
        let addedEvents: Event[] = response["data"].rows;
        setLastEvents(addedEvents);
      })
      .catch((error) => {
        console.log(error);
      });

    await AxiosInstance.get("/events/getById/6")
      .then((response) => {})
      .catch((error) => {
        console.log(error);
      });
  };

  const getPopularProducts = async () => {
    await AxiosInstance.get("/products/getPopularProducts")
      .then((response) => {
        let popularProducts: PopularProduct[] = response.data;

        setPopularProducts(popularProducts);
      })
      .catch((error) => {
        console.log(error);
      });

    await AxiosInstance.get("/events/getById/6")
      .then((response) => {})
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getLastEvents();
    getPopularProducts();
  }, []);

  return (
    <>
      <Container fluid className="d-grid gap-5">
        <Container
          fluid
          className="d-flex flex-wrap align-items-center justify-content-evenly gap-4"
        >
          {cardsData.map((cardData, index) => (
            <HomeLinkCard
              key={index}
              title={cardData.title}
              icon={cardData.icon}
              href={cardData.href}
            />
          ))}
        </Container>
        <Container
          fluid
          className="d-flex flex-column gap-3"
          style={{ maxWidth: 1400 }}
        >
          <Row className="d-flex align-items-stretch justify-content-center">
            {lastEvents.length > 0 && (
              <Col md={6} xl={7}>
                <h3 className="text-center mt-3 mb-4">Últimos Eventos</h3>
                {lastEvents.map((event: Event, i: number) => (
                  <div key={i} className="my-4">
                    <HomeEventCard event={event} />
                  </div>
                ))}
              </Col>
            )}
            {popularProducts.length > 0 && (
              <Col md={6} xl={5}>
                <h3 className="text-center mt-3 mb-4">
                  Productos Más Populares
                </h3>
                <HomeProductsCard products={popularProducts} />
              </Col>
            )}
            {!popularProducts && !lastEvents && ""}
          </Row>
        </Container>
      </Container>
    </>
  );
};

export default Home;
