import React, { Component } from "react";
import { Link } from "react-router-dom"
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
      items: [],
      isLoaded: false
    }
  }

  deleteProduct(id) {
    fetch("http://localhost:8080/products/" + { id }, { method: "DELETE" });
  }

  componentDidMount() {
    fetch('http://localhost:8080/products')
      .then(res => res.json())
      .then(json => {
        this.setState({
          isLoaded: true,
          items: json
        })
      });
  }

  render() {
    var { isLoaded, items } = this.state;

    if (!isLoaded) {
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
                {items.map(item => (
                  <Card key={item.productId} style={{ width: "40%", margin: "5px" }}>
                    <Card.Img variant="top" src={"/images/product/" + item.image} />
                    <Card.Body>
                      <Card.Title>{item.name}</Card.Title>
                      <Card.Text>
                        {item.description}<br />
                        <strong>Category:</strong> {item.category.name}<br />
                        <strong>Price:</strong> {item.price} €
                      </Card.Text>
                      <Link to={"/editproduct/" + item.productId}>
                        <Button variant="warning"><FaEdit /></Button>
                      </Link>
                      <Button variant="danger" onClick={() => this.deleteProduct(item.productId)}><FaTrash /></Button>
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