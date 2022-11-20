import { Card, CardContent, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import ConfigService from "../../app/api/config.api";
import React, { useState, useEffect } from "react";
import { AppContext } from "../AppContext";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function CompletedCollectionsCard() {
  const [collectionTotalCount, setCollectionTotalCount] = useState(0);
  const { userData, setUserData } = React.useContext(AppContext);

  useEffect(() => {
    const query = {
      id: userData.id,
      orderField: "id",
      orderDirection: "up",
    };
    ConfigService.countCompletedCollections(query)
      .then((response) => {
        setCollectionTotalCount(response);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <Card sx={{ minWidth: 200 }} elevation={6}>
      <CardContent>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 3, sm: 8, md: 12 }}
        >
          <Grid item xs={2}>
            <EmojiEventsIcon sx={{ fontSize: 80 }}></EmojiEventsIcon>
          </Grid>
          <Grid item xs={10}>
            <Item>
              <Typography
                sx={{ fontSize: 30, fontWeight: 600 }}
                color="text.secondary"
                gutterBottom
              >
                {collectionTotalCount}
              </Typography>
              <Typography
                sx={{ fontSize: 13 }}
                color="text.primary"
                gutterBottom
              >
                <FormattedMessage id="app.completed_collections"></FormattedMessage>
              </Typography>
            </Item>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
