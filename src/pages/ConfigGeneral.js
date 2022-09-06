import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";
import { Box } from "@mui/material";
import { Grid } from "@mui/material";
import ConfigService from "../app/api/config.api";
import "../styles/Dashboard.css";
import NoImage from "../images/no-photo-available.png";
import { ToastContainer, toast } from "react-toastify";
import Tab from "@mui/material/Tab";
import { TabContext } from "@material-ui/lab";
import { TabList } from "@material-ui/lab";
import { TabPanel } from "@material-ui/lab";
import * as Yup from "yup";
import ThemeTemplate from "../components/ThemeFiller";
import ManageApiTab from "../components/ManageApiTab";
import SelectThemeTab from "../components/SelectThemeTab";

function ConfigInterface() {
  const intl = useIntl();
  const [value, setValue] = useState("1");

  const handleChangeColor = (value, set) => {
    set(value);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const submitForm = (values) => {
    console.log(values);
    toast.success(
      <FormattedMessage id="app.collection.item-created"></FormattedMessage>,
      { theme: "colored" }
    );
  };

  const newItemSchema = Yup.object().shape({
    name: Yup.string()
      .min(
        5,
        intl.formatMessage({
          id: "app.form.too_short",
        })
      )
      .max(
        50,
        intl.formatMessage({
          id: "app.form.too_long",
        })
      )
      .required(
        <FormattedMessage id="app.collection.add_collection_field_required"></FormattedMessage>
      ),
  });

  return (
    <Box>
      <ToastContainer autoClose={2000} />
      <Grid container justifyContent="flex-end">
        <Grid item xs={12}>
          <Typography variant="h4" component="h4">
            <FormattedMessage id="app.config.general_title"></FormattedMessage>
          </Typography>
        </Grid>
      </Grid>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab
              label={intl.formatMessage({
                id: "app.config.general_app_tab",
              })}
              value="1"
            />
            <Tab
              label={intl.formatMessage({
                id: "app.config.general_apis_tab",
              })}
              value="2"
            />
            <Tab
              label={intl.formatMessage({
                id: "app.config.appearance_select_theme_tab",
              })}
              value="3"
            />
            <Tab
              label={intl.formatMessage({
                id: "app.config.appearance_design_tab",
              })}
              value="4"
            />
          </TabList>
        </Box>
        <TabPanel value="1">
        </TabPanel>
        <TabPanel value="2">
          <ManageApiTab />
        </TabPanel>
        <TabPanel value="3">
          <SelectThemeTab />
        </TabPanel>
        <TabPanel value="4">Item Three</TabPanel>
      </TabContext>
    </Box>
  );
}

export default ConfigInterface;
