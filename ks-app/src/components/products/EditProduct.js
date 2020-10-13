import React, { Component } from "react";
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ProductForm from './ProductForm'
import Spinner from 'react-bootstrap/Spinner'

class EditProduct extends Component {
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

    componentDidMount() {
        var id = this.props.match.params.id;
        fetch('http://localhost:8080/products/' + { id })
            .then(res => res.json())
            .then(json => {
                this.setState({
                    isLoaded: true,
                    items: json
                })
            });
    }

    submitProduct() {
        const requestOptions = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(this.state),
        };

        var id = this.props.match.params.id;
        fetch("http://localhost:8080/products/" + { id }, requestOptions)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    data: responseJson.token
                });
                console.log(responseJson);
            });
    }

    render() {
        var { isLoaded, items } = this.state;
        if (!isLoaded) {
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
                        {items.map(item => (
                            <ProductForm handleChange={this.handleChange} submitProduct={this.submitProduct} product={item} />
                        ))}
                    </Col>
                </Row>
            </Container >
        )
    }
}

export default EditProduct;