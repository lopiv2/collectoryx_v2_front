<<<<<<< HEAD
import React, { Component} from "react";
import { styles } from "./css-common";
import { withStyles } from "@material-ui/core";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import "./App.css";
import SignInSide from "./components/SignInSide";
import Dashboard from "./components/Dashboard";
import AuthService from "./app/api/auth.api";
=======
import React, { Component } from "react";
import { styles } from "./css-common";
import { withStyles } from "@material-ui/core";
import "./App.css";
import { Router } from "./components/Router";
import { BrowserRouter } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
>>>>>>> 4a1d133b (first commit)


class App extends Component {
  render() {
    const { classes } = this.props;
    return (
<<<<<<< HEAD
      <Router>
        <div>
          {/*<nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/users">Users</Link>
              </li>
              <li>
                <Link to="/hola-mundo">Hello</Link>
              </li>
            </ul>
        </nav>*/}
          <Routes>
            {AuthService.isLogged() ? (
              <Route exact path="/" element={<Dashboard />}>
              </Route>
            ) : (
              <Route path="/login" element={<SignInSide />}>
              </Route>)
            }
          </Routes>
        </div>
      </Router >
=======
      <BrowserRouter>
        <Router>
        </Router >
      </BrowserRouter>

>>>>>>> 4a1d133b (first commit)
    );
  }
}

export default withStyles(styles)(App);
