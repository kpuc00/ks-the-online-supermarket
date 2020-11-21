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

export default class Orders extends Component {
    constructor() {
        super()
        this.state = {
            currentUser: AuthService.getCurrentUser(),
            orders: {},
            ordersLoaded: false,
            content: ""
        }
    }

    componentDidMount() {
        const user = {
            id: this.state.currentUser.id
        }
        Axios.post('/orders/user', user, { headers: authHeader() }).then(
            res => {
                const orders = res.data
                this.setState({
                    orders,
                    ordersLoaded: true
                })
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

    showOrderProducts(order) {
        console.log(order)
    }

    render() {
        let { ordersLoaded, orders, content } = this.state
        return (
            <Container className="p-1">
                <Row>
                    <Col>
                        <h3>My orders</h3>
                    </Col>
                </Row>
                {
                    (!ordersLoaded && !content) &&
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
                    (ordersLoaded && !content) &&
                    <Row>
                        <Col>
                            <Card className="p-3">
                                {orders &&
                                    orders.map(order => (
                                        <Card className="mb-3" key={order.orderId}>
                                            <Card.Header>Order № {order.orderId}</Card.Header>
                                            <Card.Body>                                                
                                                <Card.Subtitle className="mb-2 text-muted">Date: {order.orderDate}</Card.Subtitle>
                                                <Card.Subtitle className="mb-2">Total price: {order.totalPrice} €</Card.Subtitle>
                                                <Card.Subtitle className="mb-2">Status: {order.status}</Card.Subtitle>

                                                <Button variant="link" onClick={() => this.showOrderProducts(order)}>See more</Button>
                                            </Card.Body>
                                        </Card>
                                    ))
                                }
                            </Card>
                        </Col>
                    </Row>
                }
            </Container>
        )
    }
}