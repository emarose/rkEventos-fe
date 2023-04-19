import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import MyNavbar from "./components/MyNavbar/MyNavbar";
import NewOrderForm from "./pages/NewOrder/NewOrder";
import NewEventForm from "./pages/NewEvent/NewEvent";
import NewProductForm from "./pages/NewProduct/NewProduct";
import ViewOrders from "./pages/ViewOrders/ViewOrders";
import Home from "./pages/Home/Home";
import { Container } from "react-bootstrap";
import "./App.css";

const App = () => {
  return (
    <BrowserRouter>
      <MyNavbar />
      <Container
        style={{
          maxWidth: 1000,
          paddingBlock: 50,
        }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/view-orders" element={<ViewOrders />} />
          <Route path="/new-order" element={<NewOrderForm />} />
          <Route path="/new-event" element={<NewEventForm />} />
          <Route path="/new-product" element={<NewProductForm />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
};

export default App;
