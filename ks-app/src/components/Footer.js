import React from "react"
import { Col, Row } from "react-bootstrap"
import '../styles/footer.css'

const Footer = () => {
  return (
    <div className="footer">
      <Row>
        <Col>
          <h5 className="title">KS Supermarket</h5>
          <p>The Online Supermarket</p>
        </Col>
        <Col>
          <h5 className="title">Links</h5>
          <ul>
            <li className="list-unstyled">
              <a href="#!">Link 1</a>
            </li>
            <li className="list-unstyled">
              <a href="#!">Link 2</a>
            </li>
            <li className="list-unstyled">
              <a href="#!">Link 3</a>
            </li>
            <li className="list-unstyled">
              <a href="#!">Link 4</a>
            </li>
          </ul>
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