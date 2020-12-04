import Axios from "axios";
import React, { Component } from "react";
import { Container } from "react-bootstrap";
import AuthService from "../../services/auth-service";
import authHeader from '../../services/auth-header'

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: AuthService.getCurrentUser(),
      user: null,
      userLoaded: false
    };
  }

  componentDidMount() {
    const { currentUser } = this.state;
    if (!currentUser) {
      this.props.history.push("/login");
      window.location.reload();
    }
    else {
      const id = currentUser.id
      Axios.get(`/users/${id}`, { headers: authHeader() }).then(
        res => {
          if (res.status === 200) {
            const user = res.data
            this.setState({
              user,
              userLoaded: true
            })
          }
        }
      )
    }
  }

  render() {
    const { user, userLoaded } = this.state;
    return (
      <Container>
        {userLoaded &&
          <>
            <header className="jumbotron my-4">
              <h3>
                <strong>{user.firstName} {user.lastName}</strong> Profile
            </h3>
            </header>
            <p>
              <strong>Username:</strong>{" "}
              {user.username}
            </p>
            <p>
              <strong>Email:</strong>{" "}
              {user.email}
            </p>
            <p>
              <strong>Address:</strong>{" "}
              {
                user.address &&
                <span>{user.address}</span>
              }
              {
                !user.address &&
                <span>Not added</span>
              }
            </p>
            <p>
              <strong>Phone:</strong>{" "}
              {user.phone}
            </p>
            <p>
              <strong>Total costs:</strong>{" "}
              {user.totalCosts?.toFixed(2)} €
              </p>
            <strong>Authorities:</strong>
            <ul>
              {user.roles &&
                user.roles.map(role => <li key={role.id}>{role.name}</li>)}
            </ul>
          </>
        }
      </Container>
    );
  }
}