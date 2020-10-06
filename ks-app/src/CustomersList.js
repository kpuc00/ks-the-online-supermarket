import React from "react";
import "./App.css";
import Customer from "./Customer";

class CustomersList extends React.Component {
    render() {
        const customers = this.props.customers.map((customer) => (<Customer key={customer.id} customer={customer}/>));
        return (<table>
            <tbody>
            <tr>
                <th>Name</th>
                <th>Email</th>
            </tr>
            {customers}
            </tbody>
        </table>);
    }
}

export default CustomersList;