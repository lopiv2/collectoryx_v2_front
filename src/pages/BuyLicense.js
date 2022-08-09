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
import CloseIcon from '@mui/icons-material/Close';
import { CurrencyChecker } from "../utils/generic";
import LicenseService from "../components/LicenseTypes";
import FeaturesService from "../components/SaasFeatures";
import FeaturesDialog from "../components/FeaturesDialog";
import { Link } from "@mui/material";

function BuyLicense(props) {
  const intl = useIntl();
  const user = localStorage.getItem("user");
  const [userStorage, setUserStorage] = useState(user);
  const userData = JSON.parse(user);
  const [email, setEmail] = useState("");
  const [licenseSelected, setLicenseSelected] = useState(userData.license);
  const [licenses, setLicenses] = useState([]);
  const currency = CurrencyChecker();
  const [confirmOpenFeatures, setConfirmOpenFeatures] = useState(false);

  useEffect(() => {
    setLicenses((licenses) => [
      ...licenses,
      LicenseService.LicenseTypes.find((f) => f.label === "Free"),
    ]);
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
    console.log(licenseSelected)
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
    <Box>
      <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        defaultValue={userData.license}
        name="radio-buttons-group"
        value={licenseSelected}
        onChange={(e) => {
          setLicenseSelected(e.target.value);
        }}
      >
        <Grid container spacing={3}>
          {licenses.length > 0 && licenses.map((lic, index) => (
            (lic.value === "Trial" && userData.trialActivated == true) || (<Grid item key={index}>
              <Card
                sx={{
                  height: "auto",
                  minWidth: 250,
                  maxWidth: 250,
                  boxShadow: 5,
                }}
                ml={200}
                style={
                  userData.license === lic.value
                    ? { backgroundColor: "#b2f7ec" }
                    : null
                }
              >
                <Typography align="center" variant="h6" pt={2}>
                  {intl.formatMessage({ id: "app.license." + lic.value.toLowerCase() })}
                </Typography>
                <CardContent>
                  <Typography
                    align="center"
                    variant="h3"
                    color="text.secondary"
                  >
                    {licenses.length > 0 && (
                      <FormattedNumber
                        value={lic.price}
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
                    {intl.formatMessage({ id: "app.license." + lic.value.toLowerCase() + "_time" })}
                  </Typography>
                  <Grid container spacing={0} ml={6} pt={1}>
                    <Grid item xs={3}>
                      <FormControlLabel
                        value={lic.value}
                        control={<Radio />}
                        label={intl.formatMessage({ id: "app.license.select" })}
                      />
                    </Grid>
                  </Grid>
                  {FeaturesService.Features.map((item, index) => (
                    lic.value === "Free" && item.license === "Free" && item.type==="min" ? (
                      <Grid key={index} container spacing={0} ml={1} pt={1}>
                        <Grid item xs={1}>
                          {item.icon === "done" ? (<DoneIcon color="success" />) : (<CloseIcon sx={{ color: "red" }} />)}
                        </Grid>
                        <Grid item xs={9} ml={1}>
                          <Typography
                            align="center"
                            variant="caption"
                          >
                            <FormattedMessage id={item.id}></FormattedMessage>
                          </Typography>
                        </Grid>
                      </Grid>)
                      : lic.value !== "Free" && item.license === "Premium" && item.type==="min" && (
                        <Grid key={index} container spacing={0} ml={1} pt={1}>
                          <Grid item xs={1}>
                            {item.icon === "done" ? (<DoneIcon color="success" />) : (<CloseIcon sx={{ color: "red" }} />)}
                          </Grid>
                          <Grid item xs={9} ml={1}>
                            <Typography
                              align="center"
                              variant="caption"
                            >
                              <FormattedMessage id={item.id}></FormattedMessage>
                            </Typography>
                          </Grid>
                        </Grid>
                      )))}
                  <Grid container spacing={0} pt={1}>
                    <Grid item ml={1}>
                      <Typography
                        align="center"
                        variant="caption"
                      >
                        <Link
                          component="button"
                          onClick={() => {
                            setConfirmOpenFeatures(true);
                          }}
                        >
                          <FormattedMessage id="app.license.features_all"></FormattedMessage>
                        </Link>
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            )))}
        </Grid>
        <Grid item xs={11} pt={4} ml={1}>
          <Typography display="inline" variant="h6">
            {intl.formatMessage({ id: "app.license.type_text" })}
          </Typography>
          <Typography display="inline" variant="h6">
            {intl.formatMessage({ id: "app.license." + userData.license.toLowerCase() })}
          </Typography>
        </Grid>
        <Grid item xs={11} pt={4} ml={1}>
          <Typography display="inline" variant="h6">
            {intl.formatMessage({ id: "app.license.state" })}
          </Typography>
          <Typography display="inline" variant="h6" style={{
            color: userData.licenseState.includes("Pend")
              ? "orange"
              : userData.licenseState.includes("Act")
                ? "green"
                : "red"
          }}>
            {intl.formatMessage({ id: "app.license." + userData.licenseState.toLowerCase() })}
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
        <FeaturesDialog
          title={intl.formatMessage({
            id: "app.license.features",
          })}
          rows={FeaturesService.FeaturesFull}
          open={confirmOpenFeatures}
          setOpen={setConfirmOpenFeatures}
        >
          <FormattedMessage id="app.dialog.confirm_delete"></FormattedMessage>
        </FeaturesDialog>
      </RadioGroup>
    </Box >
  );
}

export default BuyLicense;
