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
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa'
import { Form, Image, Modal } from "react-bootstrap";

export default class StockManager extends Component {
  constructor() {
    super()
    this.state = {
      products: [],
      categories: [],
      productsLoaded: false,
      categoriesLoaded: false,
      content: "",
      showCategoryDialog: false,
      setShowCategoryDialog: false,
      showDialog: false,
      setShowProductDialog: false,
      selectedProduct: {},
      selectedCategoryId: 0,
      newCategoryName: null
    }
  }

  componentDidMount() {
    Axios.get('/categories')
      .then(res => {
        const categories = res.data
        this.setState({
          categories,
          categoriesLoaded: true
        })
      })
    Axios.get('/products/admin', { headers: authHeader() }).then(
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

  addCategoryDialog = () => {
    this.handleShowCategoryDialog(null)
  }

  handleChangeCategory = (e) => {
    console.log(e.target.value)
    this.handleShowCategoryDialog(e.target.value)
  }

  handleChangeNewCategoryName = (e) => {
    this.setState({
      newCategoryName: e.target.value
    })
  }

  addCategory() {
    const category = {
      name: this.state.newCategoryName
    }
    Axios.post(`/categories/add`, category, { headers: authHeader() }).then(
      res => {
        if (res.status === 201) {
          window.location.reload()
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
    this.handleCloseCategoryDialog()
  }

  editCategory(id) {
    const category = {
      name: this.state.newCategoryName
    }
    Axios.put(`/categories/${id}`, category, { headers: authHeader() }).then(
      res => {
        if (res.status === 204) {
          window.location.reload()
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
    this.handleCloseCategoryDialog()
  }

  deleteCategory(id) {
    Axios.delete(`/categories/${id}`, { headers: authHeader() }).then(
      res => {
        if (res.status === 204) {
          window.location.reload()
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
    this.handleCloseCategoryDialog()
  }

  deleteProduct(id) {
    Axios.delete(`/products/${id}`, { headers: authHeader() })
      .then(res => {
        if (res.status === 204) {
          window.location.reload()
        }
      })
    this.handleCloseProductsDialog()
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
    let { productsLoaded, categoriesLoaded, products, categories, selectedCategoryId, newCategoryName } = this.state

    return (
      <Container className="p-1">
        <Row>
          <h3>Stock manager</h3>
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
        {categoriesLoaded &&
          <Row>
            <Col>
              <Card className="mb-3">
                <Card.Header>
                  <Card.Title className="m-0">Categories</Card.Title>
                </Card.Header>
                <Card.Body>
                  <Button className="float-right mb-2" variant="primary" onClick={this.addCategoryDialog}><FaPlus /> Add new category</Button>
                  <Form.Group controlId="categoryId">
                    <Form.Label>Select to manage:</Form.Label>
                    <Form.Control as="select" name="categoryId" onChange={this.handleChangeCategory}>
                      <option selected disabled>Category</option>
                      {categories.map(category => (
                        <option key={category.categoryId} value={category.categoryId}>{category.name}</option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        }
        {productsLoaded &&
          <Row>
            <Col>
              <Link to="/stockmanager/addproduct">
                <Button variant="primary"><FaPlus /> Add new product</Button>
              </Link>

              {products.map(product => (
                <Card key={product.productId} className="m-3">
                  <Card.Header>
                    <Card.Title className="m-0">{product.name}</Card.Title>
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
                    <Button as={Link} to={"/stockmanager/editproduct/" + product.productId} variant="warning"><FaEdit /> Edit</Button>
                    <Button className="float-right" onClick={() => this.handleShowProductDialog(product)} variant="danger"><FaTrash /> Delete</Button>
                  </Card.Footer>
                </Card>
              ))}
            </Col>
          </Row>
        }

        <Modal show={this.state.setShowCategoryDialog} onHide={this.handleCloseCategoryDialog}>
          <Modal.Header closeButton>
            <Modal.Title>Category manager</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="categoryName">
              <Form.Label>
                {selectedCategoryId ?
                  <>Rename category:</> : <>New category name:</>
                }
              </Form.Label>
              <Form.Control name="categoryName" placeholder="Name" type="name" onChange={this.handleChangeNewCategoryName} />
            </Form.Group>
            {selectedCategoryId &&
              <Button disabled={!newCategoryName} variant="warning" onClick={() => this.editCategory(selectedCategoryId)}>
                <FaEdit /> Edit category
            </Button>
            }
          </Modal.Body>
          <Modal.Footer>
            {selectedCategoryId ?
              <Button variant="danger" onClick={() => this.deleteCategory(selectedCategoryId)}>
                <FaTrash /> Delete category
              </Button>
              :
              <Button variant="primary" onClick={() => this.addCategory()}>Submit</Button>
            }
          </Modal.Footer>
        </Modal>

        <Modal show={this.state.setShowProductDialog} onHide={this.handleCloseProductDialog}>
          <Modal.Header closeButton>
            <Modal.Title>Are you sure you want to delete?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <strong>Product:</strong> {this.state.selectedProduct?.name}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={() => this.deleteProduct(this.state.selectedProduct.productId)}>
              <FaTrash /> Delete
            </Button>
          </Modal.Footer>
        </Modal>

      </Container>
    )
  }
}