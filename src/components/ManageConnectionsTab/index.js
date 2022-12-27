import React, { useState, useEffect } from "react";
import { CardContent, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { Box } from "@mui/material";
import { Grid } from "@mui/material";
import { Button } from "@mui/material";
import ConfigService from "../../app/api/config.api";
import { ToastContainer, toast } from "react-toastify";
import { TextField, Card } from "@mui/material";
import { useIntl } from "react-intl";
import { AppContext } from "../AppContext";
import { isUndefined } from "lodash";
import ConfigTelegramDialog from "../ConfigTelegramDialog";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";

function ManageConnectionsTab(props) {
  const [connections, setConnections] = useState([]);
  const [openTelegram, setOpenTelegram] = useState(false);
  const intl = useIntl();
  const { userData, setUserData } = React.useContext(AppContext);

  useEffect(() => {
    ConfigService.checkConnectionConfiguration(userData.id).then((response) => {
      setConnections(response.data);
    });
  }, []);

  const handleOpenTelegram = () => {
    setOpenTelegram(true);
  };

  const cardStyleHover = {
    cursor: "pointer",
    height: 100,
    minWidth: 250,
    maxWidth: 250,
    boxShadow: 15,
  };

  return (
    <Box sx={{ display: "flex" }}>
      <ToastContainer autoClose={2000} />
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 3, sm: 8, md: 12 }}
        pt={2}
      >
        {connections?.map((con, index) => {
          return (
            <Grid item key={index}>
              <Card
                //Height auto while dynamic size of font cant be achieved in MUI
                sx={cardStyleHover}
                ml={200}
                onClick={() => {
                  handleOpenTelegram();
                }}
              >
                <CardContent>
                  <Typography
                    align="left"
                    sx={{ fontSize: 25 }}
                    color="text.primary"
                    gutterBottom
                  >
                    {con.name}
                  </Typography>
                  {con.configured === true ? (
                    <Grid container direction="row" alignItems="center">
                      <Grid item>
                        <DoneIcon sx={{ color: "green" }}></DoneIcon>
                      </Grid>
                      <Grid item>
                        <Typography variant="body2">
                          <FormattedMessage id="app.config.general_connections_configured"></FormattedMessage>
                        </Typography>
                      </Grid>
                    </Grid>
                  ) : (
                    <Grid container direction="row" alignItems="center">
                      <Grid item>
                        <CloseIcon sx={{ color: "red" }}></CloseIcon>
                      </Grid>
                      <Grid item>
                        <Typography variant="body2">
                          <FormattedMessage id="app.config.general_connections_not_configured"></FormattedMessage>
                        </Typography>
                      </Grid>
                    </Grid>
                  )}
                </CardContent>
              </Card>
              <ConfigTelegramDialog
                userData={userData}
                open={openTelegram}
                name="Telegram"
                setOpen={setOpenTelegram}
                connections={connections}
              ></ConfigTelegramDialog>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

export default ManageConnectionsTab;
