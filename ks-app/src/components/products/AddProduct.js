import React, { Component } from "react";
import Axios from "axios";
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ProductForm from './ProductForm'
import Spinner from 'react-bootstrap/Spinner'

class AddProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            description: "",
            price: 0,
            category: {
                categoryId: 0
            },
            categories: [],
            categoriesLoaded: false
        }
    }

    componentDidMount() {
        Axios.get('http://localhost:8080/categories')
            .then(res => {
                const categories = res.data;
                this.setState({
                    categories,
                    categoriesLoaded: true
                })
            })
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

    handleSubmit = (e) => {
        e.preventDefault();

        const product = {
            name: this.state.name,
            description: this.state.description,
            price: this.state.price,
            category: {
                categoryId: this.state.category.categoryId
            }
        };

        console.log("Result:");
        console.log(product);

        Axios.post(`http://localhost:8080/products/add`, { product })
            .then(res => {
                console.log(res);
                console.log(res.data);
            })
    }

    render() {
        var { categoriesLoaded, categories } = this.state;
        if (!categoriesLoaded) {
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
                            <ProductForm handleChange={this.handleChange} submitProduct={this.handleSubmit} product={null} categories={categories} />
                        </Col>
                    </Row>
                </Container>
            )
        }
    }
}

export default AddProduct;