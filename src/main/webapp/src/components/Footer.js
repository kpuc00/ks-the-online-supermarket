import React from "react"
import { Col, Row } from "react-bootstrap"

const Footer = () => {
  return (
    <div className="footer">
      <Row className="my-3">
        <Col>
          <h5 className="title">KS Supermarket</h5>
          <p>The Online Supermarket</p>
        </Col>
      </Row>
      <Row>
        <Col>
          &copy; {new Date().getFullYear()} Copyright: Kristiyan Strahilov
        </Col>
      </Row>
    </div>
  )
}

export default Footer