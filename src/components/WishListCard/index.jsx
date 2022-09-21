import React, { useState, useEffect, useContext } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import ConfigService from "../../app/api/config.api";
import { FormattedMessage } from "react-intl";
import StarIcon from '@mui/icons-material/Star';
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { AppContext } from "../../components/AppContext";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function WishlistCard() {
  const [wishElements, setWishElements] = useState(0);
  const { userData, setUserData } = React.useContext(AppContext);

  useEffect(() => {
    const collections = ConfigService.countCollectionsWishlist(userData.id)
      .then((response) => {
        setWishElements(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <Card sx={{ minWidth: 200 }} elevation={6}>
      <CardContent>
        <Grid container rowSpacing={2} columnSpacing={{ xs: 0, sm: 1, md: 1 }}>
          <Grid item xs={2}>
            <StarIcon sx={{ fontSize: 80 }}></StarIcon>
          </Grid>
          <Grid item xs={10}>
            <Item>
              <Typography
                sx={{ fontSize: 30, fontWeight: 600 }}
                color="text.secondary"
                gutterBottom
              >
                {wishElements}
              </Typography>
              <Typography
                sx={{ fontSize: 13 }}
                color="text.primary"
                gutterBottom
              >
                <FormattedMessage id="app.wishlist_size"></FormattedMessage>
              </Typography>
            </Item>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
