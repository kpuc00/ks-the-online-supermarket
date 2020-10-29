import React, { Component } from "react"
import Container from 'react-bootstrap/Container'
import Axios from "axios"
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import { Link } from "react-router-dom"
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa'

class Customers extends Component {
    constructor() {
        super()
        this.state = {
            customers: [],
            customersLoaded: false
        }
    }

    componentDidMount() {
        Axios.get('http://localhost:8080/customers')
            .then(res => {
                const customers = res.data
                this.setState({
                    customers,
                    customersLoaded: true
                })
            })
    }

    deleteCustomer(id) {
        Axios.delete(`http://localhost:8080/customers/${id}`)
            .then(res => {
                console.log(res)
                console.log(res.data)
            })
    }

    render() {
        var { customersLoaded, customers } = this.state

        if (!customersLoaded) {
            return (
                <Container className="p-1">
                    <Row>
                        <Col>
                            <h3>Customers</h3>
                            <Spinner animation="border" role="status">
                                <span className="sr-only">Loading...</span>
                            </Spinner>
                        </Col>
                    </Row>
                </Container>
            )
        }
        else {
            return (
                <Container className="p-1">
                    <Row>
                        <Col>
                            <h3>Customers</h3>
                            <Link to="/addcustomer">
                                <Button variant="primary"><FaPlus /> Add new customer</Button>
                            </Link>
                            {customers.map(customer => (
                                <div key={customer.customerId}>
                                    <h5>{customer.name}</h5>
                                    <ul>
                                        <li>Address: {customer.address}</li>
                                        <li>Email: {customer.email}</li>
                                        <li>Phone: {customer.phone}</li>
                                        <li>Total costs: {customer.totalCosts} €</li>
                                        <Link to={"/editcustomer/" + customer.customerId}>
                                            <Button variant="warning"><FaEdit /></Button>
                                        </Link>
                                        <Button variant="danger" onClick={() => this.deleteCustomer(customer.customerId)}><FaTrash /></Button>
                                    </ul>
                                </div>
                            ))}
                        </Col>
                    </Row>
                </Container>
            )
        }
    }
}

export default Customers