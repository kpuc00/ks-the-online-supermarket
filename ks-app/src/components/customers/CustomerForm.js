import React from "react";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { Link } from "react-router-dom";

const CustomerForm = ({ handleChange, submitCustomer, customer }) => {
    return (
        <Form>
            <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>Name*</Form.Label>
                <Form.Control id="name" onChange={handleChange} type="name" placeholder="John Doe" value={customer?.name} />
                <Form.Label>Address</Form.Label>
                <Form.Control id="address" onChange={handleChange} type="address" placeholder="Edenstraat 6, Eindhoven" value={customer?.address}/>
                <Form.Label>Email address*</Form.Label>
                <Form.Control id="email" onChange={handleChange} type="email" placeholder="name@example.com" value={customer?.email}/>
                <Form.Label>Phone*</Form.Label>
                <Form.Control id="phone" onChange={handleChange} type="phone" placeholder="+359894567890" value={customer?.phone}/>
            </Form.Group>
            <Link to="/customers">
                <Button variant="primary" onClick={submitCustomer}>Submit</Button>
            </Link>
        </Form>
    )
}

export default CustomerForm;