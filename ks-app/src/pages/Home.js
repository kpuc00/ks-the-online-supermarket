import React, { useState } from "react";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Carousel, Container } from "react-bootstrap";

function Home() {
    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };

    return (
        <Container fluid>
            <Row>
                <Col>
                    <div className="slideshow">
                        <Carousel activeIndex={index} onSelect={handleSelect}>
                            <Carousel.Item>
                                <img
                                    className="d-block w-100"
                                    src="/images/supermarket.jpg"
                                    alt="First slide"
                                />
                                <Carousel.Caption>
                                    <h3>Stay fresh</h3>
                                    <p>Our products are fresh everyday.</p>
                                </Carousel.Caption>
                            </Carousel.Item>
                            <Carousel.Item>
                                <img
                                    className="d-block w-100"
                                    src="/images/market.jpg"
                                    alt="Second slide"
                                />

                                <Carousel.Caption>
                                    <h3>The best choice</h3>
                                    <p>You will find a good selection of products in our store.</p>
                                </Carousel.Caption>
                            </Carousel.Item>
                            <Carousel.Item>
                                <img
                                    className="d-block w-100"
                                    src="/images/countryside.jpg"
                                    alt="Third slide"
                                />

                                <Carousel.Caption>
                                    <h3>Homemade is better</h3>
                                    <p>Try fresh food right from our farm.</p>
                                </Carousel.Caption>
                            </Carousel.Item>
                        </Carousel>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default Home;