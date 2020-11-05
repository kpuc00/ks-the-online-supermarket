import React, { Component } from "react"
import Axios from "axios"
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import UserForm from './UserForm'
import authHeader from '../../services/auth-header'

class AddCustomer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            firstName: "",
            lastName: "",
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

        Axios.post(`http://localhost:8080/customers/add`, customer, { headers: authHeader() })
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
                        <UserForm handleChange={this.handleChange} submitCustomer={this.handleSubmit} />
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default AddCustomer