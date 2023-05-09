import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { BsCalendarWeek } from "react-icons/bs";
import { BiBox } from "react-icons/bi";
import { MdInfoOutline, MdOutlinePointOfSale } from "react-icons/md";
import HomeLinkCard from "../../components/HomeLinkCard/HomeLinkCard";
import HomeEventCard from "../../components/HomeEventCard/HomeEventCard";
import AxiosInstance from "../../config/apiClient";
import { Event } from "../../types/types";

const cardsData = [
  { title: "Productos", icon: <BiBox />, href: "/new-product" },
  { title: "Eventos", icon: <BsCalendarWeek />, href: "/new-event" },
  { title: "Ordenes", icon: <MdOutlinePointOfSale />, href: "/new-order" },
  { title: "Info", icon: <MdInfoOutline />, href: "/info" },
];

const Home = () => {
  const [lastEvents, setLastEvents] = useState<Event[]>([]);

  const getLastEvents = async () => {
    await AxiosInstance.get("/events/getLastEvents")
      .then((response) => {
        let addedEvents: Event[] = response["data"].rows;

        setLastEvents(addedEvents.slice(0, 10));
      })
      .catch((error) => {
        console.log(error);
      });

    await AxiosInstance.get("/events/getById/6")
      .then((response) => {
        response.data.map((el: any) => console.log(el));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getLastEvents();
  }, []);

  return (
    <>
      <Container className="d-grid gap-5">
        <Container className="d-flex flex-wrap align-items-center justify-content-evenly gap-4">
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
          className="d-flex flex-column gap-3"
          style={{ maxWidth: 900 }}
        >
          <h3 className="text-center mt-3 mb-4">Últimos Eventos</h3>
          {lastEvents.map((event: Event, i: number) => (
            <div key={i}>
              <HomeEventCard event={event} />
            </div>
          ))}
        </Container>
      </Container>
    </>
  );
};

export default Home;
