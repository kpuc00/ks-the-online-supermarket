import React, { Component } from "react"
import Container from 'react-bootstrap/Container'
import Axios from "axios"
import authHeader from '../../services/auth-header';
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import { Link } from "react-router-dom"
import { FaEdit, FaTrash } from 'react-icons/fa'
import { Modal } from "react-bootstrap";

export default class UsersManager extends Component {
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
        Axios.get('/api/users', { headers: authHeader() }).then(
            res => {
                const users = res.data
                this.setState({
                    users,
                    usersLoaded: true
                })
            },
            () => {
                this.setState({
                    content: "Something went wrong! Please try again later."
                })
            })
    }

    deleteUser(id) {
        Axios.delete(`/api/users/${id}`, { headers: authHeader() }).then(
            res => {
                if (res.status === 204) {
                    window.location.reload()
                }
            },
            () => {
                this.setState({
                    content: "Something went wrong! Please try again later."
                })
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
        let { usersLoaded, users } = this.state

        return (
            <Container>
                <h3 className="my-4">Users Manager</h3>

                {(!usersLoaded && !this.state.content) &&
                    <Spinner animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                }
                {this.state.content &&
                    <header className="jumbotron">
                        <h3>{this.state.content}</h3>
                    </header>
                }
                {(usersLoaded && !this.state.content) &&
                    users.map(user => (
                        <div key={user.id}>
                            <h5>{user.firstName} {user.lastName}</h5>
                            <ul>
                                <li>Username: {user.username}</li>
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
                                <li>Total costs: {user.totalCosts.toFixed(2)} €</li>
                                <li>Roles:</li>
                                <ul>
                                    {user.roles &&
                                        user.roles.map(role => (
                                            <li key={role.id}>{role.name}</li>
                                        ))}
                                </ul>

                                <Button as={Link} to={"/usersmanager/edituser/" + user.id} variant="warning"><FaEdit /></Button>
                                <Button variant="danger" onClick={() => this.handleShowDialog(user)}><FaTrash /></Button>
                            </ul>
                        </div>
                    ))
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