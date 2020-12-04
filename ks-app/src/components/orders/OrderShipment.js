import React, { Component } from "react"
import Axios from "axios"
import AuthService from "../../services/auth-service";
import authHeader from '../../services/auth-header';
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Spinner from 'react-bootstrap/Spinner'
import Moment from 'moment';
import { Breadcrumb, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

export default class OrderShipment extends Component {
    constructor() {
        super()
        this.state = {
            currentUser: AuthService.getCurrentUser(),
            order: null,
            orderDetails: {},
            loaded: false,
            details: false,
            content: ""
        }
    }

    componentDidMount() {
        let id = this.props.match.params.id
        Axios.get(`/orders/${id}`, { headers: authHeader() }).then(
            resOrder => {
                if (resOrder.status === 200) {
                    const o = resOrder.data;
                    this.setState({
                        order: o
                    })
                    Axios.get(`/orders/${id}/details`, { headers: authHeader() })
                        .then(
                            resDetails => {
                                if (resDetails.status === 200) {
                                    const orderDetails = resDetails.data
                                    this.setState({
                                        orderDetails,
                                        loaded: true,
                                        details: true
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
            },
            error => {
                console.log(error)
                this.setState({
                    content: "Something went wrong! " + error.message
                });
            }
        )
        let t = this
        t.setState({
            loaded: true
        })
    }

    finalizeOrder() {
        const orderId = this.state.order.orderId
        const orderStatus = this.state.order.status
        const deliveryMethod = this.state.order.deliveryMethod
        let order
        if (orderStatus === "PROCESSING") {
            if (deliveryMethod === "Pick up") {
                order = {
                    status: "READY"
                }
            }
            else if (deliveryMethod === "Home delivery") {
                order = {
                    status: "TRAVELLING"
                }
            }
            Axios.post(`/orders/send/${orderId}`, order, { headers: authHeader() }).then(
                res => {
                    if (res.status === 200) {
                        this.props.history.push("/ordersmanager");
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
        else {
            if (orderStatus === "READY" || orderStatus === "TRAVELLING") {
                order = {
                    status: "DELIVERED"
                }
            }
            Axios.post(`/orders/deliver/${orderId}`, order, { headers: authHeader() }).then(
                res => {
                    if (res.status === 200) {
                        this.props.history.push("/ordersmanager");
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
    }

    render() {
        let { order, orderDetails, details, loaded, content } = this.state
        return (
            <Container>
                <h3 className="my-4">Order shipment</h3>
                <Breadcrumb>
                    <Breadcrumb.Item href="/ordersmanager">Orders manager</Breadcrumb.Item>
                    <Breadcrumb.Item active>Order № {order?.orderId}</Breadcrumb.Item>
                </Breadcrumb>
                {(!loaded && !content) &&
                    <Spinner animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                }
                {content &&
                    <header className="jumbotron">
                        <h3>{content}</h3>
                    </header>
                }
                {(loaded && order) &&
                    <Card>
                        <Card.Header>
                            <Card.Title>Order № {order.orderId}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">Registered on: {order.orderDate && Moment(order.orderDate).format('DD MMMM YYYY in HH:mm')}</Card.Subtitle>
                            {order.deliveredDate &&
                                <Card.Subtitle className="mb-2 text-muted">Delivered on: {Moment(order.deliveredDate).format('DD MMMM YYYY in HH:mm')}</Card.Subtitle>
                            }
                        </Card.Header>
                        <Card.Body>
                            <Card.Subtitle className="mb-3">Status: {order.status}</Card.Subtitle>
                            <Card.Text>Customer: {order.user.firstName} {order.user.lastName}</Card.Text>
                            <Card.Text>Delivery method: {order.deliveryMethod} {order.deliveryAddress && <span>to address: {order.deliveryAddress}</span>}</Card.Text>
                            <Card.Text>Payment method: {order.paymentMethod}</Card.Text>
                            <Card.Text>Ordered products:</Card.Text>

                            {details &&
                                orderDetails.map(details => (
                                    <Card className="my-3" key={details.id}>
                                        <Card.Header>
                                            <Card.Subtitle as={Link} variant="link" to={"/products/" + details.product.productId}>{details.product.name} - {details.amount.toFixed(2)} €</Card.Subtitle>
                                        </Card.Header>
                                        <Card.Body>
                                            <Card.Subtitle className="mb-2 text-muted">{details.quantity} x {details.price.toFixed(2)} €</Card.Subtitle>
                                        </Card.Body>
                                    </Card>
                                ))
                            }
                            <Col className="text-right">
                                <Card.Subtitle className="mb-2">{orderDetails.length} item(s)</Card.Subtitle>
                                <Card.Subtitle>Total price: {order.totalPrice?.toFixed(2)} €</Card.Subtitle>
                            </Col>
                        </Card.Body>
                        <Card.Footer>
                            {order.status !== "DELIVERED" && (
                                order.status === "PROCESSING" ?
                                    <Button className="float-right" variant="primary" onClick={() => this.finalizeOrder()}>Process order</Button>
                                    :
                                    <Button className="float-right" variant="success" onClick={() => this.finalizeOrder()}>Finalize order</Button>
                            )}
                        </Card.Footer>
                    </Card>
                }
            </Container>
        )
    }
}