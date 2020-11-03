import React, { Component } from "react"
import Axios from "axios"
import authHeader from '../../services/auth-header';
import autoBind from "react-autobind";
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import UserForm from './UserForm'
import Spinner from 'react-bootstrap/Spinner'

class EditCustomer extends Component {
    constructor(props) {
        super(props)
        autoBind(this)
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
        var id = this.props.match.params.id
        Axios.get(`http://localhost:8080/users/${id}`)
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
        var id = this.props.match.params.id
        Axios.put(`http://localhost:8080/users/${id}`, user, { headers: authHeader() }).then(
            res => {
                console.log(res)
                console.log(res.data)
            })
            .then(
                () => {
                    this.props.history.push("/usersmanager");
                    window.location.reload();
                },
                error => {
                    const resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();

                    this.setState({
                        loading: false,
                        message: resMessage
                    });
                }
            )
    }

    render() {
        var { userLoaded, user } = this.state
        if (!userLoaded) {
            return (
                <Container>
                    <Row>
                        <Col>
                            <h3>Edit user</h3>
                            <Spinner animation="border" role="status">
                                <span className="sr-only">Loading...</span>
                            </Spinner>
                        </Col>
                    </Row>
                </Container>
            )
        }
        return (
            <Container>
                <Row>
                    <Col>
                        <h3>Edit Customer</h3>
                        <UserForm handleChange={this.handleChange} submitUser={this.handleSubmit} user={user} />
                    </Col>
                </Row>
            </Container >
        )
    }
}

export default EditCustomer