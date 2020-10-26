import React, { Component } from "react";
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import { Link } from "react-router-dom"
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

class Customers extends Component {
    constructor() {
        super();
        this.state = {
            items: [],
            isLoaded: false
        }
    }

    deleteCustomer(id) {
        fetch("http://localhost:8080/customers/" + { id }, { method: "DELETE" });
    }

    componentDidMount() {
        fetch('http://localhost:8080/customers')
            .then(res => res.json())
            .then(json => {
                this.setState({
                    isLoaded: true,
                    items: json
                })
            });
    }

    render() {
        var { isLoaded, items } = this.state;

        if (!isLoaded) {
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
                            {items.map(item => (
                                <div key={item.customerId}>
                                    <h5>{item.name}</h5>
                                    <ul>
                                        <li>Address: {item.address}</li>
                                        <li>Email: {item.email}</li>
                                        <li>Phone: {item.phone}</li>
                                        <li>Total costs: {item.totalCosts} €</li>
                                        <Link to={"/editcustomer/" + item.customerId}>
                                            <Button variant="warning"><FaEdit /></Button>
                                        </Link>
                                        <Button variant="danger" onClick={() => this.deleteCustomer(item.customerId)}><FaTrash /></Button>
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

export default Customers;