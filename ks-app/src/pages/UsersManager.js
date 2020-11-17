import React, { Component } from "react"
import Container from 'react-bootstrap/Container'
import Axios from "axios"
import authHeader from '../services/auth-header';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import { Link } from "react-router-dom"
import { FaEdit, FaTrash } from 'react-icons/fa'
import { Modal } from "react-bootstrap";

class UsersManager extends Component {
    constructor() {
        super()
        this.state = {
            users: [],
            usersLoaded: false,
            content: "",
            showDialog: false,
            setShowDialog: false,
            selectedUser: null
        }
    }

    componentDidMount() {
        Axios.get('http://localhost:8080/users', { headers: authHeader() }).then(
            res => {
                const users = res.data
                this.setState({
                    users,
                    usersLoaded: true
                })
            },
            error => {
                this.setState({
                    content:
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString()
                });
            }
        )
    }

    deleteUser(id) {
        Axios.delete(`http://localhost:8080/users/${id}`, { headers: authHeader() }).then(
            res => {
                console.log(res)
                console.log(res.data)
            },
            error => {
                this.setState({
                    content:
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString()
                });
            }
        )
        this.handleCloseDialog()
    }

    handleCloseDialog = () => {
        this.setState({
            setShowDialog: false
        })
    }
    handleShowDialog = (user) => {
        this.setState({
            selectedUser: user,
            setShowDialog: true
        })
    }

    render() {
        var { usersLoaded, users } = this.state

        return (
            <Container className="p-1">
                <Row><h3>Users Manager</h3></Row>

                {
                    (!usersLoaded && !this.state.content) &&
                    <Row>
                        <Col>
                            <Spinner animation="border" role="status">
                                <span className="sr-only">Loading...</span>
                            </Spinner>
                        </Col>
                    </Row>
                }
                {
                    this.state.content &&
                    <Row>
                        <Col>
                            <header className="jumbotron">
                                <h3>{this.state.content}</h3>
                            </header>
                        </Col>
                    </Row>
                }
                {
                    (usersLoaded && !this.state.content) &&
                    <Row>
                        <Col>
                            {/* <Link to="/usersmanager/adduser">
                                <Button variant="primary"><FaPlus /> Add new user</Button>
                            </Link> */}
                            {users.map(user => (
                                <div key={user.id}>
                                    <h5>{user.firstName} {user.lastName}</h5>
                                    <ul>
                                        {
                                            user.address &&
                                            <li>Address: {user.address}</li>
                                        }
                                        {
                                            !user.address &&
                                            <li>Address: Not added</li>
                                        }
                                        <li>Email: {user.email}</li>
                                        <li>Phone: {user.phone}</li>
                                        <li>Total costs: {user.totalCosts} €</li>
                                        <li>Roles:</li>
                                        <ul>
                                            {user.roles &&
                                                user.roles.map(role => (
                                                    <li key={role.id}>{role.name}</li>
                                                ))}
                                        </ul>

                                        <Link to={"/usersmanager/edituser/" + user.id}>
                                            <Button variant="warning"><FaEdit /></Button>
                                        </Link>
                                        <Button variant="danger" onClick={() => this.handleShowDialog(user)}><FaTrash /></Button>
                                    </ul>
                                </div>
                            ))}
                        </Col>
                    </Row>
                }

                <Modal show={this.state.setShowDialog} onHide={this.handleCloseDialog}>
                    <Modal.Header closeButton>
                        <Modal.Title>Are you sure you want to delete?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{this.state.selectedUser?.firstName} {this.state.selectedUser?.lastName}</Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={() => this.deleteUser(this.state.selectedUser.id)}>
                            <FaTrash /> Delete
                        </Button>
                    </Modal.Footer>
                </Modal>

            </Container>
        )
    }
}

export default UsersManager