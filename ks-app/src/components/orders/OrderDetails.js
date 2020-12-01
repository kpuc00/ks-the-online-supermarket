import React, { Component } from "react"
import Axios from "axios"
import AuthService from "../../services/auth-service";
import authHeader from '../../services/auth-header';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Spinner from 'react-bootstrap/Spinner'
import Moment from 'moment';
import { Breadcrumb, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

export default class OrderDetails extends Component {
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

    render() {
        let { order, orderDetails, details, loaded, content } = this.state
        return (
            <Container className="p-1">
                <Row><Col>
                    <h3>Order details</h3>
                    <Breadcrumb>
                        <Breadcrumb.Item href="/orders">My orders</Breadcrumb.Item>
                        <Breadcrumb.Item active>Order details</Breadcrumb.Item>
                    </Breadcrumb>
                </Col></Row>
                {(!loaded && !content) &&
                    <Row>
                        <Col>
                            <Spinner animation="border" role="status">
                                <span className="sr-only">Loading...</span>
                            </Spinner>
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
                <Row>
                    <Col>
                        {(loaded && order) &&
                            <Card>
                                <Card.Header>
                                    <Card.Title>Order № {order.orderId}</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">Registered on: {order.orderDate && Moment(order.orderDate).format('DD MMMM YYYY in HH:mm')}</Card.Subtitle>
                                </Card.Header>
                                <Card.Body>
                                    <Card.Subtitle className="mb-2">Status: {order.status}</Card.Subtitle>
                                    <Card.Text>Ordered products:</Card.Text>

                                    {details &&
                                        orderDetails.map(details => (
                                            <Card className="mb-3" key={details.id}>
                                                <Card.Header>
                                                    <Card.Subtitle as={Link} variant="link" to={"/products/" + details.product.productId}>{details.product.name} - {details.amount.toFixed(2)} €</Card.Subtitle>
                                                </Card.Header>
                                                <Card.Body>
                                                    <Card.Subtitle className="mb-2 text-muted">{details.quantity} x {details.price.toFixed(2)} €</Card.Subtitle>
                                                </Card.Body>
                                            </Card>
                                        ))
                                    }
                                    <Card.Subtitle className="float-right">Total price: {order.totalPrice?.toFixed(2)} €</Card.Subtitle>
                                </Card.Body>
                            </Card>
                        }
                    </Col>
                </Row>
            </Container>
        )
    }
}