import React from 'react';
import './App.css';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import CustomersList from "./CustomersList";

const ReactDOM = require("react-dom");

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {customers: []};
    }

    componentDidMount() {
        fetch("http://localhost:8080/customers").then((response) => {
            response.json().then((customers) => this.setState({customers: customers}));
        });
    }
render() {
    return(

        <div className="App">
            <header className="App-header">
                <CustomersList customers={this.state.customers} />
            </header>
        </div>
    )
};
}

export default App;
