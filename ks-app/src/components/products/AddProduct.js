import React, { Component } from "react";
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ProductForm from './ProductForm'

class AddProduct extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.submitProduct = this.submitProduct.bind(this);
        this.state = {
            name: "",
            description: "",
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        });
    }

    submitProduct() {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(this.state),
        };
        fetch("http://localhost:8080/products/add", requestOptions)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    data: responseJson.token
                });
                console.log(responseJson);
            });
    }

    render() {
        return (
            <div>
                <Container>
                    <Row>
                        <Col>
                            <h3>Add new product</h3>
                            <ProductForm handleChange={this.handleChange} submitProduct={this.submitProduct} />
                        </Col>
                    </Row>
                </Container >
            </div>
        )
    }
}

export default AddProduct;