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
import { FaPlus, FaSearch, FaEdit, FaTrash, FaTrashAlt } from 'react-icons/fa'
import { Alert, Form, FormControl, Image, InputGroup, Modal, ResponsiveEmbed } from "react-bootstrap";

export default class StockManager extends Component {
  constructor() {
    super()
    this.state = {
      products: [],
      categories: [],
      search: "",
      searchAlert: "",
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
    Axios.get('/api/categories/admin', { headers: authHeader() })
      .then(
        res => {
          const categories = res.data
          this.setState({
            categories,
            categoriesLoaded: true
          })
        },
        () => {
          this.setState({
            content: "Something went wrong! Please try again later."
          })
        })

    const search = new URLSearchParams(this.props.location.search).get('search')
    this.setState({
      ...this.state,
      search: search
    })
    if (search !== null && search !== "") {
      Axios.get(`/api/products/search/${search}`).then(
        res => {
          if (res.status === 200) {
            const products = res.data
            this.setState({
              products,
              searchAlert: `Showing ${products.length} product(s) with name "${search}".`,
              productsLoaded: true
            })
          }
          else if (res.status === 204) {
            this.getProducts()
            this.setState({
              searchAlert: `Products with name containing "${search}" were not found!`
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
    else {
      this.getProducts()
    }
  }

  getProducts = () => {
    Axios.get('/api/products/admin', { headers: authHeader() })
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

  addCategoryDialog = () => {
    this.handleShowCategoryDialog(null)
  }

  handleChangeCategory = (e) => {
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
    Axios.post(`/api/categories/add`, category, { headers: authHeader() }).then(
      res => {
        if (res.status === 201) {
          window.location.reload()
        }
      },
      () => {
        this.setState({
          content: "Something went wrong! Please try again later."
        })
      })
    this.handleCloseCategoryDialog()
  }

  editCategory(id) {
    const category = {
      name: this.state.newCategoryName
    }
    Axios.put(`/api/categories/${id}`, category, { headers: authHeader() }).then(
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
    this.handleCloseCategoryDialog()
  }

  deleteCategory(id) {
    Axios.delete(`/api/categories/${id}`, { headers: authHeader() })
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
    this.handleCloseCategoryDialog()
  }

  deleteProduct(id) {
    Axios.delete(`/api/products/${id}`, { headers: authHeader() })
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

  handleChangeSearchBar = (e) => {
    const { name, value } = e.target
    this.setState({
      ...this.state,
      [name]: value
    })
  }

  searchProducts = (e) => {
    e.preventDefault()
    const { search } = this.state
    if (search.trim() !== "") {
      this.props.history.push("?search=" + search)
      window.location.reload()
    }
  }

  clearSearchBar = () => {
    this.props.history.push("/stockmanager")
    window.location.reload()
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
    let { productsLoaded, categoriesLoaded, products, search, searchAlert, categories, selectedCategoryId, newCategoryName } = this.state

    return (
      <Container>
        <h3 className="my-4">Stock manager</h3>

        {(!productsLoaded && !this.state.content) &&
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        }
        {this.state.content &&
          <header className="jumbotron">
            <h3>{this.state.content}</h3>
          </header>
        }
        {categoriesLoaded &&
          <Card>
            <Card.Header>
              <Card.Title className="m-0">Categories</Card.Title>
            </Card.Header>
            <Card.Body>
              <Button className="mb-2" variant="primary" onClick={this.addCategoryDialog}><FaPlus /> Add</Button>
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
        }
        {productsLoaded &&
          <Card className="my-3">
            <Card.Header>
              <Card.Title className="m-0">Products</Card.Title>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col className="text-left">
                  <Button as={Link} to="/stockmanager/addproduct" variant="primary"><FaPlus /> Add</Button>
                </Col>
                <Col className="text-right">
                  <Button as={Link} to="/stockmanager/deletedproducts" variant="secondary"><FaTrashAlt /> Deleted</Button>
                </Col>
              </Row>
              <Form onSubmit={this.searchProducts}>
                <InputGroup className="my-2 w-100">
                  <InputGroup.Prepend>
                    <InputGroup.Text id="search-addon"><FaSearch /></InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl
                    required
                    type="text"
                    name="search"
                    placeholder="Search..."
                    value={search}
                    maxLength="30"
                    aria-describedby="search-addon"
                    onChange={this.handleChangeSearchBar}
                  />
                  <Button disabled={!search} type="submit" variant="secondary">Go</Button>
                  <Button disabled={!search} variant="danger" onClick={() => this.clearSearchBar()}>Clear</Button>
                </InputGroup>

              </Form>
              {searchAlert &&
                <Alert variant="info">{searchAlert}</Alert>
              }
              {products.map(product => (
                <Card key={product.productId} className="my-3">
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
                          {product.description &&
                            <><Card.Subtitle>Description: </Card.Subtitle><Card.Text>{product.description}</Card.Text></>
                          }
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
            </Card.Body>
          </Card>
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