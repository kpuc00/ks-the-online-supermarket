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
        Axios.post(`/orders/cart`, userId, { headers: authHeader() }).then(
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
                    Axios.get(`/orders/${this.state.order.orderId}/details`, { headers: authHeader() }).then(
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

    deleteProduct(id) {
        Axios.delete(`/orders/deleteProduct/${id}`, { headers: authHeader() })
            .then(res => {
                console.log(res)
                console.log(res.data)
            })
    }

    submitOrder() {
        console.log(this.state.order)
        Axios.put(`/orders/cart`, this.state.order, { headers: authHeader() }).then(
            res => {
                if (res.status === 200) {
                    console.log("Order sent")
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

    render() {
        let { cartEmpty, loaded, order, orderDetails } = this.state
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
                                                <Button variant="link" onClick={() => this.deleteProduct(details.id)}>Remove</Button>
                                            </Card.Body>
                                        </Card>
                                    ))
                                }
                                <Button className="m-3" variant="secondary" href="/products">Continue shopping</Button>
                                <Card className="p-3">
                                    <Card.Body>
                                        <Card.Title>Total:</Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted">{cartEmpty && "0.00"}{!cartEmpty && order.totalPrice} €</Card.Subtitle>
                                        <Button disabled={cartEmpty} onClick={() => this.submitOrder()}>Purchase</Button>
                                    </Card.Body>
                                </Card>
                            </Card>
                        </Col>
                    </Row>
                }
            </Container>
        )
    }
}