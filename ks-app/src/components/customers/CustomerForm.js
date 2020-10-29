import React from "react"
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { Link } from "react-router-dom"

const CustomerForm = ({ handleChange, submitCustomer, customer }) => {
    return (
        <Form>
            <Form.Group controlId="name">
                <Form.Label>Name*</Form.Label>
                <Form.Control onChange={handleChange} type="name" placeholder={customer?.name} />
            </Form.Group>
            <Form.Group controlId="address">
                <Form.Label>Address</Form.Label>
                <Form.Control onChange={handleChange} type="address" placeholder={customer?.address} />
            </Form.Group>
            <Form.Group controlId="email">
                <Form.Label>Email address*</Form.Label>
                <Form.Control onChange={handleChange} type="email" placeholder={customer?.email} />
            </Form.Group>
            <Form.Group controlId="phone">
                <Form.Label>Phone*</Form.Label>
                <Form.Control onChange={handleChange} type="phone" placeholder={customer?.phone} />
            </Form.Group>
            <Link to="/customers">
                <Button variant="primary" onClick={submitCustomer}>Submit</Button>
            </Link>
        </Form>
    )
}

export default CustomerForm