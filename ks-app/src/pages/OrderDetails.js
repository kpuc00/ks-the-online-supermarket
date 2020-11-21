import React, { Component } from "react"
import Axios from "axios"
import AuthService from "../services/auth-service";
import authHeader from '../services/auth-header';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import { Card } from "react-bootstrap";

export default class OrderDetails extends Component {
    constructor() {
        super()
        this.state = {
            currentUser: AuthService.getCurrentUser(),
            order: {},
            orderDetails: {},
            loaded: false,
            content: ""
        }
    }

    componentDidMount() {
        const user = {
            id: this.state.currentUser.id
        }
        Axios.get(`/orders/`, { headers: authHeader() }).then(
            resOrder => {
                if (resOrder.status === 200) {
                    const o = resOrder.data;
                    this.setState({
                        order: o
                    })
                    Axios.get(`/orders/${this.state.order.orderId}/details`, { headers: authHeader() }).then(
                        resDetails => {
                            if (resDetails.status === 200) {
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
        let { order, orderDetails, loaded, content } = this.state
        return (
            <Container className="p-1">
                <Row>
                    <Col>
                        <h3>Order details</h3>
                    </Col>
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
                            <Card className="p-3">
                                {/* {orders &&
                                    orders.map(order => (
                                        <Card key={order.orderId}>
                                            <Card.Body>
                                                <Card.Title>Order № {order.orderId}</Card.Title>
                                                <Card.Subtitle className="mb-2 text-muted">Date: {order.orderDate}</Card.Subtitle>
                                                <Card.Subtitle className="mb-2">Total price: {order.totalPrice} €</Card.Subtitle>
                                                <Card.Subtitle className="mb-2">Status: {order.status}</Card.Subtitle>

                                                <Button variant="link" onClick={() => this.showOrderProducts(order)}>See more</Button>
                                            </Card.Body>
                                        </Card>
                                    ))
                                } */}
                            </Card>
                        </Col>
                    </Row>
                }
            </Container>
        )
    }
}