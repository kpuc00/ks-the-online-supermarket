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
            price: 0,
            category: {
                categoryId: 0
            }
        }
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "categoryId") {
            this.setState(state => ({
                category: {
                    ...this.state.category,
                    [name]: value
                }
            }))
        }
        else {
            this.setState({
                ...this.state,
                [name]: value
            });
        }
    }

    submitProduct() {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(this.state),
        };
        fetch("http://localhost:8080/products/add", requestOptions);
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col>
                        <h3>Add new product</h3>
                        <ProductForm handleChange={this.handleChange} submitProduct={this.submitProduct} product={null} />
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default AddProduct;