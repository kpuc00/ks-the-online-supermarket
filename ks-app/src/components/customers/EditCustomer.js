import React, { Component } from "react";
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import CustomerForm from './CustomerForm'
import Spinner from 'react-bootstrap/Spinner'

class EditCustomer extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.submitCustomer = this.submitCustomer.bind(this);
        this.state = {
            name: "",
            address: "",
            email: "",
            phone: ""
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        });
    }

    componentDidMount() {
        var id = this.props.match.params.id;
        fetch('http://localhost:8080/customers/' + { id })
            .then(res => res.json())
            .then(json => {
                this.setState({
                    isLoaded: true,
                    items: json
                })
            });
    }

    submitCustomer() {
        const requestOptions = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(this.state),
        };
        fetch("http://localhost:8080/customers/slojiID", requestOptions)
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
                <div>
                    <Container>
                        <Row>
                            <Col>
                                <h3>Edit customer</h3>
                                <Spinner animation="border" role="status">
                                    <span className="sr-only">Loading...</span>
                                </Spinner>
                            </Col>
                        </Row>
                    </Container>
                </div>
            )
        }
        return (
            <div>
                <Container>
                    <Row>
                        <Col>
                            <h3>Edit Customer</h3>
                            {items.map(item => (
                                <CustomerForm handleChange={this.handleChange} submitCustomer={this.submitCustomer} customer={item} />
                            ))}
                        </Col>
                    </Row>
                </Container >
            </div>
        )
    }
}

export default EditCustomer;