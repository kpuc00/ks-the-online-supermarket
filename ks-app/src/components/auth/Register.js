import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";

import AuthService from "../../services/auth-service";
import { Alert, Button, Card, Container } from "react-bootstrap";

const required = value => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                This field is required!
            </div>
        );
    }
};

const vfirstname = value => {
    if (value.length > 20) {
        return (
            <div className="alert alert-danger" role="alert">
                The first name must not be longer than 20 characters.
            </div>
        );
    }
};

const vlastName = value => {
    if (value.length > 30) {
        return (
            <div className="alert alert-danger" role="alert">
                The last name must not be longer than 30 characters.
            </div>
        );
    }
};

const email = value => {
    if (!isEmail(value)) {
        return (
            <div className="alert alert-danger" role="alert">
                This is not a valid email.
            </div>
        );
    }
};

const vaddress = value => {
    if (value.length > 90) {
        return (
            <div className="alert alert-danger" role="alert">
                The address must not be longer than 90 characters.
            </div>
        );
    }
};

const vphone = value => {
    if (value.length > 15) {
        return (
            <div className="alert alert-danger" role="alert">
                The phone must not be longer than 15 characters.
            </div>
        );
    }
};

const vusername = value => {
    if (value.length < 3 || value.length > 20) {
        return (
            <div className="alert alert-danger" role="alert">
                The username must be between 3 and 20 characters.
            </div>
        );
    }
};

const vpassword = value => {
    if (value.length < 6 || value.length > 40) {
        return (
            <div className="alert alert-danger" role="alert">
                The password must be between 6 and 40 characters.
            </div>
        );
    }
};

export default class Register extends Component {
    state = {}
    constructor(props) {
        super(props);

        this.state = {
            firstName: "",
            lastName: "",
            email: "",
            address: "",
            phone: "",
            username: "",
            password: "",
            successful: false,
            message: ""
        };
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleRegister = (e) => {
        e.preventDefault();

        this.setState({
            message: "",
            successful: false
        });

        this.form.validateAll();

        if (this.checkBtn.context._errors.length === 0) {
            AuthService.register(
                this.state.firstName,
                this.state.lastName,
                this.state.email,
                this.state.address,
                this.state.phone,
                this.state.username,
                this.state.password
            ).then(
                response => {
                    this.setState({
                        message: response.data.message,
                        successful: true
                    });
                    this.handleLogin();
                },
                () => {
                    this.setState({
                        message: "Something went wrong! Please try again later.",
                        successful: false
                    })
                })
        }
    }

    handleLogin() {
        this.setState({
            message: "",
            successful: false
        });

        AuthService.login(this.state.username, this.state.password).then(
            () => {
                this.props.history.push("/");
                window.location.reload();
            },
            () => {
                this.setState({
                    message: "Something went wrong! Please try again later.",
                    successful: false
                })
            })
    }

    render() {
        return (
            <Container className="my-5">
                <Card>
                    <Card.Body>
                        <Alert variant="info">Entries with "*" are required!</Alert>
                        <Form
                            onSubmit={this.handleRegister}
                            ref={c => {
                                this.form = c;
                            }}
                        >
                            {!this.state.successful && (
                                <div>
                                    <div className="form-group">
                                        <label htmlFor="firstName">First name*</label>
                                        <Input
                                            type="text"
                                            className="form-control"
                                            name="firstName"
                                            value={this.state.firstName}
                                            onChange={this.onChange}
                                            validations={[required, vfirstname]}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="lastName">Last name*</label>
                                        <Input
                                            type="text"
                                            className="form-control"
                                            name="lastName"
                                            value={this.state.lastName}
                                            onChange={this.onChange}
                                            validations={[required, vlastName]}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="email">Email*</label>
                                        <Input
                                            type="text"
                                            className="form-control"
                                            name="email"
                                            value={this.state.email}
                                            onChange={this.onChange}
                                            validations={[required, email]}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="address">Address (Street, House number, Postcode, City)</label>
                                        <Input
                                            type="text"
                                            className="form-control"
                                            name="address"
                                            value={this.state.address}
                                            onChange={this.onChange}
                                            validations={[vaddress]}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="phone">Phone*</label>
                                        <Input
                                            type="text"
                                            className="form-control"
                                            name="phone"
                                            value={this.state.phone}
                                            onChange={this.onChange}
                                            validations={[required, vphone]}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="username">Username*</label>
                                        <Input
                                            type="text"
                                            className="form-control"
                                            name="username"
                                            value={this.state.username}
                                            onChange={this.onChange}
                                            validations={[required, vusername]}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="password">Password*</label>
                                        <Input
                                            type="password"
                                            className="form-control"
                                            name="password"
                                            value={this.state.password}
                                            onChange={this.onChange}
                                            validations={[required, vpassword]}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <button className="btn btn-primary btn-block">Sign Up</button>
                                    </div>
                                </div>
                            )}

                            {this.state.message && (
                                <div className="form-group">
                                    <div
                                        className={
                                            this.state.successful
                                                ? "alert alert-success"
                                                : "alert alert-danger"
                                        }
                                        role="alert"
                                    >
                                        {this.state.message}
                                    </div>
                                </div>
                            )}
                            <CheckButton
                                style={{ display: "none" }}
                                ref={c => {
                                    this.checkBtn = c;
                                }}
                            />
                        </Form>
                        <Card.Text className="small text-center">Already have an account? <Button variant="link" href="/login">Login</Button></Card.Text>
                    </Card.Body>
                </Card>
            </Container>
        );
    }
}