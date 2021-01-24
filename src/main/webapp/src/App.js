import React, { Component } from "react"
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom"
import Axios from "axios"

import Home from './HomePage'
import NavigationBar from './components/NavigationBar'

import AuthService from "./services/auth-service"
import authHeader from "./services/auth-header"
import Login from "./components/auth/Login"
import Register from "./components/auth/Register"

import Profile from "./components/users/ProfilePage"

import AddProduct from "./components/products/AddProduct"
import EditProduct from "./components/products/EditProduct"
import StockManager from "./components/products/StockManager"
import DeletedProducts from './components/products/DeletedProducts'
import Products from './components/products/Products'
import ProductDetails from './components/products/ProductDetails'

import Orders from './components/orders/Orders'
import OrderDetails from "./components/orders/OrderDetails"
import Cart from './components/orders/Cart'
import OrdersManager from './components/orders/OrdersManager'
import OrderShipment from "./components/orders/OrderShipment"

import UsersManager from './components/users/UsersManager'
import EditUser from "./components/users/EditUser"

import Footer from "./components/Footer"

import './App.css'
import SentOrders from "./components/orders/SentOrders"
import DeliveredOrders from "./components/orders/DeliveredOrders"

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

      Axios.post(`/api/orders/cart/count`, givenUser, { headers: authHeader() })
        .then(
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
          <Route path="/products/:id" component={ProductDetails} />
          <Route exact path="/stockmanager" component={StockManager} />
          <Route path="/stockmanager/addproduct" component={AddProduct} />
          <Route path="/stockmanager/editproduct/:id" component={EditProduct} />
          <Route path="/stockmanager/deletedproducts" component={DeletedProducts} />

          <Route exact path="/orders" component={Orders} />
          <Route path="/orders/:id" component={OrderDetails} />
          <Route path="/cart" component={Cart} />
          <Route exact path="/ordersmanager" component={OrdersManager} />
          <Route path="/ordersmanager/sent" component={SentOrders} />
          <Route path="/ordersmanager/delivered" component={DeliveredOrders} />
          <Route path="/ordersmanager/:id" component={OrderShipment} />

          <Route exact path="/usersmanager" component={UsersManager} />
          <Route path="/usersmanager/edituser/:id" component={EditUser} />

          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/profile" component={Profile} />
        </Switch>
        <Footer />
      </Router>
    )
  }
}

export default App