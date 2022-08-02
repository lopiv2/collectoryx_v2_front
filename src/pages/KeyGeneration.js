import React, { useState, useEffect } from "react";
import { Box, Grid, TextField, Button } from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";
import AdminService from "../app/api/admin.api";
import MaterialTable, { Column } from "@material-table/core";
import { Delete } from "@material-ui/icons";
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import VpnKeyOffIcon from '@mui/icons-material/VpnKeyOff';
import { Tooltip } from "@mui/material";
import { format, set } from "date-fns";

function KeyGeneration(props) {
  const intl = useIntl();
  const [licensesList, setLicensesList] = useState([]);

  const key = (email) => {
    const licenses = AdminService.setKeyFileByEmail(email).then((response) => {
      //console.log(response.data);
      var index = licensesList.findIndex(x => x.email === email);
      let newItems = [...licensesList];
      newItems[index].state = response.data.state;
      setLicensesList(newItems);
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
    {
      title: intl.formatMessage({ id: "app.license.granted_date" }),
      field: "granted",
      type: "string",
    },
    {
      title: intl.formatMessage({ id: "app.license.expiring_date" }),
      field: "expiring",
      type: "string",
    },
    {
      title: intl.formatMessage({ id: "app.license.type" }),
      field: "type",
      type: "string",
    },
    {
      title: intl.formatMessage({ id: "app.license.code" }),
      field: "code",
      render: rowData =>
        <Tooltip
          title={rowData.code ? rowData.code : ""}
          placement="bottom"
          arrow>
          <Button variant="contained">{intl.formatMessage({ id: "app.license.show_code" })}
          </Button>
        </Tooltip>
    },
    {
      title: intl.formatMessage({ id: "app.license.MAC" }), field: "mac"
    },
  ];

  const data = licensesList.map((lic) => {
    const expDateFormatted = format(new Date(lic.expiringDate), "dd-MM-yyyy");
    const grantedDateFormatted = format(new Date(lic.grantedDate), "dd-MM-yyyy");
    let cols = {
      email: lic.email,
      state: intl.formatMessage({ id: "app.license." + lic.state }),
      paid: lic.paid,
      granted: grantedDateFormatted,
      expiring: expDateFormatted,
      type: lic.type,
      code: lic.licenseCode,
      mac: lic.machine.macAddress,
    };
    return cols;
  });


  return (
    <Box sx={{ display: "flex" }}>
      <Grid container>
        <Grid item xs={9}>
          <MaterialTable
            options={{
              sorting: true,
              filtering: true,
              exportButton: true,
              actionsColumnIndex: -1,
              cellStyle: (e, rowData) => {
                if (rowData.state.includes("Pend")) {
                  return { color: "red" };
                }
              },
            }}
            title={intl.formatMessage({ id: "app.sidemenu.admin.license_server" })}
            columns={columns}
            data={data}
            actions={
              [
                rowData => ({
                  icon: Delete,
                  tooltip: 'Delete User',
                  onClick: (event, rowData) => console.log("You want to delete " + rowData.email),
                  disabled: rowData.birthYear < 2000
                }),
                rowData => ({
                  icon: rowData.state.includes("Pend") ? VpnKeyIcon : VpnKeyOffIcon,
                  tooltip: intl.formatMessage({ id: "app.tooltip.generate_license" }),
                  onClick: (event, rowData) => key(rowData.email),
                  disabled: rowData.birthYear < 2000
                })
              ]}
          ></MaterialTable>
        </Grid>
        <Grid item xs={8}></Grid>
        <Grid item xs={12}>
          <Button variant="contained" onClick={() => key()}>
            <FormattedMessage id="app.button.accept"></FormattedMessage>
          </Button>
        </Grid>
      </Grid >
    </Box >
  );
}

export default KeyGeneration;
