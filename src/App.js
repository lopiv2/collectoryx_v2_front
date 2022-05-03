import React, { Component } from "react";
import { styles } from "./css-common";
import { withStyles } from "@material-ui/styles";
import "./App.css";
import { Router } from "./components/Router";
import { BrowserRouter } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import { Helmet, HelmetProvider } from "react-helmet-async";

class App extends Component {
  render() {
    const { classes } = this.props;
    return (
      <BrowserRouter>
        <HelmetProvider>
          <Helmet defer={false}>
            <title>Collectoryx</title>
            <meta name="description" content="App Description" />
            <meta name="theme-color" content="#008f68" />
          </Helmet>
        </HelmetProvider>
        <Router></Router>
      </BrowserRouter>
    );
  }
}

export default withStyles(styles)(App);
