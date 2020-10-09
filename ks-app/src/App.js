import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import NavigationBar from './components/NavigationBar';
import Home from './pages/Home';
import Products from './pages/Products';
import Offers from './pages/Offers';
import Order from './pages/Order';
import Customers from './pages/Customers';
import AddCustomer from "./components/customers/AddCustomer";
import EditCustomer from "./components/customers/EditCustomer";
import AddProduct from "./components/products/AddProduct";
import EditProduct from "./components/products/EditProduct";
import ProductsManager from "./pages/ProductsManager";

function App() {
  return (
      <div>
        <Router>
        <NavigationBar/>
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
            <Route path="/editcustomer/:id" exact component={EditCustomer} />
          </Switch>
        </Router>
      </div>
  );
}

export default App;