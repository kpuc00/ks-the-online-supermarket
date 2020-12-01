import React, { Component } from "react"
import { Link } from "react-router-dom"
import Axios from "axios"
import authHeader from '../../services/auth-header';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import { FaEdit, FaTrashRestore } from 'react-icons/fa'
import { Breadcrumb, Image, Modal, ResponsiveEmbed } from "react-bootstrap";

export default class DeletedProducts extends Component {
  constructor() {
    super()
    this.state = {
      products: [],
      productsLoaded: false,
      content: "",
      showDialog: false,
      setShowProductDialog: false,
      selectedProduct: {}
    }
  }

  componentDidMount() {
    Axios.get('/products/deleted', { headers: authHeader() })
      .then(
        res => {
          const products = res.data
          this.setState({
            products,
            productsLoaded: true
          })
        },
        () => {
          this.setState({
            content: "Something went wrong! Please try again later."
          })
        })
  }

  restoreProduct(id) {
    Axios.put(`/products/restore/${id}`, null, { headers: authHeader() })
      .then(
        res => {
          if (res.status === 204) {
            window.location.reload()
          }
        },
        () => {
          this.setState({
            content: "Something went wrong! Please try again later."
          })
        })
    this.handleCloseProductDialog()
  }

  handleCloseCategoryDialog = () => {
    this.setState({
      setShowCategoryDialog: false
    })
  }

  handleShowCategoryDialog = (categoryId) => {
    this.setState({
      selectedCategoryId: categoryId,
      setShowCategoryDialog: true
    })
  }

  handleCloseProductDialog = () => {
    this.setState({
      setShowProductDialog: false
    })
  }

  handleShowProductDialog = (product) => {
    this.setState({
      selectedProduct: product,
      setShowProductDialog: true
    })
  }

  render() {
    let { productsLoaded, products } = this.state

    return (
      <Container className="p-1">
        <Row>
          <Col>
            <h3>Deleted products</h3>
            <Breadcrumb>
              <Breadcrumb.Item href="/stockmanager">Stock manager</Breadcrumb.Item>
              <Breadcrumb.Item active>Deleted products</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>

        {(!productsLoaded && !this.state.content) &&
          <Row>
            <Col>
              <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
              </Spinner>
            </Col>
          </Row>
        }
        {this.state.content &&
          <Row>
            <Col>
              <header className="jumbotron">
                <h3>{this.state.content}</h3>
              </header>
            </Col>
          </Row>
        }
        {productsLoaded &&
          <Row>
            <Col>
              {products.length === 0 &&
                <h5>Empty</h5>
              }
              {products.map(product => (
                <Card key={product.productId} className="m-3">
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
                    <Button as={Link} to={"/stockmanager/editproduct/" + product.productId} variant="warning"><FaEdit /> Edit</Button>
                    <Button className="float-right" onClick={() => this.handleShowProductDialog(product)} variant="primary"><FaTrashRestore /> Restore</Button>
                  </Card.Footer>
                </Card>
              ))}
            </Col>
          </Row>
        }

        <Modal show={this.state.setShowProductDialog} onHide={this.handleCloseProductDialog}>
          <Modal.Header closeButton>
            <Modal.Title>You are about to restore this product.</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <strong>Product:</strong> {this.state.selectedProduct?.name}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => this.restoreProduct(this.state.selectedProduct.productId)}>
              <FaTrashRestore /> Restore
            </Button>
          </Modal.Footer>
        </Modal>

      </Container>
    )
  }
}