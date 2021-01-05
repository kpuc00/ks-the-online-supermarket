import React from "react"
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

const UserForm = ({ handleChange, submitUser, user }) => {
    return (
        <Form>
            <Form.Group controlId="firstName">
                <Form.Label>First name*</Form.Label>
                <Form.Control onChange={handleChange} type="firstName" placeholder={user?.firstName} />
            </Form.Group>
            <Form.Group controlId="lastName">
                <Form.Label>Last name*</Form.Label>
                <Form.Control onChange={handleChange} type="lastName" placeholder={user?.lastName} />
            </Form.Group>
            <Form.Group controlId="address">
                <Form.Label>Address (Street, House number, Postcode, City)</Form.Label>
                <Form.Control onChange={handleChange} type="address" placeholder={user?.address} />
            </Form.Group>
            <Form.Group controlId="email">
                <Form.Label>Email address*</Form.Label>
                <Form.Control onChange={handleChange} type="email" placeholder={user?.email} />
            </Form.Group>
            <Form.Group controlId="phone">
                <Form.Label>Phone*</Form.Label>
                <Form.Control onChange={handleChange} type="phone" placeholder={user?.phone} />
            </Form.Group>
            <Button variant="primary" onClick={submitUser}>Submit</Button>
        </Form>
    )
}

export default UserForm