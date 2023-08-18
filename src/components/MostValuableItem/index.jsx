import { Card, CardContent, Typography, Avatar } from "@mui/material";
import { FormattedMessage } from "react-intl";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import ConfigService from "../../app/api/config.api";
import React, { useState, useEffect } from "react";
import { AppContext } from "../AppContext";
import { GetCurrencySymbolLocale } from "../../utils/generic";
import NoImage from "../../images/no-photo-available.png";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function MostValuableItem() {
  const [itemMax, setItemMax] = useState(null);
  const { userData, setUserData } = React.useContext(AppContext);
  const currency = GetCurrencySymbolLocale();

  useEffect(() => {
    ConfigService.getMostValuableItem(userData.id)
      .then((response) => {
        setItemMax(response.data);
      })
      .catch((err) => {
        const nullItem = {
          name: (
            <FormattedMessage id="app.most_valuable_item_collection_none"></FormattedMessage>
          ),
          price: 0,
          image: null,
          collection: {
            name: (
              <FormattedMessage id="app.most_valuable_item_collection_none"></FormattedMessage>
            ),
          },
        };
        setItemMax(nullItem);
      });
  }, []);

  const checkImage = (item) => {
    if (item.image !== null) {
      if (!item.image.path.includes("http")) {
        return "/images/uploads/" + item.image.path;
      } else {
        return item.image.path;
      }
    } else {
      return NoImage;
    }
  };

  return (
    itemMax && (
      <Card sx={{ minWidth: 200 }} elevation={6}>
        <CardContent>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 3, sm: 8, md: 12 }}
          >
            <Grid item xs={2}>
              <Avatar
                imgProps={{ referrerPolicy: "no-referrer" }}
                variant="rounded"
                src={checkImage(itemMax)} // use normal <img> attributes as props
                width="100%"
                sx={{ width: 90, height: 90 }}
              />
            </Grid>
            <Grid item xs={10}>
              <Box display="flex" justifyContent="center">
                <Grid item>
                  <Typography
                    sx={{ fontSize: 16 }}
                    color="text.secondary"
                    gutterBottom
                    style={{ fontWeight: 600 }}
                  >
                    <FormattedMessage id="app.most_valuable_item"></FormattedMessage>
                  </Typography>
                  <Typography
                    sx={{ fontSize: 18 }}
                    color="text.primary"
                    gutterBottom
                    style={{ fontWeight: 600 }}
                  >
                    {itemMax.name}
                  </Typography>
                  <Typography
                    sx={{ fontSize: 18 }}
                    color="text.secondary"
                    gutterBottom
                  >
                    {itemMax.price}
                    {" " + currency + " - "}
                    <FormattedMessage
                      id="app.most_valuable_item_collection"
                      values={{
                        col: itemMax.collection.name,
                      }}
                    ></FormattedMessage>
                  </Typography>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    )
  );
}
