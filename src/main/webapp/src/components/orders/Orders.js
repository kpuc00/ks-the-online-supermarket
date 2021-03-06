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
import { Alert, Card } from "react-bootstrap";
import {socket} from "../../services/socket";

export default class Orders extends Component {
    constructor() {
        super()
        this.state = {
            currentUser: AuthService.getCurrentUser(),
            orders: {},
            ordersLoaded: false,
            empty: false,
            content: "",
            orderPlaced: false
        }
    }

    componentDidMount() {
        if (!this.state.currentUser) {
            this.props.history.push("/login");
            window.location.reload();
        }

        const orderPlaced = new URLSearchParams(this.props.location.search).get('orderPlaced')
        const value = (orderPlaced === undefined || orderPlaced?.toLowerCase() === 'true' ? true : false)
        this.setState({
            orderPlaced: value
        })

        const user = {
            id: this.state.currentUser.id
        }
        Axios.post('/api/orders/user', user, { headers: authHeader() }).then(
            res => {
                if (res.status === 200) {
                    socket.connect();
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
            () => {
                this.setState({
                    content: "Something went wrong! Please try again later."
                });
            }
        )
    }

    cancelOrder(id) {
        Axios.post(`/api/orders/${id}/cancel`, null, { headers: authHeader() }).then(
            res => {
                if (res.status === 200) {
                    socket.send(null);
                    this.props.history.push("/orders");
                    window.location.reload();
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
        let { ordersLoaded, orders, content, empty, orderPlaced } = this.state
        return (
            <Container>
                <h3 className="my-4">My orders</h3>
                {(!ordersLoaded && !content) && (
                    empty ? <h5>You have not ordered yet.</h5>
                        :
                        <Spinner animation="border" role="status">
                            <span className="sr-only">Loading...</span>
                        </Spinner>
                )}
                {content &&
                    <header className="jumbotron">
                        <h3>{content}</h3>
                    </header>
                }
                {orderPlaced &&
                    <Alert variant="success">
                        Your order has been placed!
                    </Alert>
                }
                {ordersLoaded &&
                    <Card>
                        <Card.Body>
                            {orders &&
                                orders.map(order => (
                                    <Card className="my-3" key={order.orderId}>
                                        <Card.Header>
                                            <Card.Title>Order ??? {order.orderId}</Card.Title>
                                            <Card.Subtitle className="mb-2 text-muted">Registered on: {order.orderDate && Moment(order.orderDate).format('DD MMMM YYYY in HH:mm')}</Card.Subtitle>
                                            {order.deliveredDate &&
                                            <Card.Subtitle className="mb-2 text-muted">Delivered on: {Moment(order.deliveredDate).format('DD MMMM YYYY in HH:mm')}</Card.Subtitle>
                                            }
                                        </Card.Header>

                                        <Card.Body>
                                            <Row>
                                                <Col>
                                                    <Card.Subtitle className="m-1">Total price: {order.totalPrice.toFixed(2)} ???</Card.Subtitle>
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
                        </Card.Body>
                    </Card>
                }
            </Container>
        )
    }
}