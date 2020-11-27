import React, { Component } from "react"
import Axios from "axios"
import AuthService from "../../services/auth-service"
import authHeader from '../../services/auth-header'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import { Image, Modal } from "react-bootstrap"
import { Link } from "react-router-dom"
import { FaTrash } from 'react-icons/fa'

export default class Cart extends Component {
    constructor() {
        super()
        this.state = {
            currentUser: AuthService.getCurrentUser(),
            order: {},
            orderDetails: [],
            loaded: false,
            cartEmpty: false,
            content: "",
            showDialog: false,
            setShowDialog: false,
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
                if (resCart.status === 200) {
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
            .then(
                res => {
                    console.log(res.status)
                    if (res.status === 204)
                        window.location.reload()
                    if (res.status === 500) {
                        this.setState({
                            content: "Something went wrong! Please try again later."
                        });
                    }
                }
            )
    }

    clearCart() {
        const user = {
            id: this.state.currentUser.id
        }
        Axios.post(`/orders/cart/clear`, user, { headers: authHeader() })
            .then(
                res => {
                    if (res.status === 200)
                        window.location.reload();
                    if (res.status === 500) {
                        this.setState({
                            content: "Something went wrong! Please try again later."
                        });
                    }
                }
            )
        this.handleCloseDialog()
    }

    submitOrder() {
        Axios.put(`/orders/cart`, this.state.order, { headers: authHeader() })
            .then(
                res => {
                    if (res.status === 200) {
                        this.props.history.push("/orders?orderPlaced=true");
                        window.location.reload();
                    }
                    if (res.status === 500) {
                        this.setState({
                            content: "Something went wrong! Please try again later."
                        });
                    }
                }
            )
    }

    handleShowDialog = () => {
        this.setState({
            setShowDialog: true
        })
    }

    handleCloseDialog = () => {
        this.setState({
            setShowDialog: false
        })
    }

    render() {
        let { cartEmpty, loaded, content, order, orderDetails, setShowDialog } = this.state

        return (
            <Container className="p-1">
                <Row><Col><h3>Your shopping cart</h3></Col></Row>
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
                {loaded &&
                    <Row>
                        <Col>
                            <Card className="m-5">
                                <Card.Body>
                                    {cartEmpty ? <h5>Empty</h5>
                                        :
                                        orderDetails.map(details => (
                                            <Card className="mb-3" key={details.id}>
                                                <Card.Header>
                                                    <big><Card.Title className="m-0" as={Link} variant="link" to={"/products/" + details.product.productId}>{details.product.name}</Card.Title></big>
                                                </Card.Header>
                                                <Card.Body>
                                                    <Row>
                                                        <Col className="col-4">
                                                            <div className="product-image">
                                                                <Image src={details.product.image ? (`data:image/png;base64,${details.product.image}`) : ("/images/product/default.jpg")} />
                                                            </div>
                                                        </Col>
                                                        <Col className="text-right">
                                                            <Card.Subtitle className="mb-2 text-muted">{details.quantity} x {details.price.toFixed(2)} €</Card.Subtitle>
                                                            <Card.Subtitle>Total: {details.amount.toFixed(2)} €</Card.Subtitle>
                                                        </Col>
                                                    </Row>
                                                    <Button variant="link" onClick={() => this.deleteProduct(details.id)}>Remove</Button>
                                                </Card.Body>
                                            </Card>
                                        ))
                                    }
                                    <Row><Col>
                                        {!cartEmpty &&
                                            <Button className="float-right" variant="link" onClick={() => this.handleShowDialog()}>Clear cart</Button>
                                        }
                                        <Button className="m-3" variant="secondary" href="/products">Continue shopping</Button>
                                    </Col></Row>
                                </Card.Body>

                                <Card.Footer>
                                    <Card.Title className="m-0 float-right">Total price: {cartEmpty ? "0.00" : order.totalPrice?.toFixed(2)} €</Card.Title>
                                </Card.Footer>
                                <Card.Body>
                                    <Button className="float-right" disabled={cartEmpty} onClick={() => this.submitOrder()}>Purchase</Button>
                                </Card.Body>

                            </Card>
                        </Col>
                    </Row>
                }
                <Modal show={setShowDialog} onHide={this.handleCloseDialog}>
                    <Modal.Header closeButton>
                        <Modal.Title>Clear cart</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Are you sure? This cannot be undone!</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={() => this.clearCart()}>
                            <FaTrash /> Clear
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        )
    }
}