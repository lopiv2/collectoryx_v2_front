import React, { useState, useEffect } from "react";
import { Box, Grid, TextField, Button } from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";
import AdminService from "../app/api/admin.api";
import MaterialTable, { Column } from "@material-table/core";

function KeyGeneration(props) {
  const intl = useIntl();
  const [email, setEmail] = useState("");
  const [licensesList, setLicensesList] = useState([]);

  const key = () => {
    console.log(email);
    const licenses = AdminService.getKeyFileByEmail(email).then((response) => {
      console.log(response.data);
    });
  };
  useEffect(() => {
    const licenses = AdminService.getAllLicenses()
      .then((response) => {
        setLicensesList(response.data);
        //console.log(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const columns = [
    {
      title: intl.formatMessage({ id: "app.signup.fields.email" }),
      field: "email",
    },
    {
      title: intl.formatMessage({ id: "app.sidemenu.marketplace.buy_license" }),
      field: "state",
    },
    {
      title: intl.formatMessage({ id: "app.license.paid" }),
      field: "paid",
      type: "boolean",
    },
    { title: intl.formatMessage({ id: "app.license.type" }), field: "type" },
    { title: intl.formatMessage({ id: "app.license.code" }), field: "code" },
    { title: intl.formatMessage({ id: "app.license.MAC" }), field: "mac" },
  ];

  const data = licensesList.map((lic) => {
    let cols = {
      email: lic.email,
      state: lic.state,
      paid: lic.paid,
      type: lic.type,
      code: lic.code,
      mac: lic.mac,
    };
    return cols;
  });

  return (
    <Box sx={{ display: "flex" }}>
      <Grid container>
        <Grid item xs={8}>
          <MaterialTable
            options={{
              sorting: true,
              cellStyle: (e, rowData) => {
                if (rowData.state === "Pending") {
                  return { color: "red" };
                }
              },
            }}
            title="Licencias"
            columns={columns}
            data={data}
          ></MaterialTable>
        </Grid>
        <Grid item xs={8}></Grid>
        <Grid item xs={12}>
          <Button variant="contained" onClick={() => key()}>
            <FormattedMessage id="app.button.accept"></FormattedMessage>
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default KeyGeneration;
