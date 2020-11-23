import React, { Component } from "react"
import Axios from "axios"
import authHeader from '../../services/auth-header'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ProductForm from './ProductForm'
import Spinner from 'react-bootstrap/Spinner'

class AddProduct extends Component {
    constructor(props) {
        super(props)
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
        Axios.get('/categories')
            .then(res => {
                const categories = res.data
                this.setState({
                    categories,
                    categoriesLoaded: true
                })
            })
    }

    handleChange = (e) => {
        const { name, value } = e.target
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
            })
        }
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const product = {
            name: this.state.name,
            description: this.state.description,
            price: this.state.price,
            category: {
                categoryId: this.state.category.categoryId
            }
        }

        Axios.post(`/products/add`, product, { headers: authHeader() })
            .then(
                res => {
                    if (res.status === 201) {
                        this.props.history.push("/productsmanager");
                        window.location.reload();
                    }
                },
                error => {
                    const resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();

                    this.setState({
                        loading: false,
                        message: resMessage
                    });
                }
            )
    }

    render() {
        let { categoriesLoaded, categories } = this.state
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

export default AddProduct