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
import { Form, Image, Modal } from "react-bootstrap"
import { Link } from "react-router-dom";

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
        if (res.status === 200) {
          const products = res.data
          this.setState({
            products,
            productsLoaded: true
          })
        }
        if (res.status === 500) {
          this.setState({
            content: "Something went wrong! Please try again later."
          });
        }
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
    Axios.post(`/orders/addProduct`, item, { headers: authHeader() }).then(
      res => {
        if (res.status === 200) {
          this.props.history.push("/cart");
          window.location.reload();
        }
      },
      error => {
        this.setState({
          content: "Something went wrong! Please try again later."
        });
      }
    )
    this.handleCloseDialog()
  }

  render() {
    let { productsLoaded, products, productQuantity, invalidQuantity, amount, currentUser, content, setShowDialog, selectedProduct } = this.state

    return (
      <Container className="p-1">
        <Row>
          <h3>Products</h3>
        </Row>

        {(!productsLoaded && !content) &&
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
        {productsLoaded &&
          <Row>
            <Col>
              {products.map(product => (
                <Card key={product.productId} className="m-3">
                  <Card.Header>
                    <big><Card.Title as={Link} variant="link" to={"/products/" + product.productId}>{product.name}</Card.Title></big>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col className="col-4">
                        <div className="product-image">
                          <Image src={product.image ? (`data:image/png;base64,${product.image}`) : ("/images/product/default.jpg")} />
                        </div>
                      </Col>
                      <Col>
                        <Card.Body>
                          <Card.Subtitle>Price: </Card.Subtitle><Card.Text>{product.price?.toFixed(2)} €</Card.Text>
                          <Card.Subtitle>Description: </Card.Subtitle><Card.Text>{product.description}</Card.Text>
                          <Card.Subtitle>Category: </Card.Subtitle><Card.Text>{product.category.name}</Card.Text>
                        </Card.Body>
                      </Col>
                    </Row>
                  </Card.Body>
                  <Card.Footer>
                    <Button className="float-right" onClick={() => this.handleShowDialog(product)} variant="primary" disabled={!currentUser}><FaCartPlus /> Buy</Button>
                  </Card.Footer>
                </Card>
                // <Card key={product.productId} style={{ width: "40%", margin: "5px" }}>
                //   <Card.Img variant="top" src={product.image ? (`data:image/png;base64,${product.image}`) : ("/images/product/default.jpg")} />
                //   <Card.Body>
                //     <big><Card.Title as={Link} variant="link" to={"/products/" + product.productId}>{product.name}</Card.Title></big>
                //     <Card.Text>
                //       {product.description}<br />
                //       <strong>Category:</strong> {product.category.name}<br />
                //       <strong>Price:</strong> {product.price.toFixed(2)} €
                //     </Card.Text>
                //     <Button disabled={!currentUser} variant="primary" onClick={() => this.handleShowDialog(product)}><FaCartPlus /> Buy</Button>
                //   </Card.Body>
                // </Card>
              ))}
            </Col>
          </Row>
        }

        <Modal show={setShowDialog} onHide={this.handleCloseDialog}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedProduct?.name} - {selectedProduct?.price?.toFixed(2)} €</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="productQuantity">
              <Form.Label>Quantity</Form.Label>
              <Form.Control name="productQuantity" onChange={this.handleChangeProductQuantity} type="number" value={productQuantity} />
            </Form.Group>
            <strong>Total:</strong> {amount?.toFixed(2)} €
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" disabled={invalidQuantity} onClick={() => this.handleAddToCart(selectedProduct, currentUser)}>
              <FaCartPlus /> Add to cart
            </Button>
          </Modal.Footer>
        </Modal>

      </Container>
    )
  }
}

export default Products