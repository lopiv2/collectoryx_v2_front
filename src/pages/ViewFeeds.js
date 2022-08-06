import React, { useState } from "react";
import Parser from "rss-parser";
import ConfigService from "../app/api/config.api";
import { TextField, Button, Grid } from "@material-ui/core";
import { useLocation } from "react-router-dom";
import { Avatar } from "@material-ui/core";

export default function ViewFeeds(props) {
  const parser = new Parser();
  const [feedUrl, setFeedUrl] = useState();
  let location = useLocation();

  if (localStorage.getItem("user")) {
    var user = localStorage.getItem("user");
    var userData = JSON.parse(user);
  }

  

  const handleSubmit = async () => {
    const collectionSeries = ConfigService.getUserFeedsIDTitle(
      userData.id,
      location.state
    ).then((response) => {
      const result = response.data;
      var feed = parser.parseString(response.data).then((resp) => {
        console.log(resp);
      });
    });
  };

  return (
    <Grid container>
      <TextField onChange={(v) => setFeedUrl(v.target.value)}></TextField>
      <Button variant="contained" onClick={() => handleSubmit()}>
        {" "}
        Prueba
      </Button>
    </Grid>
  );
}
