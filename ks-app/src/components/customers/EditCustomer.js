import React, { Component } from "react";
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import CustomerForm from './CustomerForm'
import Spinner from 'react-bootstrap/Spinner'
import Axios from "axios";

class EditCustomer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            address: "",
            email: "",
            phone: "",
            customer: null,
            customerLoaded: false
        }
    }

    componentDidMount() {
        var id = this.props.match.params.id;
        Axios.get(`http://localhost:8080/customers/${id}`)
            .then(res => {
                const customer = res.data;
                this.setState({
                    name: customer.name,
                    address: customer.address,
                    email: customer.email,
                    phone: customer.phone,
                    customer,
                    customerLoaded: true
                })
            });
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        });
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
        var id = this.props.match.params.id;
        Axios.put(`http://localhost:8080/customers/${id}`, customer)
            .then(res => {
                console.log(res);
                console.log(res.data);
            })
    }

    render() {
        var { customerLoaded, customer } = this.state;
        if (!customerLoaded) {
            return (
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
            )
        }
        return (
            <Container>
                <Row>
                    <Col>
                        <h3>Edit Customer</h3>
                        <CustomerForm handleChange={this.handleChange} submitCustomer={this.handleSubmit} customer={customer} />
                    </Col>
                </Row>
            </Container >
        )
    }
}

export default EditCustomer;