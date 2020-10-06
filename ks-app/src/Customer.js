import React from "react";
import "./App.css";

class Customer extends React.Component {
    render() {
        return (<tr>
            <td>{this.props.customers.name}</td>
            <td>{this.props.customers.email}</td>
        </tr>);
    }
}

export default Customer;