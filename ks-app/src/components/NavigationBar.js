import React from "react";
import {Link} from "react-router-dom";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

function NavigationBar() {
  return (
    <div>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Nav.Item>
          <Navbar.Brand as={Link} to="/">KS Supermarket</Navbar.Brand>
        </Nav.Item>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Item>
              <Nav.Link as={Link} to="/products">Products</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="/offers">Offers</Nav.Link>
            </Nav.Item>
          </Nav>
          <Nav>
            <Nav.Link as={Link} to="/customers">Customers</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}

export default NavigationBar;