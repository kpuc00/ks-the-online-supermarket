import React, { Component } from "react"
import Axios from "axios"
import authHeader from '../../services/auth-header'
import Container from 'react-bootstrap/Container'
import ProductForm from './ProductForm'
import Spinner from 'react-bootstrap/Spinner'
import { Breadcrumb } from "react-bootstrap"

export default class EditProduct extends Component {
    constructor(props) {
        super(props)
        // this.fileInput = React.createRef();
        this.state = {
            productName: "",
            productDescription: "",
            productPrice: 0,
            category: {
                categoryId: 0
            },
            categories: [],
            product: null,
            productLoaded: false,
            categoriesLoaded: false,
            content: null,
            base64TextString: "",
            fileError: null
        }
    }

    componentDidMount() {
        let id = this.props.match.params.id
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

        Axios.get(`/products/${id}`)
            .then(
                res => {
                    const product = res.data
                    this.setState({
                        productName: product.name,
                        productDescription: product.description,
                        productPrice: product.price,
                        category: {
                            categoryId: product.category.categoryId
                        },
                        base64TextString: product.image,
                        product,
                        productLoaded: true
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
        console.log(name, value)
        if (name === "categoryId") {
            this.setState({
                category: {
                    ...this.state.category,
                    [name]: value
                }
            })
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
                this.setState({
                    base64TextString: ""
                })
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

    clearImage = () => {
        this.setState({
            ...this.state,
            base64TextString: "",
            fileError: ""
        })
        document.getElementById("image").value = null
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const product = {
            name: this.state.productName,
            description: this.state.productDescription,
            price: this.state.productPrice,
            category: {
                categoryId: this.state.category.categoryId
            },
            image: this.state.base64TextString
        }
        let id = this.props.match.params.id
        Axios.put(`/products/${id}`, product, { headers: authHeader() })
            .then(
                res => {
                    if (res.status === 204) {
                        this.props.history.push("/stockmanager");
                        window.location.reload();
                    }
                },
                () => {
                    this.setState({
                        content: "Something went wrong! Please try again later.",
                        loading: false
                    });
                }
            )
    }

    render() {
        let { productLoaded, categoriesLoaded, content } = this.state
        return (
            <Container>
                <h3 className="my-4">Edit product</h3>
                <Breadcrumb>
                    <Breadcrumb.Item href="/stockmanager">Stock manager</Breadcrumb.Item>
                    <Breadcrumb.Item active>Edit product</Breadcrumb.Item>
                </Breadcrumb>
                {((!productLoaded || !categoriesLoaded) && !content) &&
                    <Spinner animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                }
                {content &&
                    <header className="jumbotron">
                        <h3>{content}</h3>
                    </header>
                }
                {(productLoaded && categoriesLoaded) &&
                    <ProductForm state={this.state} handleChange={this.handleChange} submitProduct={this.handleSubmit} clearImage={this.clearImage} />
                }
            </Container>
        )
    }
}