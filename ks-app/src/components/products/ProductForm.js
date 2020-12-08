import React from "react"
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { Alert, Card, Col, Image, ResponsiveEmbed, Row } from "react-bootstrap"

const ProductForm = ({ state, handleChange, submitProduct, clearImage }) => {
    let cbPlaceholder
    console.log(state.productPrice)
    if (state.product != null)
        cbPlaceholder = state.product.category.name
    else
        cbPlaceholder = 'Category'

    return (
        <Card>
            <Card.Body>
                <Form>
                    <Form.Group controlId="productName">
                        <Form.Label>Name*</Form.Label>
                        <Form.Control name="productName" onChange={handleChange} type="text" value={state.productName} />
                    </Form.Group>
                    <Form.Group controlId="productDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control name="productDescription" onChange={handleChange} type="text" value={state.productDescription} />
                    </Form.Group>
                    <Form.Group controlId="productPrice">
                        <Form.Label>Price*</Form.Label>
                        <Form.Control name="productPrice" min="0" onChange={handleChange} type="number" placeholder={state.product && state.product.price?.toFixed(2) + " €"} />
                    </Form.Group>
                    <Form.Group controlId="categoryId">
                        <Form.Label>Select category*</Form.Label>
                        <Form.Control as="select" name="categoryId" onChange={handleChange}>
                            <option selected disabled>{cbPlaceholder}</option>
                            {state.categories.map(category => (
                                <option key={category.categoryId} value={category.categoryId}>{category.name}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Card.Text>Select image:</Card.Text>
                    <Row>
                        <Col>
                            <ResponsiveEmbed aspectRatio="16by9">
                                <div className="product-image">
                                    <Image src={state.base64TextString ? (`data:image/png;base64,${state.base64TextString}`) : ("/images/product/default.jpg")} />
                                </div>
                            </ResponsiveEmbed>
                        </Col>
                        <Col>
                            <Button variant="danger" onClick={() => clearImage()} disabled={!state.base64TextString}>Clear image</Button>
                        </Col>
                    </Row>
                    <Form.Group controlId="image">
                        {state?.fileError &&
                            <Alert variant="danger">{state.fileError}</Alert>
                        }
                        <Form.Text>Accepts .jpg/.png, max 1 MB.</Form.Text>
                        <Form.File name="image" id="image" accept="image/png,image/jpeg" onChange={handleChange} />
                    </Form.Group>
                    <Button disabled={state.fileError} variant="primary" onClick={submitProduct}>Submit</Button>
                </Form>
            </Card.Body>
        </Card>
    )
}

export default ProductForm