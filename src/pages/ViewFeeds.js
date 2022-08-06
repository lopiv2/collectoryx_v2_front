import React, { useEffect, useState } from "react";
import Parser from "rss-parser";
import htmlParser from "html-react-parser";
import "../styles/Dashboard.css";
import ConfigService from "../app/api/config.api";
import {
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  Card,
  CardHeader,
  CardContent,
  CardMedia,
  Avatar,
} from "@material-ui/core";
import { useLocation } from "react-router-dom";
import { FormattedMessage } from "react-intl";

export default function ViewFeeds(props) {
  const parser = new Parser();
  const [feedUrl, setFeedUrl] = useState();
  const [feedsList, setFeedsList] = useState([]);
  const location = useLocation();

  if (localStorage.getItem("user")) {
    var user = localStorage.getItem("user");
    var userData = JSON.parse(user);
  }

  /*useEffect(() => {
    console.log("Location changed");
  }, [location]);*/

  useEffect(() => {
    const feeds = ConfigService.getUserFeedsIDTitle(
      userData.id,
      location.state
    ).then((response) => {
      const result = response.data;
      var feed = parser.parseString(response.data).then((resp) => {
        setFeedsList(resp.items);
        //console.log(resp.items);
      });
    });
  }, [location]);

  return (
    <Box sx={{ display: "flex" }}>
      <Grid container>
        {/*breadcrumbs.map(({
          match,
          breadcrumb
        }) => (
          <span key={match.pathname}>
             / 
            <NavLink to={match.pathname}>{breadcrumb}</NavLink>
          </span>
        ))*/}
        <Grid item xs={12}>
          <Typography variant="h4" component="h4">
            <FormattedMessage
              id="app.feed.title"
              values={{
                site: location.state ?? location.state,
              }}
            ></FormattedMessage>
          </Typography>
        </Grid>
        <Grid container spacing={10} className="container">
          {feedsList.map((item, index) => (
            <Grid item key={index}>
              <Card
                sx={{ height: 400, minWidth: 250, maxWidth: 250, boxShadow: 5 }}
                ml={200}
              >
                {htmlParser(item.content)}
                <CardMedia height="94">{htmlParser(item.content)}</CardMedia>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: "red" }} aria-label="recipe">
                      R
                    </Avatar>
                  }
                  title={item.title}
                />
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
}
