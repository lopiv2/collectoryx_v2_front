import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import ConfigService from "../../app/api/config.api";
import { FormattedMessage, FormattedNumber } from "react-intl";
import PaidIcon from "@mui/icons-material/Paid";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { CurrencyChecker } from "../../utils/generic";
import { AppContext } from "../AppContext";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function CollectionsSpentCard() {
  const [moneySpent, setMoneySpent] = useState(0);
  const currency = CurrencyChecker();
  const { userData } = React.useContext(AppContext);

  useEffect(() => {
    ConfigService.countCollectionsMoney(userData.id)
      .then((response) => {
        setMoneySpent(response.data)
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <Card sx={{ minWidth: 200 }} style={{ backgroundColor: "#217dbf" }} elevation={6}>
      <CardContent>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 3, sm: 8, md: 12 }}
        >
          <Grid item xs={2}>
            <PaidIcon sx={{ fontSize: 80 }}></PaidIcon>
          </Grid>
          <Grid item xs={10}>
            <Item style={{ backgroundColor: "#3f9de0" }}>
              <Typography
                sx={{ fontSize: 30, fontWeight: 600 }}
                color="text.secondary"
                gutterBottom
              >
                {
                  <FormattedNumber
                    value={moneySpent}
                    style="currency"
                    currency={currency.currency}
                  />
                }
              </Typography>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.primary"
                gutterBottom
              >
                <FormattedMessage id="app.money_spent"></FormattedMessage>
              </Typography>

            </Item>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
