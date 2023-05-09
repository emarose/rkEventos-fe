import { Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const MyNavbar = () => {
  return (
    <Navbar
      variant="dark"
      bg="transparent"
      expand="md"
      className="shadow"
      style={{ padding: "15px 30px" }}
    >
      <LinkContainer to="/">
        <Nav.Link>
          <h3 style={{ marginRight: 30 }}>
            <b>Inicio</b>
          </h3>
        </Nav.Link>
      </LinkContainer>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <LinkContainer to="/new-product">
            <Nav.Link>Nuevo Producto</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/new-event">
            <Nav.Link>Nuevo Evento</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/new-order">
            <Nav.Link>Nueva Orden</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/info">
            <Nav.Link>Info</Nav.Link>
          </LinkContainer>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default MyNavbar;
