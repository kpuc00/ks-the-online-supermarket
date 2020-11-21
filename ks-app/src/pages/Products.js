import React, { Component } from "react"
import Axios from "axios"
import AuthService from "../services/auth-service";
import authHeader from '../services/auth-header';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import { FaCartPlus } from 'react-icons/fa'
import { Form, Modal } from "react-bootstrap";

class Products extends Component {
  constructor() {
    super()
    this.state = {
      currentUser: AuthService.getCurrentUser(),
      products: [],
      selectedProduct: {},
      content: "",
      productQuantity: 1,
      amount: 0,
      productsLoaded: false,
      showDialog: false,
      setShowDialog: false,
      invalidQuantity: false
    }
  }

  componentDidMount() {
    Axios.get('/products').then(
      res => {
        const products = res.data
        this.setState({
          products,
          productsLoaded: true
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

  handleShowDialog = (product) => {
    this.setState({
      selectedProduct: product,
      setShowDialog: true,
      amount: product.price,
      productQuantity: 1
    })
  }

  handleCloseDialog = () => {
    this.setState({
      setShowDialog: false
    })
  }

  handleChangeProductQuantity = (e) => {
    const quantity = (e.target.value > 0 || e.target.value === "") ? e.target.value : 1
    const amount = quantity * this.state.selectedProduct.price
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

  handleAddToCart = (product, currentUser) => {
    const item = {
      product,
      quantity: this.state.productQuantity,
      buyerId: currentUser.id
    }
    console.log("added")
    console.log(item)
    Axios.post(`/orders/addProduct`, item, { headers: authHeader() }).then(
      res => {
        if (res.status === 200) {
          console.log(res)
          console.log("success")
          this.props.history.push("/cart");
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
    let { productsLoaded, products, currentUser, content } = this.state

    return (
      <Container className="p-1">
        <Row>
          <h3>Products</h3>
        </Row>

        {
          (!productsLoaded && !content) &&
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
          (productsLoaded && !content) &&
          <Row>
            <Col>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {products.map(product => (
                  <Card key={product.productId} style={{ width: "40%", margin: "5px" }}>
                    <Card.Img variant="top" src={"/images/product/" + product.image} />
                    <Card.Body>
                      <Card.Title>{product.name}</Card.Title>
                      <Card.Text>
                        {product.description}<br />
                        <strong>Category:</strong> {product.category.name}<br />
                        <strong>Price:</strong> {product.price} €
                      </Card.Text>
                      <Button disabled={!currentUser} variant="primary" onClick={() => this.handleShowDialog(product)}><FaCartPlus /> Buy</Button>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </Col>
          </Row>
        }

        <Modal show={this.state.setShowDialog} onHide={this.handleCloseDialog}>
          <Modal.Header closeButton>
            <Modal.Title>{this.state.selectedProduct?.name} - {this.state.selectedProduct?.price} €</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="productQuantity">
              <Form.Label>Quantity</Form.Label>
              <Form.Control name="productQuantity" onChange={this.handleChangeProductQuantity} type="number" value={this.state.productQuantity} />
            </Form.Group>
            <strong>Total:</strong> {this.state.amount} €
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" disabled={this.state.invalidQuantity} onClick={() => this.handleAddToCart(this.state.selectedProduct, currentUser)}>
              <FaCartPlus /> Add to cart
            </Button>
          </Modal.Footer>
        </Modal>

      </Container>
    )
  }
}

export default Products