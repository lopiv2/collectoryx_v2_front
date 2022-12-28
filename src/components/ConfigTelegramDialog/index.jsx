import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { FormattedMessage, useIntl } from "react-intl";
import { Grid, Box, TextField, Typography, Tooltip } from "@mui/material";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import ConfigService from "../../app/api/config.api";
import { isUndefined } from "lodash";
import { toast } from "react-toastify";

const ConfigTelegramDialog = (props) => {
  const { userData, open, setOpen, name, connections } = props;
  const [connectionParameters, setConnectionParameters] = useState("");
  const [configurationRight, setConfigurationRight] = useState("");
  const intl = useIntl();

  useEffect(() => {
    if (open === true) {
      ConfigService.checkConnectionTelegram(userData.id).then((response) => {
        setConnectionParameters(response.data);
      });
    } else {
      setConfigurationRight("");
    }
  }, [open]);

  const updateConf = (state) => {
    var index = connections.findIndex((c) => c.name.includes("Telegram"));
    connections[index].configured = state;
    const data = {
      id: connections[index].id,
      name: connections[index].name,
      configured: connections[index].configured,
      user: connections[index].user.id,
    };
    ConfigService.updateConnection(data).then((response) => { });
  };

  const testConnection = (values) => {
    ConfigService.sendMessageTelegram(
      values.botToken,
      values.chatId,
      "HTML",
      "<b>This is a test connection from Collectoryx</b>%0A<i>Done</i>"
    ).then((response) => {
      if (isUndefined(response)) {
        updateConf(false);
        setConfigurationRight(false);
      } else {
        if (response?.status === 200) {
          if (response.data.ok === true) {
            updateConf(true);
            setConfigurationRight(true);
          }
        }
      }
    });
  };

  const submitForm = (values) => {
    const data = {
      id: values.id,
      name: values.name,
      botToken: values.botToken,
      chatId: values.chatId,
    };
    ConfigService.updateConfigTelegram(data).then((response) => {
      if (response.status === 200) {
        setConnectionParameters("");
        setConnectionParameters(data);
        toast.success(
          <FormattedMessage id="app.config.saved"></FormattedMessage>,
          { theme: "colored" }
        );
        setOpen(false);
      }
    });
  };

  return (
    connectionParameters && (
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="confirm-dialog"
        style={{ maxWidth: "100%", maxHeight: "100%" }}
      >
        <DialogTitle id="confirm-dialog">
          <Typography
            component="p"
            variant="h5"
            align="center"
            display="inline"
          >
            <FormattedMessage
              id="app.dialog.edit_item"
              values={{
                item: "",
              }}
            ></FormattedMessage>
          </Typography>
          {"-" + name}
        </DialogTitle>
        <DialogContent>
          <Grid item xs={3}>
            <Formik
              initialValues={{
                id: connectionParameters.id,
                name: connectionParameters.name,
                botToken: connectionParameters.botToken,
                chatId: connectionParameters.chatId,
              }}
              validate={(values) => {
                const errors = {};
              }}
              onSubmit={(values, { setSubmitting }) => {
                submitForm(values);
                setSubmitting(false);
              }}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                setFieldValue,
                isSubmitting,
              }) => (
                <Form onSubmit={handleSubmit} id="form">
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Box pt={2}>
                        <TextField
                          sx={{ minWidth: 400 }}
                          size="small"
                          id="outlined-basic"
                          name="name"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          label={
                            <FormattedMessage id="app.config.appearance_create_theme.name"></FormattedMessage>
                          }
                          variant="outlined"
                          value={values.name}
                        />
                      </Box>
                      <Box pt={2}>
                        <TextField
                          sx={{ minWidth: 400 }}
                          size="small"
                          id="outlined-basic"
                          name="botToken"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          label={
                            <FormattedMessage id="app.config.general_connections_telegram_bot_token"></FormattedMessage>
                          }
                          variant="outlined"
                          value={
                            values.botToken === null ? "" : values.botToken
                          }
                        />
                      </Box>
                      <Box pt={2}>
                        <TextField
                          sx={{ minWidth: 400 }}
                          size="small"
                          type="number"
                          id="outlined-basic"
                          name="chatId"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          label={
                            <FormattedMessage id="app.config.general_connections_telegram_chat_id"></FormattedMessage>
                          }
                          variant="outlined"
                          value={values.chatId === null ? "" : values.chatId}
                        />
                      </Box>
                    </Grid>
                    <Box pt={2} pl={1}>
                      <Button
                        color="success"
                        variant="contained"
                        onClick={() => {
                          testConnection(values);
                        }}
                      >
                        <FormattedMessage id="app.config.general_connections_test_connection"></FormattedMessage>
                      </Button>
                    </Box>
                    {configurationRight === true ? (
                      <Box pl={1}>
                        <Typography
                          align="left"
                          sx={{ color: "green" }}
                          gutterBottom
                        >
                          <FormattedMessage id="app.config.general_connections_test_connection_right"></FormattedMessage>
                        </Typography>
                      </Box>
                    ) : configurationRight === false ? (
                      <Box pl={1}>
                        <Typography
                          align="left"
                          sx={{ color: "red" }}
                          gutterBottom
                        >
                          <FormattedMessage id="app.config.general_connections_test_connection_wrong"></FormattedMessage>
                        </Typography>
                      </Box>
                    ) : null}
                    <DialogActions>
                      <Button
                        variant="contained"
                        onClick={() => {
                          submitForm(values);
                        }}
                      >
                        <FormattedMessage id="app.button.accept"></FormattedMessage>
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => setOpen(false)}
                      >
                        <FormattedMessage id="app.button.cancel"></FormattedMessage>
                      </Button>
                    </DialogActions>
                  </Grid>
                </Form>
              )}
            </Formik>
          </Grid>
        </DialogContent>
      </Dialog>
    )
  );
};
export default ConfigTelegramDialog;
