import React, { Component } from "react"
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom"
import NavigationBar from './components/NavigationBar'

import AuthService from "./services/auth-service";

import Login from "./components/login.component";
import Register from "./components/register.component";
//import Home from "./components/home.component";
import Profile from "./components/profile.component";
import BoardUser from "./components/board-user.component";
import BoardModerator from "./components/board-moderator.component";
import BoardAdmin from "./components/board-admin.component";

import Home from './pages/Home'
import Products from './pages/Products'
import Offers from './pages/Offers'
import Order from './pages/Order'
import Customers from './pages/Customers'
import AddCustomer from "./components/customers/AddCustomer"
import EditCustomer from "./components/customers/EditCustomer"
import AddProduct from "./components/products/AddProduct"
import EditProduct from "./components/products/EditProduct"
import ProductsManager from "./pages/ProductsManager"
import Footer from "./components/Footer"

import './App.css'

class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      showModeratorBoard: false,
      showAdminBoard: false,
      currentUser: undefined,
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
        showModeratorBoard: user.roles.includes("ROLE_MODERATOR"),
        showAdminBoard: user.roles.includes("ROLE_ADMIN"),
      });
    }
  }

  logOut() {
    AuthService.logout();
  }
  render() {
    const { currentUser, showModeratorBoard, showAdminBoard } = this.state;

    return (
      <Router>
        <NavigationBar currentUser={currentUser} showModeratorBoard={showModeratorBoard} showAdminBoard={showAdminBoard} logOut={this.logOut} />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/products" component={Products} />
          <Route path="/productsmanager" component={ProductsManager} />
          <Route path="/addproduct" component={AddProduct} />
          <Route path="/editproduct/:id" exact component={EditProduct} />

          <Route path="/offers" component={Offers} />

          <Route path="/order" component={Order} />

          <Route path="/customers" component={Customers} />
          <Route path="/addcustomer" component={AddCustomer} />
          <Route path="/editcustomer/:id" component={EditCustomer} />

          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/profile" component={Profile} />
          <Route path="/user" component={BoardUser} />
          <Route path="/mod" component={BoardModerator} />
          <Route path="/admin" component={BoardAdmin} />
        </Switch>
        <Footer />
      </Router>
    )
  }
}

export default App