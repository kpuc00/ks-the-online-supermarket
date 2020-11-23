import React from "react"
import { Link } from "react-router-dom"
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import { Badge, NavDropdown, OverlayTrigger, Tooltip } from "react-bootstrap"
import { FaShoppingCart } from 'react-icons/fa'

const NavigationBar = ({ currentUser, showModeratorBoard, showAdminBoard, logOut, cartCount }) => {
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
          </Nav>

          {currentUser ? (
            <Nav>
              {cartCount > 0 &&
                <OverlayTrigger
                  placement="bottom"
                  overlay={
                    <Tooltip id={`tooltip-bottom`}>
                      {`${cartCount} items in your cart`}
                    </Tooltip>
                  }
                >
                  <Nav.Item>
                    <Nav.Link as={Link} to="/cart">
                      <FaShoppingCart /> Cart <Badge variant="secondary">{cartCount}</Badge>
                    </Nav.Link>
                  </Nav.Item>
                </OverlayTrigger>
              }
              <NavDropdown title={currentUser.firstName} id="basic-nav-dropdown" alignRight>
                <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
                <NavDropdown.Item href="/orders">My orders</NavDropdown.Item>
                {showAdminBoard && (
                  <React.Fragment>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="/productsmanager">Stock manager</NavDropdown.Item>
                    <NavDropdown.Item href="/usersmanager">Users manager</NavDropdown.Item>
                  </React.Fragment>
                )}
                <NavDropdown.Divider />
                <NavDropdown.Item href="/" onClick={logOut}>Logout</NavDropdown.Item>
              </NavDropdown>
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