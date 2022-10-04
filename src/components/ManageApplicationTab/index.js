import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { Box } from "@mui/material";
import { Grid } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";

function ManageApplicationTab(props) {

  return (
    <Box sx={{ display: "flex" }}>
      <ToastContainer autoClose={2000} />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4" component="h4">
            <FormattedMessage id="app.signin_construction"></FormattedMessage>
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ManageApplicationTab;
