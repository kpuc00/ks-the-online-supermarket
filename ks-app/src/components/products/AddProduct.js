import React, { Component } from "react"
import Axios from "axios"
import authHeader from '../../services/auth-header'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ProductForm from './ProductForm'
import Spinner from 'react-bootstrap/Spinner'

export default class AddProduct extends Component {
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
            categoriesLoaded: false,
            content: null,
            base64TextString: "",
            fileError: null
        }
    }

    componentDidMount() {
        Axios.get('/categories')
            .then(
                res => {
                    const categories = res.data
                    this.setState({
                        categories,
                        categoriesLoaded: true
                    })
                },
                () => {
                    this.setState({
                        content: "Something went wrong! Please try again later."
                    });
                }
            )
    }

    _handleReaderLoaded = (readerEvt) => {
        let binaryString = readerEvt.target.result
        this.setState({
            base64TextString: btoa(binaryString)
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
        else if (name === "image") {
            const file = e.target.files[0]
            if (file && ((file.type === "image/jpeg") || (file.type === "image/png")) && file.size <= 1048576) {
                const reader = new FileReader()
                reader.onload = this._handleReaderLoaded.bind(this)
                reader.readAsBinaryString(file)
                this.setState({
                    fileError: null
                })
            }
            else {
                if (file.type !== ("image/jpeg" || "image/png")) {
                    this.setState({
                        fileError: "Unsupported file type."
                    })
                }
                else if (file.size > 1048576) {
                    this.setState({
                        fileError: "File too large!"
                    })
                }
                else {
                    this.setState({
                        fileError: "File error!"
                    })
                }
            }
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
            },
            image: this.state.base64TextString
        }

        Axios.post(`/products/add`, product, { headers: authHeader() })
            .then(
                res => {
                    if (res.status === 201) {
                        this.props.history.push("/stockmanager");
                        window.location.reload();
                    }
                },
                () => {
                    this.setState({
                        content: "Something went wrong! Please try again later."
                    });
                }
            )
    }

    render() {
        let { categoriesLoaded, categories, content, fileError } = this.state
        return (
            <Container>
                <Row>
                    <h3>Add product</h3>
                </Row>

                {(!categoriesLoaded && !content) &&
                    <Row>
                        <Col>
                            <Spinner animation="border" role="status">
                                <span className="sr-only">Loading...</span>
                            </Spinner>
                        </Col>
                    </Row>
                }
                {content &&
                    <Row>
                        <Col>
                            <header className="jumbotron">
                                <h3>{content}</h3>
                            </header>
                        </Col>
                    </Row>
                }
                {categoriesLoaded &&
                    <Row>
                        <Col>
                            <ProductForm handleChange={this.handleChange} submitProduct={this.handleSubmit} product={null} categories={categories} fileInput={this.fileInput} fileError={fileError} />
                        </Col>
                    </Row>
                }
            </Container>
        )
    }
}