import React, { Component } from "react"
import { Link } from "react-router-dom"
import Axios from "axios"
import authHeader from '../services/auth-header';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa'

class ProductsManager extends Component {
  constructor() {
    super()
    this.state = {
      products: [],
      productsLoaded: false,
      content: ""
    }
  }

  componentDidMount() {
    Axios.get('http://localhost:8080/products').then(
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

  deleteProduct(id) {
    Axios.delete(`http://localhost:8080/products/${id}`, { headers: authHeader() })
      .then(res => {
        console.log(res)
        console.log(res.data)
      })
  }

  render() {
    var { productsLoaded, products } = this.state

    return (
      <Container className="p-1">
        <Row>
          <h3>Products manager</h3>
        </Row>

        {
          (!productsLoaded && !this.state.content) &&
          <Row>
            <Col>
              <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
              </Spinner>
            </Col>
          </Row>
        }
        {
          this.state.content &&
          <Row>
            <Col>
              <header className="jumbotron">
                <h3>{this.state.content}</h3>
              </header>
            </Col>
          </Row>
        }
        {
          (productsLoaded && !this.state.content) &&
          <Row>
            <Col>
              <Link to="/productsmanager/addproduct">
                <Button variant="primary"><FaPlus /> Add new product</Button>
              </Link>
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
                      <Link to={"/productsmanager/editproduct/" + product.productId}>
                        <Button variant="warning"><FaEdit /></Button>
                      </Link>
                      <Button variant="danger" onClick={() => this.deleteProduct(product.productId)}><FaTrash /></Button>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </Col>
          </Row>
        }
      </Container>
    )
  }
}

export default ProductsManager