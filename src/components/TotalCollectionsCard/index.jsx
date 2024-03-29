import { Card, CardContent, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";
import CollectionsBookmarkIcon from "@mui/icons-material/CollectionsBookmark";
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

export default function TotalCollectionsCard() {
  const [collectionTotalCount, setCollectionTotalCount] = useState(0);
  const { userData } = React.useContext(AppContext);

  useEffect(() => {
    ConfigService.countCollections(userData.id)
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
            <CollectionsBookmarkIcon
              sx={{ fontSize: 80 }}
            ></CollectionsBookmarkIcon>
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
                <FormattedMessage id="app.total_collections"></FormattedMessage>
              </Typography>
            </Item>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
