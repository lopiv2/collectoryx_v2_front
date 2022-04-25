import React, { Component } from "react";
import { styles } from "./css-common";
import { withStyles } from "@material-ui/styles";
import "./App.css";
import { Router } from "./components/Router";
import { BrowserRouter } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';


class App extends Component {
  render() {
    const { classes } = this.props;
    return (
      <BrowserRouter>
        <Router>
        </Router >
      </BrowserRouter>
    );
  }
}

export default withStyles(styles)(App);
