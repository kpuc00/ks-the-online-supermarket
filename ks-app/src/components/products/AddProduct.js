import React, { Component } from "react";
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ProductForm from './ProductForm'
import Spinner from 'react-bootstrap/Spinner'

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
            },
            categories: [],
            isLoaded: false
        }
    }

    componentDidMount() {
        fetch('http://localhost:8080/categories')
            .then(res => res.json())
            .then(json => {
                this.setState({
                    isLoaded: true,
                    categories: json
                })
            });
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
        console.log(this.state)
    }

    submitProduct() {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(this.state),
        };
        console.log(this.state);
        fetch("http://localhost:8080/products/add", requestOptions);
    }

    render() {
        var { isLoaded, categories } = this.state;
        if (!isLoaded) {
            return (
                <Container>
                    <Row>
                        <Col>
                            <h3>Add new product</h3>
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
                <Container>
                    <Row>
                        <Col>
                            <h3>Add new product</h3>
                            <ProductForm handleChange={this.handleChange} submitProduct={this.submitProduct} product={null} categories={categories} />
                        </Col>
                    </Row>
                </Container>
            )
        }
    }
}

export default AddProduct;