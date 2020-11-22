import React, { Component } from "react"
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom"
import Axios from "axios"

import Home from './HomePage'
import NavigationBar from './components/NavigationBar'

import AuthService from "./services/auth-service";
import authHeader from "./services/auth-header";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

import Profile from "./components/users/ProfilePage";
import BoardUser from "./pages/UserPage";
import BoardModerator from "./pages/ModeratorPage";
import BoardAdmin from "./pages/AdminPage";

import AddProduct from "./components/products/AddProduct"
import EditProduct from "./components/products/EditProduct"
import ProductsManager from "./components/products/ProductsManager"
import Products from './components/products/Products'

import Orders from './components/orders/Orders'
import OrderDetails from "./components/orders/OrderDetails";
import Cart from './components/orders/Cart'

import UsersManager from './components/users/UsersManager'
import AddUser from "./components/users/AddUser"
import EditUser from "./components/users/EditUser"

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
      cartCount: 0
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
      
      const givenUser = {
        id: user.id
      }

      Axios.post(`/orders/cart/count`, givenUser, { headers: authHeader() }).then(
        res => {
          if (res.status === 200) {
            const num = res.data;
            this.setState({
              cartCount: num
            })
          }
        }
      )
    }
  }

  logOut() {
    AuthService.logout();
  }
  render() {
    let { currentUser, showModeratorBoard, showAdminBoard, cartCount } = this.state;

    return (
      <Router>
        <NavigationBar currentUser={currentUser} showModeratorBoard={showModeratorBoard} showAdminBoard={showAdminBoard} logOut={this.logOut} cartCount={cartCount} />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/products" component={Products} />
          <Route exact path="/productsmanager" component={ProductsManager} />
          <Route path="/productsmanager/addproduct" component={AddProduct} />
          <Route path="/productsmanager/editproduct/:id" component={EditProduct} />

          <Route exact path="/orders" component={Orders} />
          <Route path="/orders/:id" component={OrderDetails} />
          <Route path="/cart" component={Cart} />

          <Route exact path="/usersmanager" component={UsersManager} />
          <Route path="/usersmanager/adduser" component={AddUser} />
          <Route path="/usersmanager/edituser/:id" component={EditUser} />

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