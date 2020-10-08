import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import NavigationBar from './components/NavigationBar';
import Home from './components/Home';
import Products from './components/Products';
import Offers from './components/Offers';
import Order from './components/Order';

function App() {
  return (
      <div>
        <Router>
        <NavigationBar/>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/products" component={Products} />
            <Route path="/offers" component={Offers} />
            <Route path="/order" component={Order} />
          </Switch>
        </Router>
      </div>
  );
}

export default App;