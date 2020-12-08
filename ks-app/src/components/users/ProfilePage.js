import Axios from "axios"
import React, { Component } from "react"
import { Button, Card, Container, Spinner } from "react-bootstrap"
import AuthService from "../../services/auth-service"
import authHeader from '../../services/auth-header'
import { FaEdit } from 'react-icons/fa'
import { Link } from "react-router-dom"

export default class Profile extends Component {
  constructor(props) {
    super(props)

    this.state = {
      currentUser: AuthService.getCurrentUser(),
      user: null,
      userLoaded: false,
      content: ""
    }
  }

  componentDidMount() {
    const { currentUser } = this.state;
    if (!currentUser) {
      this.props.history.push("/login")
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
        },
        () => {
          this.setState({
            content: "Something went wrong! Please try again later."
          })
        }
      )
    }
  }

  render() {
    const { user, userLoaded, content } = this.state
    return (
      <Container>
        {(!userLoaded && !content) &&
          <Spinner animation="border" role="status" className="my-3">
            <span className="sr-only">Loading...</span>
          </Spinner>
        }
        {content &&
          <header className="jumbotron">
            <h3>{content}</h3>
          </header>
        }
        {userLoaded &&
          <>
            <header className="jumbotron text-center my-4">
              <h3><strong>{user.firstName} {user.lastName}</strong></h3>
              <h5>Money spent in our shop: {user.totalCosts?.toFixed(2)} €</h5>
            </header>
            <Card className="my-4">
              <Card.Header>
                <Card.Title className="m-0">Personal data</Card.Title>
              </Card.Header>
              <Card.Body>
              <Card.Subtitle>First name: </Card.Subtitle><Card.Text>{user.firstName}</Card.Text>
              <Card.Subtitle>Last name: </Card.Subtitle><Card.Text>{user.lastName}</Card.Text>
                <Card.Subtitle>Username: </Card.Subtitle><Card.Text>{user.username}</Card.Text>
                <Card.Subtitle>Authorities: </Card.Subtitle>
                <Card.Text>
                  <ul>
                    {user.roles &&
                      user.roles.map(role => <li key={role.id}>{role.name}</li>)}
                  </ul>
                </Card.Text>
                <Card.Subtitle>Email: </Card.Subtitle><Card.Text>{user.email}</Card.Text>
                <Card.Subtitle>Address: </Card.Subtitle>
                <Card.Text>
                  {user.address ? user.address : "Not added"}
                </Card.Text>
                <Card.Subtitle>Phone: </Card.Subtitle><Card.Text>{user.phone}</Card.Text>
              </Card.Body>
              <Card.Footer>
                <Button as={Link} to={"/usersmanager/edituser/" + user.id} className="float-right" variant="warning"><FaEdit /> Edit</Button>
              </Card.Footer>
            </Card>
          </>
        }
      </Container>
    )
  }
}