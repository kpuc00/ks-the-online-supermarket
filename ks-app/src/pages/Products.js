import React, { Component } from "react";
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import { FaCartPlus } from 'react-icons/fa';

class Products extends Component {
  constructor() {
    super();
    this.state = {
      items: [],
      isLoaded: false
    }
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
      return <div>
        <Container className="p-1">
          <Row>
            <Col>
              <h3>Products</h3>
              <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
              </Spinner>
            </Col>
          </Row>
        </Container>
      </div>
    }
    else {
      return (
        <Container className="p-1">
          <Row>
            <Col>
              <h3>Products</h3>
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
                      <Button variant="primary"><FaCartPlus /> Add to cart</Button>
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

export default Products;