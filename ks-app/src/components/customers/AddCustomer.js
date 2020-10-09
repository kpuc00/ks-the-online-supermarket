import React, { Component } from "react";
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import CustomerForm from './CustomerForm'

class AddCustomer extends Component {
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

    submitCustomer() {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(this.state),
        };
        fetch("http://localhost:8080/customers/add", requestOptions)
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
                            <h3>Add new customer</h3>
                            <CustomerForm handleChange={this.handleChange} submitCustomer={this.submitCustomer} />
                        </Col>
                    </Row>
                </Container >
            </div>
        )
    }
}

export default AddCustomer;