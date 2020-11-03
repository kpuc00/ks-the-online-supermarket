import React, { Component } from "react";
import { Container } from "react-bootstrap";
import AuthService from "../services/auth-service";

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: AuthService.getCurrentUser()
    };
  }

  render() {
    const { currentUser } = this.state;

    return (
      <Container>
        <header className="jumbotron">
          <h3>
            <strong>{currentUser.firstName} {currentUser.lastName}</strong> Profile
          </h3>
        </header>
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
          {currentUser.address}
        </p>
        <p>
          <strong>Phone:</strong>{" "}
          {currentUser.phone}
        </p>
        <p>
          <strong>Total costs:</strong>{" "}
          {currentUser.totalCosts} €
        </p>
        <p>
          <strong>Token:</strong>{" "}
          {currentUser.accessToken.substring(0, 20)} ...{" "}
          {currentUser.accessToken.substr(currentUser.accessToken.length - 20)}
        </p>
        <p>
          <strong>Id:</strong>{" "}
          {currentUser.id}
        </p>
        <strong>Authorities:</strong>
        <ul>
          {currentUser.roles &&
            currentUser.roles.map((role, index) => <li key={index}>{role}</li>)}
        </ul>
      </Container>
    );
  }
}