import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { FormattedMessage } from "react-intl";
import { Grid, Box, TextField, Typography } from "@mui/material";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import ConfigService from "../../app/api/config.api";
import { isUndefined } from "lodash";
import { toast } from "react-toastify";

const EditApiDialog = (props) => {
  const { items, open, setOpen, setNewItem } =
    props;
  const [images, setImages] = useState([]);
  //const intl = useIntl();

  /*const avatarStyleClicked = {
    border: "2px solid green",
    width: 80,
    height: 80,
  };*/

  /*const avatarStyleHover = {
    cursor: "pointer",
    width: 80,
    height: 80,
  };*/

  const newSerieSchema = Yup.object().shape({
    name: Yup.string().required(
      <FormattedMessage id="app.collection.add_collection_field_required"></FormattedMessage>
    ),
  });

  const submitForm = (values) => {
    ConfigService.updateApi(values).then((response) => {
      if (response.status === 200) {
        toast.success(
          <FormattedMessage id="app.config.general.api-edited"></FormattedMessage>,
          { theme: "colored" }
        );
        setNewItem(values);
        setOpen(false);
      }
    });
  };

  return (
    !isUndefined(items) && (
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="confirm-dialog"
        style={{ maxWidth: "100%", maxHeight: "100%" }}
      >
        <DialogTitle id="confirm-dialog">
          <Typography component="p" variant="h5" align="center">
            <FormattedMessage
              id="app.dialog.edit_item"
              values={{
                item: items.name,
              }}
            ></FormattedMessage>
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid item xs={3}>
            <Formik
              initialValues={{
                id: items.id,
                name: items.name,
                keyCode: items.keyCode,
                header: items.header,
                apiLink: items.apiLink,
                logo: items.logo,
              }}
              validate={(values) => {
                const errors = {};
              }}
              validationSchema={newSerieSchema}
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
                            <FormattedMessage id="app.config.general_apis_tab_list_name"></FormattedMessage>
                          }
                          error={touched.name && Boolean(errors.name)}
                          helperText={touched.name && errors.name}
                          variant="outlined"
                          value={values.name}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={9}>
                      <TextField
                        id="demo-simple-select"
                        name="keyCode"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        size="small"
                        sx={{ minWidth: 400 }}
                        value={values.keyCode}
                        label={
                          <FormattedMessage id="app.config.general_apis_tab_list_key"></FormattedMessage>
                        }
                      ></TextField>
                    </Grid>
                    <Grid item xs={9}>
                      <TextField
                        id="demo-simple-select"
                        name="apiLink"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        size="small"
                        sx={{ minWidth: 400 }}
                        value={values.apiLink}
                        label={
                          <FormattedMessage id="app.config.general_apis_tab_list_url"></FormattedMessage>
                        }
                      ></TextField>
                    </Grid>
                    <Grid item xs={9}>
                      <TextField
                        id="demo-simple-select"
                        name="logo"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        size="small"
                        sx={{ minWidth: 400 }}
                        value={values.logo}
                        label={
                          <FormattedMessage id="app.config.general_apis_tab_list_logo"></FormattedMessage>
                        }
                      ></TextField>
                    </Grid>
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
export default EditApiDialog;
