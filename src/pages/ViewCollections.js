import React, { useState, useEffect, useRef } from "react";
import { Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { Box } from "@mui/material";
import { Grid } from "@mui/material";
import { Button } from "@mui/material";
import ConfigService from "../app/api/config.api";
import "../styles/Dashboard.css";
import NoImage from "../images/no-photo-available.png";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardActions, CardMedia } from "@mui/material";
import styles from "../styles/Collections.css";
import BorderLinearProgressBar from "../components/BorderLinearProgressBar";
import { NavLink } from "react-router-dom";
import useBreadcrumbs from "use-react-router-breadcrumbs";

function ViewCollection(props) {
  const [collectionsList, setCollectionsList] = useState([]);
  const navigate = useNavigate();
  const [col, setCol] = useState([]);
  const breadcrumbs = useBreadcrumbs();
  let isMounted = useRef(false);
  //var userData=null;
  if (localStorage.getItem("user")) {
    var user = localStorage.getItem("user");
    var userData = JSON.parse(user);
  }

  useEffect(() => {
    const collections = ConfigService.getCollectionLists(userData.id)
      .then((response) => {
        if (userData.license.includes("Free")) {
          setCollectionsList(response.data.slice(0, 5));
        } else {
          if (isMounted) {
            setCollectionsList(response.data);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
    return () => { isMounted = false };
  }, []);

  useEffect(() => {
    if (collectionsList.length > 0) {
      collectionsList.map((item) => {
        const collections = ConfigService.getCollectionItemsById(item.id).then(
          (response) => {
            //console.log(response.data)
            let collected = 0;
            let totalItems = 0;
            response.data.map((item) => {
              if (item.own) {
                collected = collected + 1;
              }
            });
            totalItems = response.data.length;
            const items = {
              id: item.id,
              collected: collected,
              totalItems: totalItems,
            };
            setCol((col) => [...col, items]);
          }
        );
      });
    }
  }, [collectionsList]);

  return (
    <Box sx={{ display: "flex" }}>
      <ToastContainer autoClose={2000} />
      <Grid>
        {/*breadcrumbs.map(({
          match,
          breadcrumb
        }) => (
          <span key={match.pathname}>
             / 
            <NavLink to={match.pathname}>{breadcrumb}</NavLink>
          </span>
        ))*/}
        <Grid item xs={6}>
          <Typography display="inline" variant="h4" component="h4">
            <FormattedMessage id="app.collection.view_collections_title"></FormattedMessage>
          </Typography>
          {userData.license.includes("Free") && (
            <Typography display="inline" variant="h4" component="h4">
              {" (" + collectionsList.length + "/3)"}
            </Typography>
          )}
        </Grid>
        <Grid container spacing={5} className="container" pt={3}>
          {collectionsList.map((item, index) => (
            <Grid item key={item.id}>
              <Card
                sx={{ height: 400, minWidth: 250, maxWidth: 250, boxShadow: 5 }}
                ml={200}
              >
                <CardContent>
                  {item.logo ? null : (
                    <Typography
                      align="center"
                      sx={{ fontSize: 20 }}
                      color="text.primary"
                      gutterBottom
                    >
                      {item.name}
                    </Typography>
                  )}
                  <Typography variant="h5" component="div"></Typography>
                  {item.logo != null && (
                    <CardMedia
                      component="img"
                      width="100%"
                      image={require("../../public/images/" + item.logo.path)}
                      alt={item.name}
                      className="card-collection"
                      style={styles}
                    />
                  )}

                  <Typography
                    align="center"
                    sx={{ mb: 0.5 }}
                    mt={1}
                    color="text.secondary"
                  >
                    <FormattedMessage id="app.collection.items"></FormattedMessage>
                  </Typography>
                  <Typography align="center" color="text.secondary">
                    {col[col.findIndex((e) => e.id === item.id)]
                      ? col[col.findIndex((e) => e.id === item.id)].collected +
                      "/" +
                      col[col.findIndex((e) => e.id === item.id)].totalItems
                      : null}
                  </Typography>
                  <BorderLinearProgressBar
                    variant="determinate"
                    value={
                      col[col.findIndex((e) => e.id === item.id)]
                        ? +Number.parseFloat(
                          (col[col.findIndex((e) => e.id === item.id)]
                            .collected /
                            col[col.findIndex((e) => e.id === item.id)]
                              .totalItems) *
                          100
                        ).toFixed(2)
                        : 0
                    }
                  ></BorderLinearProgressBar>
                </CardContent>
                <CardActions style={{ justifyContent: "center" }}>
                  <NavLink
                    to={{ pathname: `/collections/${item.name}` }}
                    state={{ id: item.id, logo: item.logo, name: item.name }}
                    style={{ textDecoration: "none" }}
                  >
                    <Button variant="contained">
                      <FormattedMessage id="app.button.open_collection"></FormattedMessage>
                    </Button>
                  </NavLink>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
}

export default ViewCollection;
