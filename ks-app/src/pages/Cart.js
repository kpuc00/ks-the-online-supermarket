import React, { Component } from "react"
import Axios from "axios"
import AuthService from "../services/auth-service";
import authHeader from '../services/auth-header';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
//import { FaCartPlus } from 'react-icons/fa'

export default class Cart extends Component {
    constructor() {
        super()
        this.state = {
            currentUser: AuthService.getCurrentUser(),
            order: {},
            orderDetails: [],
            loaded: false,
            cartEmpty: false,
            content: ""
        }
    }

    componentDidMount() {
        if (!this.state.currentUser) {
            this.props.history.push("/login");
            window.location.reload();
        }
        const userId = {
            id: this.state.currentUser.id
        }
        let t = this
        Axios.post(`http://localhost:8080/orders/cart`, userId, { headers: authHeader() }).then(
            resCart => {
                if (resCart.status === 204) {
                    this.setState({
                        cartEmpty: true
                    })
                }
                else if (resCart.status === 200) {
                    const cart = resCart.data;
                    this.setState({
                        order: cart
                    })
                    Axios.get(`http://localhost:8080/orders/${this.state.order.orderId}/details`, { headers: authHeader() }).then(
                        resDetails => {
                            if (resDetails.status === 204) {
                                this.setState({
                                    cartEmpty: true
                                })
                            }
                            else if (resDetails.status === 200) {
                                const orderDetails = resDetails.data
                                this.setState({
                                    orderDetails,
                                    loaded: true
                                })
                            }
                        },
                        error => {
                            this.setState({
                                content:
                                    (error.response &&
                                        error.response.data &&
                                        error.response.data.message) ||
                                    error.message ||
                                    error.toString()
                            });
                        }
                    )
                }
            },
            error => {
                this.setState({
                    content:
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString()
                });
            }
        )

        t.setState({
            loaded: true
        })
    }

    render() {
        var { cartEmpty, loaded, order, orderDetails } = this.state
        console.log(order)
        console.log(orderDetails)
        console.log(loaded)
        console.log(cartEmpty)

        return (
            <Container className="p-1">
                <Row>
                    <h3>Your shopping cart</h3>
                </Row>
                {
                    (!loaded && !this.state.content) &&
                    <Row>
                        <Col>
                            <Spinner animation="border" role="status">
                                <span className="sr-only">Loading...</span>
                            </Spinner>
                        </Col>
                    </Row>
                }
                {
                    this.state.content &&
                    <Row>
                        <Col>
                            <header className="jumbotron">
                                <h3>{this.state.content}</h3>
                            </header>
                        </Col>
                    </Row>
                }
                {
                    (loaded && !this.state.content) &&
                    <Row>
                        <Col>
                            <Card className="p-3">
                                {cartEmpty &&
                                    <h5>Empty</h5>
                                }
                                {!cartEmpty &&
                                    orderDetails.map(details => (
                                        <Card key={details.id}>
                                            <Card.Body>
                                                <Card.Title>{details.product.name}</Card.Title>
                                                <Card.Subtitle className="mb-2 text-muted">{details.quantity} x {details.price} €</Card.Subtitle>
                                                <Card.Subtitle>{details.amount} €</Card.Subtitle>
                                                <Card.Link href="#">Remove</Card.Link>
                                            </Card.Body>
                                        </Card>
                                    ))
                                }
                                <Card className="mt-5">
                                    <Card.Body>
                                        <Card.Title>Total:</Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted">{cartEmpty && "0.00"}{!cartEmpty && order.totalPrice} €</Card.Subtitle>
                                        <Button disabled={cartEmpty} onClick={() => console.log("Order sent")}>Purchase</Button>
                                    </Card.Body>
                                </Card>
                            </Card>
                        </Col>
                    </Row>
                }

                {/* 
                
                {
          (!productsLoaded && !this.state.content) &&
          <Row>
            <Col>
              <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
              </Spinner>
            </Col>
          </Row>
        }
        {
          this.state.content &&
          <Row>
            <Col>
              <header className="jumbotron">
                <h3>{this.state.content}</h3>
              </header>
            </Col>
          </Row>
        }
        {
          (productsLoaded && !this.state.content) &&
          <Row>
            <Col>
              <Link to="/productsmanager/addproduct">
                <Button variant="primary"><FaPlus /> Add new product</Button>
              </Link>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {products.map(product => (
                  <Card key={product.productId} style={{ width: "40%", margin: "5px" }}>
                    <Card.Img variant="top" src={"/images/product/" + product.image} />
                    <Card.Body>
                      <Card.Title>{product.name}</Card.Title>
                      <Card.Text>
                        {product.description}<br />
                        <strong>Category:</strong> {product.category.name}<br />
                        <strong>Price:</strong> {product.price} €
                      </Card.Text>
                      <Link to={"/productsmanager/editproduct/" + product.productId}>
                        <Button variant="warning"><FaEdit /></Button>
                      </Link>
                      <Button variant="danger" onClick={() => this.handleShowDialog(product)}><FaTrash /></Button>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </Col>
          </Row>
        }

                */}

                {/* {
                    (!productsLoaded && !this.state.content) &&
                    <Row>
                        <Col>
                            <Spinner animation="border" role="status">
                                <span className="sr-only">Loading...</span>
                            </Spinner>
                        </Col>
                    </Row>
                }
                {
                    this.state.content &&
                    <Row>
                        <Col>
                            <header className="jumbotron">
                                <h3>{this.state.content}</h3>
                            </header>
                        </Col>
                    </Row>
                }
                {
                    (productsLoaded && !this.state.content) &&
                    <Row>
                        <Col>
                            <div style={{ display: "flex", flexWrap: "wrap" }}>
                                {products.map(product => (
                                    <Card key={product.productId} style={{ width: "40%", margin: "5px" }}>
                                        <Card.Img variant="top" src={"/images/product/" + product.image} />
                                        <Card.Body>
                                            <Card.Title>{product.name}</Card.Title>
                                            <Card.Text>
                                                {product.description}<br />
                                                <strong>Category:</strong> {product.category.name}<br />
                                                <strong>Price:</strong> {product.price} €
                      </Card.Text>
                                            <Button variant="primary"><FaCartPlus /> Add to cart</Button>
                                        </Card.Body>
                                    </Card>
                                ))}
                            </div>
                        </Col>
                    </Row>
                } */}
            </Container>
        )
    }
}