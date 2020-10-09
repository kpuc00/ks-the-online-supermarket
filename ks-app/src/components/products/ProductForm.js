import React from "react";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { Link } from "react-router-dom";

const ProductForm = ({ handleChange, submitProduct, product }) => {
    return (
        <Form>
            <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>Name*</Form.Label>
                <Form.Control id="name" onChange={handleChange} type="name" placeholder="Water" value={product?.name} />
                <Form.Label>Description</Form.Label>
                <Form.Control id="description" onChange={handleChange} type="text" placeholder="..." value={product?.description} />
                <Form.Label>Price*</Form.Label>
                <Form.Control id="price" onChange={handleChange} type="number" placeholder="0.00" value={product?.price} />
            </Form.Group>
            <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label>Select category*</Form.Label>
                <Form.Control as="select">
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                </Form.Control>
            </Form.Group>
            <Link to="/productsmanager">
                <Button variant="primary" onClick={submitProduct}>Submit</Button>
            </Link>
        </Form>
    )
}

export default ProductForm;