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
import { FaCartPlus } from 'react-icons/fa'
import { Alert, Breadcrumb, Form, Image, Modal, ResponsiveEmbed } from "react-bootstrap"

export default class ProductDetails extends Component {
    constructor() {
        super()
        this.state = {
            currentUser: AuthService.getCurrentUser(),
            product: null,
            content: "",
            productQuantity: 1,
            amount: 0,
            productLoaded: false,
            showDialog: false,
            setShowDialog: false,
            invalidQuantity: false
        }
    }

    componentDidMount() {
        let id = this.props.match.params.id
        Axios.get(`/products/${id}`).then(
            res => {
                if (res.status === 200) {
                    const product = res.data
                    this.setState({
                        product,
                        productLoaded: true
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

    handleShowDialog = () => {
        this.setState({
            setShowDialog: true,
            amount: this.state.product.price,
            productQuantity: 1
        })
    }

    handleCloseDialog = () => {
        this.setState({
            setShowDialog: false
        })
    }

    handleChangeProductQuantity = (e) => {
        const quantity = ((e.target.value > 0 && e.target.value <= 50) || e.target.value === "") ? e.target.value : 1
        const amount = quantity * this.state.product.price
        if (quantity < 1) {
            this.setState({
                invalidQuantity: true
            })
        }
        else {
            this.setState({
                invalidQuantity: false,
            })
        }
        this.setState({
            productQuantity: quantity,
            amount: amount
        })
    }

    handleAddToCart = () => {
        const item = {
            product: this.state.product,
            quantity: this.state.productQuantity,
            buyerId: this.state.currentUser.id
        }
        Axios.post(`/orders/addProduct`, item, { headers: authHeader() }).then(
            res => {
                if (res.status === 200) {
                    this.props.history.push("/cart");
                    window.location.reload();
                }
            },
            () => {
                this.setState({
                    content: "Something went wrong! Please try again later."
                });
            }
        )
        this.handleCloseDialog()
    }

    render() {
        let { productLoaded, product, productQuantity, invalidQuantity, amount, currentUser, content, setShowDialog } = this.state

        return (
            <Container>
                <h3 className="my-4">Product details</h3>
                <Breadcrumb>
                    <Breadcrumb.Item href="/products">Products</Breadcrumb.Item>
                    <Breadcrumb.Item active>{product?.name}</Breadcrumb.Item>
                </Breadcrumb>


                {(!productLoaded && !content) &&
                    <Spinner animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                }
                {content &&
                    <header className="jumbotron">
                        <h3>{content}</h3>
                    </header>
                }
                {!currentUser &&
                    <Alert variant="warning">
                        <big>You must be logged in to be able to buy!</big>
                    </Alert>
                }
                {productLoaded &&
                    <Card>
                        <Card.Header>
                            <Card.Title className="m-0">{product.name}</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col className="col-4">
                                    <ResponsiveEmbed aspectRatio="16by9">
                                        <div className="product-image">
                                            <Image src={product.image ? (`data:image/png;base64,${product.image}`) : ("/images/product/default.jpg")} />
                                        </div>
                                    </ResponsiveEmbed>
                                </Col>
                                <Col >
                                    <Card.Body>
                                        <Card.Subtitle>Price: </Card.Subtitle><Card.Text>{product.price?.toFixed(2)} €</Card.Text>
                                        {product.description &&
                                            <><Card.Subtitle>Description: </Card.Subtitle><Card.Text>{product.description}</Card.Text></>
                                        }
                                        <Card.Subtitle>Category: </Card.Subtitle><Card.Text>{product.category.name}</Card.Text>
                                    </Card.Body>
                                </Col>
                            </Row>
                        </Card.Body>
                        <Card.Footer>
                            {product.deleted &&
                                <Card.Subtitle>This product does not exist.</Card.Subtitle>
                            }
                            <Button className="float-right" disabled={!currentUser || product.deleted} variant="primary" onClick={() => this.handleShowDialog(product)}><FaCartPlus /> Buy</Button>
                        </Card.Footer>
                    </Card>
                }

                <Modal show={setShowDialog} onHide={this.handleCloseDialog}>
                    <Modal.Header closeButton>
                        <Modal.Title>{product?.name} - {product?.price?.toFixed(2)} €</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group controlId="productQuantity">
                            <Form.Label>Quantity (max. 50)</Form.Label>
                            <Form.Control name="productQuantity" onChange={this.handleChangeProductQuantity} type="number" value={productQuantity} />
                        </Form.Group>
                        <strong>Total:</strong> {amount?.toFixed(2)} €
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" disabled={invalidQuantity} onClick={() => this.handleAddToCart()}>
                            <FaCartPlus /> Add to cart
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        )
    }
}