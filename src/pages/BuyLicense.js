import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  Card,
  RadioGroup,
  Radio,
  FormControlLabel,
  Typography,
  CardContent,
} from "@mui/material";
import { FormattedMessage, FormattedNumber, useIntl } from "react-intl";
import ShopService from "../app/api/shop.api";
import DoneIcon from "@mui/icons-material/Done";
import { CurrencyChecker } from "../utils/generic";
import LicenseService from "../components/LicenseTypes";

function BuyLicense(props) {
  const intl = useIntl();
  const user = localStorage.getItem("user");
  const [userStorage, setUserStorage] = useState(user);
  var userData = JSON.parse(user);
  const [email, setEmail] = useState("");
  const [licenseSelected, setLicenseSelected] = useState(userData.license);
  const [licenses, setLicenses] = useState([]);
  const currency = CurrencyChecker();

  useEffect(() => {
    userData = JSON.parse(user);
    //console.log(user)
  }, [userStorage]);

  useEffect(() => {
    setLicenses((licenses) => [
      ...licenses,
      LicenseService.LicenseTypes.find((f) => f.label === "Trial"),
    ]);
    setLicenses((licenses) => [
      ...licenses,
      LicenseService.LicenseTypes.find((f) => f.label === "Monthly"),
    ]);
    setLicenses((licenses) => [
      ...licenses,
      LicenseService.LicenseTypes.find((f) => f.label === "Yearly"),
    ]);
    setLicenses((licenses) => [
      ...licenses,
      LicenseService.LicenseTypes.find((f) => f.label === "Lifetime"),
    ]);
  }, []);

  const key = () => {
    const collectionSeries = ShopService.getKeyFileByEmail(
      userData.email,
      licenseSelected
    ).then((response) => {
      //console.log(response.data);
    });

    //Actualiza el user del localstorage con la nueva licencia
    userData.license = licenseSelected;
    const modif = JSON.stringify(userData);
    localStorage.setItem("user", modif);
    setUserStorage(localStorage.getItem("user"));
  };

  return (
    <Box sx={{ display: "flex" }}>
      <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        defaultValue={userData.license}
        name="radio-buttons-group"
        value={licenseSelected}
        onChange={(e) => {
          setLicenseSelected(e.target.value);
        }}
      >
        {licenses.length > 0 && (
          <Grid container spacing={3}>
            <Grid item>
              <Card
                sx={{
                  height: 450,
                  minWidth: 250,
                  maxWidth: 250,
                  boxShadow: 5,
                }}
                ml={200}
                style={
                  userData.license === licenses[0].value
                    ? { backgroundColor: "#b2f7ec" }
                    : null
                }
                name={licenses[0].value}
              >
                <Typography align="center" variant="h6" pt={2}>
                  <FormattedMessage id="app.license.trial"></FormattedMessage>
                </Typography>
                <CardContent>
                  <Typography
                    align="center"
                    variant="h3"
                    color="text.secondary"
                  >
                    {licenses.length > 0 && (
                      <FormattedNumber
                        value={licenses[0].price}
                        style="currency"
                        currency={currency.currency}
                      />
                    )}
                  </Typography>
                  <Typography
                    align="center"
                    variant="body1"
                    color="text.secondary"
                  >
                    <FormattedMessage id="app.license.15_days"></FormattedMessage>
                  </Typography>
                  <Grid container spacing={0} ml={6} pt={1}>
                    <Grid item xs={3}>
                      <FormControlLabel
                        value={licenses[0].value}
                        control={<Radio />}
                        label={intl.formatMessage({ id: "app.license.select" })}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid item>
              <Card
                sx={{
                  height: 450,
                  minWidth: 250,
                  maxWidth: 250,
                  boxShadow: 5,
                }}
                ml={200}
                style={
                  userData.license === licenses[1].value
                    ? { backgroundColor: "#b2f7ec" }
                    : null
                }
              >
                <Typography align="center" variant="h6" pt={2}>
                  <FormattedMessage id="app.license.monthly"></FormattedMessage>
                </Typography>
                <CardContent>
                  <Typography
                    align="center"
                    variant="h3"
                    color="text.secondary"
                  >
                    {licenses.length > 0 && (
                      <FormattedNumber
                        value={licenses[1].price}
                        style="currency"
                        currency={currency.currency}
                      />
                    )}
                  </Typography>
                  <Typography
                    align="center"
                    variant="body1"
                    color="text.secondary"
                  >
                    <FormattedMessage id="app.license.per_month"></FormattedMessage>
                  </Typography>
                  <Grid container spacing={0} ml={6} pt={1}>
                    <Grid item xs={3}>
                      <FormControlLabel
                        value={licenses[1].value}
                        control={<Radio />}
                        label={intl.formatMessage({ id: "app.license.select" })}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid item>
              <Card
                sx={{
                  height: 450,
                  minWidth: 250,
                  maxWidth: 250,
                  boxShadow: 5,
                }}
                ml={200}
                style={
                  userData.license === licenses[2].value
                    ? { backgroundColor: "#b2f7ec" }
                    : null
                }
              >
                <Typography align="center" variant="h6" pt={2}>
                  <FormattedMessage id="app.license.yearly"></FormattedMessage>
                </Typography>
                <CardContent>
                  <Typography
                    align="center"
                    variant="h3"
                    color="text.secondary"
                  >
                    {licenses.length > 0 && (
                      <FormattedNumber
                        value={licenses[2].price}
                        style="currency"
                        currency={currency.currency}
                      />
                    )}
                  </Typography>
                  <Typography
                    align="center"
                    variant="body1"
                    color="text.secondary"
                  >
                    <FormattedMessage id="app.license.per_year"></FormattedMessage>
                  </Typography>
                  <Grid container spacing={0} ml={6} pt={1}>
                    <Grid item xs={3}>
                      <FormControlLabel
                        value={licenses[2].value}
                        control={<Radio />}
                        label={intl.formatMessage({ id: "app.license.select" })}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid item>
              <Card
                sx={{
                  height: 450,
                  minWidth: 250,
                  maxWidth: 250,
                  boxShadow: 5,
                }}
                ml={200}
                style={
                  userData.license === licenses[3].value
                    ? { backgroundColor: "#b2f7ec" }
                    : null
                }
              >
                <Typography align="center" variant="h6" pt={2}>
                  <FormattedMessage id="app.license.lifetime"></FormattedMessage>
                </Typography>
                <CardContent>
                  <Typography
                    align="center"
                    variant="h3"
                    color="text.secondary"
                  >
                    {licenses.length > 0 && (
                      <FormattedNumber
                        value={licenses[3].price}
                        style="currency"
                        currency={currency.currency}
                      />
                    )}
                  </Typography>
                  <Typography
                    align="center"
                    variant="body1"
                    color="text.secondary"
                  >
                    <FormattedMessage id="app.license.per_life"></FormattedMessage>
                  </Typography>
                  <Grid container spacing={0} ml={6} pt={1}>
                    <Grid item xs={3}>
                      <FormControlLabel
                        value={licenses[3].value}
                        control={<Radio />}
                        label={intl.formatMessage({ id: "app.license.select" })}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} pt={4} ml={1}>
              <Typography variant="h6">
                <FormattedMessage id="app.license.state"></FormattedMessage>
              </Typography>
            </Grid>
            <Grid item xs={4} pt={4}>
              <TextField
                sx={{ minWidth: 300 }}
                size="small"
                id="name"
                name="name"
                variant="outlined"
                placeholder="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </Grid>
            <Grid item pt={4} ml={1}>
              <Button variant="contained" onClick={() => key()}>
                <FormattedMessage id="app.button.accept"></FormattedMessage>
              </Button>
            </Grid>
          </Grid>
        )}
      </RadioGroup>
    </Box>
  );
}

export default BuyLicense;
