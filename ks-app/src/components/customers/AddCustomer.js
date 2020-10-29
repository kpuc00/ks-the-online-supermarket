import React, { Component } from "react"
import Axios from "axios"
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import CustomerForm from './CustomerForm'

class AddCustomer extends Component {
    constructor(props) {
        super(props)
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
        e.preventDefault()
        const customer = {
            name: this.state.name,
            address: this.state.address,
            email: this.state.email,
            phone: this.state.phone
        }

        Axios.post(`http://localhost:8080/customers/add`, customer)
            .then(res => {
                console.log(res)
                console.log(res.data)
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

export default AddCustomer