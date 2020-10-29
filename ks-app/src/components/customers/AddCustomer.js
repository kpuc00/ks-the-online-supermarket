import React, { Component } from "react";
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import CustomerForm from './CustomerForm'
import Axios from "axios";

class AddCustomer extends Component {
    constructor(props) {
        super(props);
        // this.handleChange = this.handleChange.bind(this);
        // this.submitProduct = this.submitProduct.bind(this);
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
        })
        console.log(this.state)
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const customer = {
            name: this.state.name,
            address: this.state.address,
            email: this.state.email,
            phone: this.state.phone
        }
        console.log("state");
        console.log(this.state);
        console.log("object");
        console.log(customer);

        Axios.post(`http://localhost:8080/customers/add`, { customer })
            .then(res => {
                console.log(res);
                console.log(res.data);
            })
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col>
                        <h3>Add new customer</h3>
                        <CustomerForm handleChange={this.handleChange} submitCustomer={this.handleSubmit} />
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default AddCustomer;