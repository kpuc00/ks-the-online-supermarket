import React, { Component } from "react"
import Axios from "axios"
import AuthService from "../../services/auth-service";
import authHeader from '../../services/auth-header';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Spinner from 'react-bootstrap/Spinner'
import { Alert, Button, Form, FormControl, Image, InputGroup, ResponsiveEmbed } from "react-bootstrap"
import { Link } from "react-router-dom";
import { FaSearch } from 'react-icons/fa'

class Products extends Component {
  constructor() {
    super()
    this.state = {
      currentUser: AuthService.getCurrentUser(),
      products: [],
      search: "",
      searchAlert: "",
      content: "",
      productsLoaded: false
    }
  }

  componentDidMount() {
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
    Axios.get('/api/products').then(
      res => {
        if (res.status === 200) {
          const products = res.data
          this.setState({
            products,
            productsLoaded: true
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
    this.props.history.push("/products")
    window.location.reload()
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
    const quantity = ((e.target.value > 0 && e.target.value <= 50) || e.target.value === "") ? e.target.value : 1
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
    Axios.post(`/api/orders/addProduct`, item, { headers: authHeader() }).then(
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
    let { productsLoaded, products, search, searchAlert, currentUser, content } = this.state

    return (
      <Container>
        <h3 className="my-4">Products</h3>

        {(!productsLoaded && !content) &&
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
        {productsLoaded &&
          <>
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
                  <big><Card.Title as={Link} to={"/products/" + product.productId} variant="link">{product.name}</Card.Title></big>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col className="col-3">
                      <ResponsiveEmbed aspectRatio="16by9">
                        <div className="product-image">
                          <Image src={product.image ? (`data:image/png;base64,${product.image}`) : ("/images/product/default.jpg")} />
                        </div>
                      </ResponsiveEmbed>
                    </Col>
                    <Col>
                      <Card.Body>
                        <Card.Subtitle>Price: </Card.Subtitle><Card.Text>{product.price?.toFixed(2)} €</Card.Text>
                        <Card.Subtitle>Category: </Card.Subtitle><Card.Text>{product.category.name}</Card.Text>
                      </Card.Body>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))
            }
          </>
        }
      </Container>
    )
  }
}

export default Products