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
  CardContent
} from "@mui/material";
import { FormattedMessage, FormattedNumber, useIntl } from "react-intl";
import AdminService from "../app/api/admin.api";
import DoneIcon from '@mui/icons-material/Done';
import { CurrencyChecker } from "../utils/generic";
import LicenseService from "../components/LicenseTypes";

function BuyLicense(props) {
  const intl = useIntl();
  const [email, setEmail] = useState("");
  const [licenseSelected, setLicenseSelected] = useState("free");
  const [licenses, setLicenses] = useState([]);
  const currency = CurrencyChecker();

  useEffect(() => {
    setLicenses((licenses) => [...licenses, LicenseService.LicenseTypes.find(
      (f) => f.label === "Free")]);
    setLicenses((licenses) => [...licenses, LicenseService.LicenseTypes.find(
      (f) => f.label === "Monthly")]);
    setLicenses((licenses) => [...licenses, LicenseService.LicenseTypes.find(
      (f) => f.label === "Yearly")]);
    setLicenses((licenses) => [...licenses, LicenseService.LicenseTypes.find(
      (f) => f.label === "Lifetime")]);
  }, [])

  useEffect(() => {
    console.log(licenseSelected)
  }, [licenseSelected])


  const key = () => {
    console.log(email);
    const collectionSeries = AdminService.getKeyFileByEmail(email)
      .then((response) => {
        console.log(response.data)
      });
  };

  return (
    <Box sx={{ display: "flex" }}>
      <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        defaultValue="free"
        name="radio-buttons-group"
        value={licenseSelected}
        onChange={(e) => { setLicenseSelected(e.target.value) }}
      >
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
            >
              <Typography align="center" variant="h6" pt={2}>
                <FormattedMessage id="app.license.free"></FormattedMessage>
              </Typography>
              <CardContent>
                <Typography align="center" variant="h3" color="text.secondary">
                  {licenses.length > 0 && (<FormattedNumber
                    value={licenses[0].price}
                    style="currency"
                    currency={currency.currency}
                  />)
                  }
                </Typography>
                <Grid
                  container
                  spacing={0}
                  ml={6}
                  pt={4}
                >

                  <Grid item xs={3}>
                    <FormControlLabel
                      value="free"
                      control={<Radio />}
                      label={intl.formatMessage({ id: 'app.license.select' })} />
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
            >
              <Typography align="center" variant="h6" pt={2}>
                <FormattedMessage id="app.license.monthly"></FormattedMessage>
              </Typography>
              <CardContent>
                <Typography align="center" variant="h3" color="text.secondary">
                  {licenses.length > 0 && (<FormattedNumber
                    value={licenses[1].price}
                    style="currency"
                    currency={currency.currency}
                  />)
                  }
                </Typography>
                <Typography align="center" variant="body1" color="text.secondary">
                  <FormattedMessage id="app.license.per_month"></FormattedMessage>
                </Typography>
                <Grid
                  container
                  spacing={0}
                  ml={6}
                  pt={1}
                >

                  <Grid item xs={3}>
                    <FormControlLabel
                      value="monthly"
                      control={<Radio />}
                      label={intl.formatMessage({ id: 'app.license.select' })} />
                  </Grid>
                </Grid>
              </CardContent></Card>
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
            >
              <Typography align="center" variant="h6" pt={2}>
                <FormattedMessage id="app.license.yearly"></FormattedMessage>
              </Typography>
              <CardContent>
                <Typography align="center" variant="h3" color="text.secondary">
                  {licenses.length > 0 && (<FormattedNumber
                    value={licenses[2].price}
                    style="currency"
                    currency={currency.currency}
                  />)
                  }
                </Typography>
                <Typography align="center" variant="body1" color="text.secondary">
                  <FormattedMessage id="app.license.per_year"></FormattedMessage>
                </Typography>
                <Grid
                  container
                  spacing={0}
                  ml={6}
                  pt={1}
                >

                  <Grid item xs={3}>
                    <FormControlLabel
                      value="yearly"
                      control={<Radio />}
                      label={intl.formatMessage({ id: 'app.license.select' })} />
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
            >
              <Typography align="center" variant="h6" pt={2}>
                <FormattedMessage id="app.license.lifetime"></FormattedMessage>
              </Typography>
              <CardContent>
                <Typography align="center" variant="h3" color="text.secondary">
                  {licenses.length > 0 && (<FormattedNumber
                    value={licenses[3].price}
                    style="currency"
                    currency={currency.currency}
                  />)
                  }
                </Typography>
                <Typography align="center" variant="body1" color="text.secondary">
                  <FormattedMessage id="app.license.per_life"></FormattedMessage>
                </Typography>
                <Grid
                  container
                  spacing={0}
                  ml={6}
                  pt={1}
                >

                  <Grid item xs={3}>
                    <FormControlLabel
                      value="lifetime"
                      control={<Radio />}
                      label={intl.formatMessage({ id: 'app.license.select' })} />
                  </Grid>
                </Grid>
              </CardContent></Card>
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
      </RadioGroup>
    </Box>
  );
}

export default BuyLicense;
