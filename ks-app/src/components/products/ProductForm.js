import React from "react"
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

const ProductForm = ({ handleChange, submitProduct, product, categories }) => {
    let cbPlaceholder
    if (product != null)
        cbPlaceholder = product?.category.name
    else
        cbPlaceholder = 'Select'

    return (
        <Form>
            <Form.Group controlId="name">
                <Form.Label>Name*</Form.Label>
                <Form.Control name="name" onChange={handleChange} type="name" placeholder={product?.name} />
            </Form.Group>
            <Form.Group controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control name="description" onChange={handleChange} type="text" placeholder={product?.description} />
            </Form.Group>
            <Form.Group controlId="price">
                <Form.Label>Price*</Form.Label>
                <Form.Control name="price" min="0" onChange={handleChange} type="number" placeholder={product && product.price.toFixed(2) + " €"} />
            </Form.Group>
            <Form.Group controlId="categoryId">
                <Form.Label>Select category*</Form.Label>
                <Form.Control as="select" name="categoryId" onChange={handleChange}>
                    <option selected disabled>{cbPlaceholder}</option>
                    {categories.map(category => (
                        <option key={category.categoryId} value={category.categoryId}>{category.name}</option>
                    ))}
                </Form.Control>
            </Form.Group>
            <Form.Group controlId="image">
                <Form.File name="image" accept="image/png,image/jpeg" label="Upload product image" />
            </Form.Group>
            <Button variant="primary" onClick={submitProduct}>Submit</Button>
        </Form>
    )
}

export default ProductForm