import React from "react"
import { Link } from "react-router-dom"
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'

const NavigationBar = ({ currentUser, showModeratorBoard, showAdminBoard, logOut }) => {
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
            {showModeratorBoard && (
              <Nav.Item>
                <Nav.Link as={Link} to="/mod">Moderator Board</Nav.Link>
              </Nav.Item>
            )}
            {showAdminBoard && (
              <Nav.Item>
                <Nav.Link as={Link} to="/admin">Admin Board</Nav.Link>
              </Nav.Item>
            )}
            {currentUser && (
              <Nav.Item>
                <Nav.Link as={Link} to="/user">User</Nav.Link>
              </Nav.Item>
            )}
            {/* <Nav.Item>
              <Nav.Link as={Link} to="/offers">Offers</Nav.Link>
            </Nav.Item> */}
          </Nav>

          {/* <Nav.Link as={Link} to="/productsmanager">Products manager</Nav.Link>
            <Nav.Link as={Link} to="/customers">Customers</Nav.Link> */}

          {currentUser ? (
            <Nav>
              <Nav.Link as={Link} to="/profile">{currentUser.username}</Nav.Link>
              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={logOut}>
                  Logout
                </a>
              </li>
            </Nav>
          ) : (
              <Nav>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </Nav>
            )}
        </Navbar.Collapse>
      </Navbar>
    </div>
  )
}

export default NavigationBar