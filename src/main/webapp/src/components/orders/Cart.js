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
import { Form, Image, Modal, ResponsiveEmbed } from "react-bootstrap"
import { Link } from "react-router-dom"
import { FaTrash } from 'react-icons/fa'
import { socket } from "../../services/socket"

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
            setShowClearCartDialog: false,
            setShowOrderDialog: false,
            deliveryMethod: "Pick up",
            userHomeAddress: null,
            paymentMethod: "Cash"
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
        Axios.post(`/api/orders/cart`, userId, { headers: authHeader() }).then(
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
                    Axios.get(`/api/orders/${this.state.order.orderId}/details`, { headers: authHeader() }).then(
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
                        () => {
                            this.setState({
                                content: "Something went wrong! Please try again later."
                            })
                        })
                }
            },
            () => {
                this.setState({
                    content: "Something went wrong! Please try again later."
                })
            })
        this.setState({
            loaded: true
        })
    }

    deleteProduct(id) {
        Axios.delete(`/api/orders/deleteProduct/${id}`, { headers: authHeader() })
            .then(
                res => {
                    if (res.status === 204)
                        window.location.reload()
                },
                () => {
                    this.setState({
                        content: "Something went wrong! Please try again later."
                    })
                }
            )
    }

    clearCart() {
        const user = {
            id: this.state.currentUser.id
        }
        Axios.post(`/api/orders/cart/clear`, user, { headers: authHeader() })
            .then(
                res => {
                    if (res.status === 200)
                        window.location.reload()
                },
                () => {
                    this.setState({
                        content: "Something went wrong! Please try again later."
                    })
                }
            )
        this.handleCloseClearCartDialog()
    }

    submitOrder() {
        const deliveryMethod = this.state.deliveryMethod
        const paymentMethod = this.state.paymentMethod
        let homeAddress = this.state.userHomeAddress

        if (deliveryMethod !== "Home delivery") {
            homeAddress = null
        }

        const order = {
            ...this.state.order,
            deliveryMethod: deliveryMethod,
            deliveryAddress: homeAddress,
            paymentMethod: paymentMethod
        }
        Axios.put(`/api/orders/cart`, order, { headers: authHeader() })
            .then(
                res => {
                    if (res.status === 200) {
                        socket.send(order);
                        this.props.history.push("/orders?orderPlaced=true");
                        window.location.reload();
                    }
                },
                () => {
                    this.setState({
                        content: "Something went wrong! Please try again later."
                    })
                }
            )
    }

    handleChange = (e) => {
        const { name, value } = e.target
        this.setState({
            ...this.state,
            [name]: value
        })
    }

    handleShowClearCartDialog = () => {
        this.setState({
            setShowClearCartDialog: true
        })
    }

    handleCloseClearCartDialog = () => {
        this.setState({
            setShowClearCartDialog: false
        })
    }

    handleShowOrderDialog = () => {
        Axios.get(`/api/users/${this.state.currentUser.id}`, { headers: authHeader() })
            .then(
                res => {
                    if (res.status === 200) {
                        this.setState({
                            userHomeAddress: res.data.address,
                            setShowOrderDialog: true
                        })
                    }
                },
                () => {
                    this.setState({
                        content: "Something went wrong! Please try again later."
                    })
                }
            )
    }

    handleCloseOrderDialog = () => {
        this.setState({
            setShowOrderDialog: false
        })
    }

    render() {
        let { cartEmpty, loaded, content, order, orderDetails, setShowClearCartDialog, setShowOrderDialog } = this.state

        return (
            <Container>
                <h3 className="my-4">Your shopping cart</h3>

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
                {loaded &&
                    <Card className="my-3">
                        <Card.Body>
                            {cartEmpty ? <h5>Empty</h5>
                                :
                                orderDetails.map(details => (
                                    <Card className="my-3" key={details.id}>
                                        <Card.Header>
                                            <big><Card.Title className="m-0" as={Link} variant="link" to={"/products/" + details.product.productId}>{details.product.name}</Card.Title></big>
                                        </Card.Header>
                                        <Card.Body>
                                            <Row>
                                                <Col className="col-3">
                                                    <ResponsiveEmbed aspectRatio="16by9">
                                                        <div className="product-image">
                                                            <Image src={details.product.image ? (`data:image/png;base64,${details.product.image}`) : ("/images/product/default.jpg")} />
                                                        </div>
                                                    </ResponsiveEmbed>
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
                                    <Button className="float-right" variant="link" onClick={() => this.handleShowClearCartDialog()}>Clear cart</Button>
                                }
                                <Button as={Link} className="m-3" variant="secondary" to="/products">Continue shopping</Button>
                            </Col></Row>
                        </Card.Body>

                        <Card.Footer>
                            <Col className="text-right">
                                <Card.Subtitle>{orderDetails.length} item(s)</Card.Subtitle>
                                <Card.Title className="m-0">Total price: {cartEmpty ? "0.00" : order.totalPrice?.toFixed(2)} €</Card.Title>
                            </Col>
                        </Card.Footer>
                        <Card.Body>
                            <Button className="float-right" disabled={cartEmpty} onClick={() => this.handleShowOrderDialog()}>Purchase</Button>
                        </Card.Body>

                    </Card>
                }
                <Modal show={setShowClearCartDialog} onHide={this.handleCloseClearCartDialog}>
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

                <Modal show={setShowOrderDialog} onHide={this.handleCloseOrderDialog}>
                    <Modal.Header closeButton>
                        <Modal.Title>Order</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Select delivery method:</p>
                        <Form.Group>
                            <Col>
                                <Form.Check
                                    onChange={this.handleChange}
                                    type="radio"
                                    label="Pick up point"
                                    name="deliveryMethod"
                                    value="Pick up"
                                    defaultChecked
                                />
                                <Form.Check
                                    onChange={this.handleChange}
                                    type="radio"
                                    label="Home delivery"
                                    name="deliveryMethod"
                                    value="Home delivery"
                                />
                                <Form.Label>Home address:</Form.Label>
                                <Form.Control disabled={this.state.deliveryMethod !== "Home delivery"} name="userHomeAddress" onChange={this.handleChange} type="address" value={this.state.userHomeAddress} />
                            </Col>
                        </Form.Group>
                        <p>Select payment method:</p>
                        <Form.Group>
                            <Col>
                                <Form.Check
                                    onChange={this.handleChange}
                                    type="radio"
                                    label="Cash"
                                    name="paymentMethod"
                                    value="Cash"
                                    defaultChecked
                                />
                                <Form.Check
                                    onChange={this.handleChange}
                                    type="radio"
                                    label="Card"
                                    name="paymentMethod"
                                    value="Card"
                                />
                            </Col>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" onClick={() => this.submitOrder()}>
                            Order now
                        </Button>
                    </Modal.Footer>
                </Modal>

            </Container>
        )
    }
}