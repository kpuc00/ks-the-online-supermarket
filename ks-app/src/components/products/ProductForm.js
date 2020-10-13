import React from "react";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { Link } from "react-router-dom";

const ProductForm = ({ handleChange, submitProduct, product }) => {
    return (
        <Form>
            <Form.Group controlId="name">
                <Form.Label>Name*</Form.Label>
                <Form.Control name="name" onChange={handleChange} type="name" placeholder="Water" value={product?.name} />
            </Form.Group>
            <Form.Group controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control name="description" onChange={handleChange} type="text" placeholder="..." value={product?.description} />
            </Form.Group>
            <Form.Group controlId="price">
                <Form.Label>Price*</Form.Label>
                <Form.Control name="price" onChange={handleChange} type="number" placeholder="0.00" value={product?.price} />
            </Form.Group>
            <Form.Group controlId="categoryId">
                <Form.Label>Select category*</Form.Label>
                <Form.Control as="select" name="categoryId" onChange={handleChange}>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                </Form.Control>
            </Form.Group>
            <Link to="/productsmanager">
                <Button variant="primary" onClick={submitProduct}>Submit</Button>
            </Link>
        </Form>
    )
}

export default ProductForm;