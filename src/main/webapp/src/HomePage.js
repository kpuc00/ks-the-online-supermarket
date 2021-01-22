import React from "react"
import Container from "react-bootstrap/Container";

function Home() {
    return (
        <Container fluid className="p-0">
            <header className="jumbotron text-center homepage-background">
                <div className="homepage-text">
                    <h1>The best choice</h1>
                    <h5>You will find a good selection of products in our store.</h5>
                </div>
            </header>
        </Container>
    )
}

export default Home