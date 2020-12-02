import React, { Component } from "react";
import { Container, Col, Row } from "react-bootstrap";
import AuthService from "../../services/auth-service";

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: AuthService.getCurrentUser()
    };
  }

  render() {
    const { currentUser } = this.state;
    if (!currentUser) {
      this.props.history.push("/login");
      window.location.reload();
    }
    else
      return (
        <Container className="p-1">
          <Row>
            <Col>
              <header className="jumbotron">
                <h3>
                  <strong>{currentUser.firstName} {currentUser.lastName}</strong> Profile
                </h3>
              </header>
            </Col>
          </Row>
          <Row>
            <Col>
              <p>
                <strong>Username:</strong>{" "}
                {currentUser.username}
              </p>
              <p>
                <strong>Email:</strong>{" "}
                {currentUser.email}
              </p>
              <p>
                <strong>Address:</strong>{" "}
                {
                  currentUser.address &&
                  <span>{currentUser.address}</span>
                }
                {
                  !currentUser.address &&
                  <span>Not added</span>
                }
              </p>
              <p>
                <strong>Phone:</strong>{" "}
                {currentUser.phone}
              </p>
              <p>
                <strong>Total costs:</strong>{" "}
                {currentUser.totalCosts} €
              </p>
              <strong>Authorities:</strong>
              <ul>
                {currentUser.roles &&
                  currentUser.roles.map((role, index) => <li key={index}>{role}</li>)}
              </ul>
            </Col>
          </Row>
        </Container>
      );
  }
}