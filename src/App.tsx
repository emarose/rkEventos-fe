import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import MyNavbar from "./components/MyNavbar/MyNavbar";
import NewOrderForm from "./pages/NewOrder/NewOrder";
import NewEventForm from "./pages/NewEvent/NewEvent";
import NewProductForm from "./pages/NewProduct/NewProduct";
import Info from "./pages/Info/Info";
import Home from "./pages/Home/Home";
import { Container } from "react-bootstrap";
import "./App.css";
import "react-calendar/dist/Calendar.css";

const App = () => {
  return (
    <BrowserRouter>
      <MyNavbar />
      <Container
        fluid
        style={{
          maxWidth: 1400,
          paddingBlock: 50,
        }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/info/:params_eventid?/:params_orderid?"
            element={<Info />}
          />
          <Route path="/new-order" element={<NewOrderForm />} />
          <Route path="/new-event" element={<NewEventForm />} />
          <Route path="/new-product" element={<NewProductForm />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
};

export default App;
