import React, { useState } from "react";
import { Typography } from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";
import { Box } from "@mui/material";
import { Grid } from "@mui/material";
import "../styles/Dashboard.css";
import { ToastContainer, toast } from "react-toastify";
import Tab from "@mui/material/Tab";
import { TabContext } from "@material-ui/lab";
import { TabList } from "@material-ui/lab";
import { TabPanel } from "@material-ui/lab";
import * as Yup from "yup";
import CreateThemeTab from "../components/CreateThemeTab";
import SelectThemeTab from "../components/SelectThemeTab";
import DashboardDesignTab from "../components/DashboardDesignTab";

function ConfigInterface() {
  const intl = useIntl();
  const [value, setValue] = useState("1");

  /*const handleChangeColor = (value, set) => {
    set(value);
  };*/

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
      <Grid item xs={12}>
        <Typography variant="h4" component="h4">
          <FormattedMessage id="app.config.appearance_title"></FormattedMessage>
        </Typography>
      </Grid>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab
              label={intl.formatMessage({
                id: "app.config.appearance_create_theme_tab",
              })}
              value="1"
            />
            <Tab
              label={intl.formatMessage({
                id: "app.config.appearance_select_theme_tab",
              })}
              value="2"
            />
            <Tab
              label={intl.formatMessage({
                id: "app.config.appearance_design_tab",
              })}
              value="3"
            />
          </TabList>
        </Box>
        <TabPanel value="1">
          <CreateThemeTab />
        </TabPanel>
        <TabPanel value="2">
          <SelectThemeTab />
        </TabPanel>
        <TabPanel value="3">
          <DashboardDesignTab />
        </TabPanel>
      </TabContext>
    </Box>
  );
}

export default ConfigInterface;
