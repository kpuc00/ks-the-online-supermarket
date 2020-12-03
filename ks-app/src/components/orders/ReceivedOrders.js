import React, { Component } from "react"
import Container from 'react-bootstrap/Container'
import Axios from "axios"
import authHeader from '../../services/auth-header'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Spinner from 'react-bootstrap/Spinner'
import Moment from 'moment'
import { Breadcrumb, Button, Card } from "react-bootstrap"

export default class ReceivedOrders extends Component {
    constructor() {
        super()
        this.state = {
            orders: [],
            ordersLoaded: false,
            content: ""
        }
    }

    componentDidMount() {
        Axios.get('/orders/received', { headers: authHeader() })
            .then(
                res => {
                    if (res.status === 200) {
                        const orders = res.data
                        this.setState({
                            orders,
                            ordersLoaded: true
                        })
                    }
                },
                () => {
                    this.setState({
                        content: "Something went wrong! Please try again later."
                    });
                }
            )
    }

    render() {
        let { ordersLoaded, orders, content } = this.state

        return (
            <Container>
                <h3 className="my-4">Received orders</h3>
                <Breadcrumb>
                    <Breadcrumb.Item href="/ordersmanager">Orders manager</Breadcrumb.Item>
                    <Breadcrumb.Item active>Received orders</Breadcrumb.Item>
                </Breadcrumb>

                {(!ordersLoaded && !content) &&
                    <Spinner animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                }
                {content &&
                    <header className="jumbotron">
                        <h3>{content}</h3>
                    </header>
                }
                {ordersLoaded &&
                    <Card className="my-3">
                        <Card.Body>
                            {orders.length === 0 &&
                                <h5>Empty</h5>
                            }
                            {orders &&
                                orders.map(order => (
                                    <Card className="my-3" key={order.orderId}>
                                        <Card.Header>
                                            <Card.Title>Order № {order.orderId}</Card.Title>
                                            <Card.Subtitle className="mb-2 text-muted">Delivered on: {order.deliveredDate && Moment(order.deliveredDate).format('DD MMMM YYYY in HH:mm')}</Card.Subtitle>
                                        </Card.Header>
                                        <Card.Body>
                                            <Row>
                                                <Col>
                                                    <Card.Subtitle className="m-1">Customer: {order.user.firstName} {order.user.lastName}</Card.Subtitle>
                                                    <Card.Subtitle className="m-1">Total price: {order.totalPrice.toFixed(2)} €</Card.Subtitle>
                                                    <Card.Subtitle className="m-1">Status: {order.status}</Card.Subtitle>
                                                </Col>
                                                <Col>
                                                    <Button className="float-right" variant="info" href={"/ordersmanager/" + order.orderId}>See more</Button>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                ))
                            }
                        </Card.Body>
                    </Card>
                }
            </Container>
        )
    }
}