import React, { Component } from "react";
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

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
              <h6>Loading...</h6>
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
              <ul>
                {items.map(item => (
                  <li key={item.id}>
                    Name: {item.name} | Price: {item.price}
                  </li>
                ))}
              </ul>
            </Col>
          </Row>
        </Container>

      );
    }
  }

}

export default Products;