import React, { Component } from "react"
import Axios from "axios"
import authHeader from '../../services/auth-header';
import Container from 'react-bootstrap/Container'
import UserForm from './UserForm'
import Spinner from 'react-bootstrap/Spinner'

export default class EditCustomer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: "",
            address: "",
            email: "",
            phone: "",
            user: null,
            userLoaded: false,
            submitting: false,
            message: ""
        }
    }

    componentDidMount() {
        let id = this.props.match.params.id
        Axios.get(`/api/users/${id}`, { headers: authHeader() })
            .then(res => {
                const user = res.data
                this.setState({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    address: user.address,
                    email: user.email,
                    phone: user.phone,
                    user: user,
                    userLoaded: true
                })
            })
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault()
        this.setState({
            message: "",
            submitting: true
        });
        const user = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            address: this.state.address,
            email: this.state.email,
            phone: this.state.phone
        }
        let id = this.props.match.params.id
        Axios.put(`/api/users/${id}`, user, { headers: authHeader() })
            .then(
                () => {
                    this.props.history.push("/profile");
                    window.location.reload();
                },
                () => {
                    this.setState({
                        message: "Something went wrong! Please try again later.",
                        loading: false
                    })
                })
    }

    render() {
        let { userLoaded, user, message } = this.state
        return (
            <Container>
                <h3 className="my-4">Edit Customer</h3>
                {(!userLoaded && !message) &&
                    <Spinner animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                }
                {message &&
                    <header className="jumbotron">
                        <h3>{message}</h3>
                    </header>
                }
                <UserForm handleChange={this.handleChange} submitUser={this.handleSubmit} user={user} />
            </Container >
        )
    }
}