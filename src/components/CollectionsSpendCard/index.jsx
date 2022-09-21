import React, { useState, useEffect, useContext } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import ConfigService from "../../app/api/config.api";
import { FormattedMessage, FormattedNumber } from "react-intl";
import PaidIcon from "@mui/icons-material/Paid";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { CurrencyChecker } from "../../utils/generic";

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

  useEffect(() => {
    if (localStorage.getItem("user")) {
      var user = localStorage.getItem("user");
      var userData = JSON.parse(user);
    }
    let money = 0;
    const collections = ConfigService.countCollectionsMoney(userData.id)
      .then((response) => {
        if (response.data.length > 0) {
          response.data.map((item) => {
            if (item.own) {
              money = money + item.price;
            }
          });
          //console.log(response.data);
        }
        setMoneySpent(money);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <Card sx={{ minWidth: 200 }} style={{ backgroundColor: "#217dbf" }} elevation={6}>
      <CardContent>
        <Grid container rowSpacing={2} columnSpacing={{ xs: 0, sm: 1, md: 1 }}>
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
