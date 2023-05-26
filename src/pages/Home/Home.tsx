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
import { Chart } from "react-google-charts";

const cardsData = [
  { title: "Productos", icon: <BiBox />, href: "/new-product" },
  { title: "Eventos", icon: <BsCalendarWeek />, href: "/new-event" },
  { title: "Ordenes", icon: <MdOutlinePointOfSale />, href: "/new-order" },
  { title: "Info", icon: <MdInfoOutline />, href: "/info" },
];

const Home = () => {
  const [lastEvents, setLastEvents] = useState<Event[]>([]);
  const [popularProducts, setPopularProducts] = useState<PopularProduct[]>([]);
  const [popularPayMethods, setPopularPayMethods] = useState<{
    efectivo: number | null;
    transferencia: number | null;
  }>({
    efectivo: null,
    transferencia: null,
  });

  const getLastEvents = async () => {
    await AxiosInstance.get("/events/getLastEvents")
      .then((response) => {
        let addedEvents: Event[] = response["data"].rows;
        setLastEvents(addedEvents);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getPopularPayMethods = async () => {
    await AxiosInstance.get("/events/getPopularPayMethods")
      .then((response) => {
        let payMethods = response.data["rows"];
        setPopularPayMethods(payMethods[0]);
      })
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
  };

  const data = [
    ["Category", "Amount"],
    ["Efectivo", popularPayMethods.efectivo],
    ["Transferencia", popularPayMethods.transferencia],
  ];

  const options = {
    legend: "none",
    pieSliceText: "label",
    colors: ["#0dcaf0", "#6f42c1"],
    pieSliceTextStyle: {
      color: "black",
    },

    backgroundColor: "transparent",
  };
  useEffect(() => {
    getLastEvents();
    getPopularProducts();
    getPopularPayMethods();
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
              <Col md={6} xl={5} className="">
                <h3 className="text-center mb-0 mt-4">
                  <BiStar /> Métodos de Pago <BiStar />
                </h3>
                <div className="d-flex align-items-center justify-content-center">
                  <Chart
                    chartType="PieChart"
                    data={data}
                    options={options}
                    width="400px"
                    height="400px"
                    legendToggle
                  />
                </div>
                <h3 className="text-center mt-0 mb-4">
                  <BiStar /> Productos <BiStar />
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
