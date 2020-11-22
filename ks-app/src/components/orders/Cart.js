import React, { Component } from "react"
import Axios from "axios"
import AuthService from "../../services/auth-service";
import authHeader from '../../services/auth-header';
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
        this.setState({
            loaded: true
        })
    }

    deleteProduct(id) {
        Axios.delete(`/orders/deleteProduct/${id}`, { headers: authHeader() })
            .then(res => {
                console.log(res)
                console.log(res.data)
                window.location.reload();
            })
    }

    clearCart(id) {
        Axios.delete(`/orders/cart/${id}`, { headers: authHeader() })
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
                    this.props.history.push("/orders/" + this.state.order.orderId);
                    window.location.reload();
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
        let { cartEmpty, loaded, content, order, orderDetails } = this.state

        return (
            <Container className="p-1">
                <Row>
                    <h3>Your shopping cart</h3>
                </Row>
                {
                    (!loaded && !content) &&
                    <Row>
                        <Col>
                            <Spinner animation="border" role="status">
                                <span className="sr-only">Loading...</span>
                            </Spinner>
                        </Col>
                    </Row>
                }
                {
                    content &&
                    <Row>
                        <Col>
                            <header className="jumbotron">
                                <h3>{content}</h3>
                            </header>
                        </Col>
                    </Row>
                }
                {
                    (loaded && !content) &&
                    <Row>
                        <Col>
                            <Card>
                                <Card.Body>
                                    {cartEmpty &&
                                        <h5>Empty</h5>
                                    }
                                    {!cartEmpty &&
                                        orderDetails.map(details => (
                                            <Card className="mb-3" key={details.id}>
                                                <Card.Header>{details.product.name} - {details.amount} €</Card.Header>
                                                <Card.Body>
                                                    <Card.Subtitle className="mb-2 text-muted">{details.quantity} x {details.price} €</Card.Subtitle>
                                                    <Button variant="link" onClick={() => this.deleteProduct(details.id)}>Remove</Button>
                                                </Card.Body>
                                            </Card>
                                        ))
                                    }
                                    {!cartEmpty &&
                                        <Card.Body>
                                            <Button className="float-right" disabled={true} variant="link" onClick={() => this.clearCart(order.orderId)}>Clear cart</Button>
                                        </Card.Body>
                                    }

                                    <Button className="m-3" variant="secondary" href="/products">Continue shopping</Button>

                                    <Card className="p-3">
                                        <Card.Body>
                                            <Card.Title>Total:</Card.Title>
                                            <Card.Subtitle className="mb-2 text-muted">{cartEmpty && "0.00"}{!cartEmpty && order.totalPrice} €</Card.Subtitle>
                                            <Button disabled={cartEmpty} onClick={() => this.submitOrder()}>Purchase</Button>
                                        </Card.Body>
                                    </Card>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                }
            </Container>
        )
    }
}