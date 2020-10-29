import React, { Component } from "react";
import { Link } from "react-router-dom"
import Axios from "axios";
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

class ProductsManager extends Component {
  constructor() {
    super();
    this.state = {
      products: [],
      productsLoaded: false
    }
  }

  componentDidMount() {
    Axios.get('http://localhost:8080/products')
      .then(res => {
        const products = res.data;
        this.setState({
          products,
          productsLoaded: true
        })
      })
  }

  deleteProduct(id) {
    Axios.delete(`http://localhost:8080/products/${id}`)
      .then(res => {
        console.log(res);
        console.log(res.data);
      })
  }

  render() {
    var { productsLoaded, products } = this.state;

    if (!productsLoaded) {
      return (
        <Container className="p-1">
          <Row>
            <Col>
              <h3>Products manager</h3>
              <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
              </Spinner>
            </Col>
          </Row>
        </Container>
      )
    }
    else {
      return (
        <Container className="p-1">
          <Row>
            <Col>
              <h3>Products manager</h3>
              <Link to="/addproduct">
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
                      <Link to={"/editproduct/" + product.productId}>
                        <Button variant="warning"><FaEdit /></Button>
                      </Link>
                      <Button variant="danger" onClick={() => this.deleteProduct(product.productId)}><FaTrash /></Button>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      );
    }
  }
}

export default ProductsManager;