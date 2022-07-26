import React, { useState, useEffect } from "react";
import { Box, Grid, TextField, Button } from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";
import AdminService from "../app/api/admin.api";
import MUIDataTable from "mui-datatables";

function KeyGeneration(props) {
  const intl = useIntl();
  const [email, setEmail] = useState("");
  const [licensesList, setLicensesList] = useState([]);

  const key = () => {
    console.log(email);
    const collectionSeries = AdminService.getKeyFileByEmail(email)
      .then((response) => {
        console.log(response.data)
      });
  };
  useEffect(() => {
    const licenses = AdminService.getAllPendingLicenses()
      .then((response) => {
        setLicensesList(response.data);
        //console.log(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const options = {
    filterType: "checkbox",
  };

  const columns = [
    intl.formatMessage({ id: "app.collection.add_collection_serie" }),
    intl.formatMessage({ id: "app.collection.add_collection_logo" }),
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <Grid container>
        <Grid item xs={6}>
          <MUIDataTable
            title={
              <FormattedMessage id="app.collection.view_collections_series"></FormattedMessage>
            }
            data={
              licensesList.length > 0
                ? licensesList.map((item) => {
                  return [
                    item.email,
                  ];
                })
                : []
            }
            columns={columns}
            options={options}
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
