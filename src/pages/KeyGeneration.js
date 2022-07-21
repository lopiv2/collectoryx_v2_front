import React, { useState, useEffect } from "react";
import { Box, Grid, TextField, Button } from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";
import AdminService from "../app/api/admin.api";

function KeyGeneration(props) {
  const intl = useIntl();
  const [email, setEmail] = useState("");

  const key = () => {
    console.log(email);
    const collectionSeries = AdminService.getKeyFileByEmail(email)
      .then((response) => {
        console.log(response.data)
      });
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Grid container>
        <Grid item xs={6}>
          <TextField
            sx={{ minWidth: 300 }}
            size="small"
            id="name"
            name="name"
            variant="outlined"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </Grid>
        <Grid item xs={6}>
          <Button variant="contained" onClick={() => key()}>
            <FormattedMessage id="app.button.accept"></FormattedMessage>
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default KeyGeneration;
