import React, { Component } from "react";
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'

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
        <Container>
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
        <Container>
          <Row>
            <Col>
              <h3>Products</h3>
              <div style={{display: "flex", flexWrap: "wrap"}}>
                {items.map(item => (
                  <Card key={item.productId} style={{ width: "40%", margin: "5px"}}>
                    <Card.Img variant="top" src={"/images/product/" + item.image} />
                    <Card.Body>
                      <Card.Title>{item.name}</Card.Title>
                      <Card.Text>
                        <div>{item.description}</div>
                        <strong>Category:</strong> {item.category.name}<br />
                        <strong>Price:</strong> {item.price} €
                      </Card.Text>
                      <Button variant="primary">Add to cart</Button>
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