import React, { Component } from "react"
import Axios from "axios"
import AuthService from "../../services/auth-service";
import authHeader from '../../services/auth-header';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import Moment from 'moment';
import { Card } from "react-bootstrap";

export default class Orders extends Component {
    constructor() {
        super()
        this.state = {
            currentUser: AuthService.getCurrentUser(),
            orders: {},
            ordersLoaded: false,
            empty: false,
            content: ""
        }
    }

    componentDidMount() {
        const user = {
            id: this.state.currentUser.id
        }
        Axios.post('/orders/user', user, { headers: authHeader() }).then(
            res => {
                if (res.status === 200) {
                    const orders = res.data
                    this.setState({
                        orders,
                        ordersLoaded: true
                    })
                }
                else if (res.status === 204) {
                    this.setState({
                        empty: true
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

    cancelOrder(id) {
        const user = {
            id: this.state.currentUser.id
        }
        Axios.post(`/orders/${id}/cancel`, user, { headers: authHeader() }).then(
            res => {
                if (res.status === 200) {
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
        let { ordersLoaded, orders, content, empty } = this.state
        return (
            <Container className="p-1">
                <Row>
                    <Col>
                        <h3>My orders</h3>
                    </Col>
                </Row>
                {(!ordersLoaded && !content) &&
                    <Row>
                        <Col>
                            {empty ? <h5>Nothing here. Start shopping now.</h5>
                                :
                                <Spinner animation="border" role="status">
                                    <span className="sr-only">Loading...</span>
                                </Spinner>
                            }
                        </Col>
                    </Row>
                }
                {content &&
                    <Row>
                        <Col>
                            <header className="jumbotron">
                                <h3>{content}</h3>
                            </header>
                        </Col>
                    </Row>
                }
                {(ordersLoaded) &&
                    <Row>
                        <Col>
                            <Card className="p-3">
                                {orders &&
                                    orders.map(order => (
                                        <Card className="mb-3" key={order.orderId}>
                                            <Card.Header>
                                                <Card.Title>Order № {order.orderId}</Card.Title>
                                                <Card.Subtitle className="mb-2 text-muted">Registered on: {Moment(order.orderDate).format('DD MMMM YYYY in HH:mm')}</Card.Subtitle>
                                            </Card.Header>

                                            <Card.Body>
                                                <Row>
                                                    <Col>
                                                        <Card.Subtitle className="m-1">Total price: {order.totalPrice} €</Card.Subtitle>
                                                        <Card.Subtitle className="m-1">Status: {order.status}</Card.Subtitle>
                                                    </Col>
                                                    <Col>
                                                        {(order.status === "PROCESSING") &&
                                                            <Button className="float-right" variant="danger" onClick={() => this.cancelOrder(order.orderId)}>Cancel order</Button>
                                                        }
                                                        <Button className="float-right" variant="link" href={"/orders/" + order.orderId}>See more</Button>
                                                    </Col>
                                                </Row>
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