import React, { Component } from "react"
import Axios from "axios"
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ProductForm from './ProductForm'
import Spinner from 'react-bootstrap/Spinner'

class EditProduct extends Component {
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
            product: null,
            productLoaded: false,
            categoriesLoaded: false
        }
    }

    componentDidMount() {
        var id = this.props.match.params.id
        Axios.get('http://localhost:8080/categories')
            .then(res => {
                const categories = res.data
                this.setState({
                    categories,
                    categoriesLoaded: true
                })
            })

        Axios.get(`http://localhost:8080/products/${id}`)
            .then(res => {
                const product = res.data
                this.setState({
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    category: {
                        categoryId: product.category.categoryId
                    },
                    product,
                    productLoaded: true
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
        var id = this.props.match.params.id
        Axios.put(`http://localhost:8080/products/${id}`, product)
            .then(result => {
                console.log(result)
                console.log(result.data)
            })
    }

    render() {
        var { productLoaded, categoriesLoaded, product, categories } = this.state
        if (!productLoaded || !categoriesLoaded) {
            return (
                <Container>
                    <Row>
                        <Col>
                            <h3>Edit product</h3>
                            <Spinner animation="border" role="status">
                                <span className="sr-only">Loading...</span>
                            </Spinner>
                        </Col>
                    </Row>
                </Container>
            )
        }
        return (
            <Container>
                <Row>
                    <Col>
                        <h3>Edit product</h3>
                        <ProductForm handleChange={this.handleChange} submitProduct={this.handleSubmit} product={product} categories={categories} />
                    </Col>
                </Row>
            </Container >
        )
    }
}

export default EditProduct