import React, { useState, useEffect, lazy } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { FormattedMessage, useIntl } from "react-intl";
import { Grid, Box, Avatar, TextField, Typography, MenuItem, Tooltip } from "@mui/material";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import ConfigService from "../../app/api/config.api";
import { isUndefined, mapValues } from "lodash";
import { toast } from "react-toastify";
import NoImage from "../../images/no-photo-available.png";

const EditFeedDialog = (props) => {
  const { items, open, setOpen, onConfirm, setItem, collectionList, newItem, setNewItem } =
    props;

  const newSerieSchema = Yup.object().shape({
    name: Yup.string().required(
      <FormattedMessage id="app.collection.add_collection_field_required"></FormattedMessage>
    ),
    rssUrl: Yup.string().required(
      <FormattedMessage id="app.collection.add_collection_field_required"></FormattedMessage>
    )
  });

  const submitForm = (values) => {
    ConfigService.updateFeed(values).then((response) => {
      if (response.status === 200) {
        toast.success(
          <FormattedMessage id="app.feed.edited"></FormattedMessage>,
          { theme: "colored" }
        );
        const data = {
          id: values.id,
          name: values.name,
          rssUrl: values.rssUrl,
          logo: values.logo
        };
        setNewItem(data);
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
                rssUrl: items.rssUrl,
                logo: items.logo ? items.logo : "",
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
                            <FormattedMessage id="app.feed.add_feed_name"></FormattedMessage>
                          }
                          error={touched.name && Boolean(errors.name)}
                          helperText={touched.name && errors.name}
                          variant="outlined"
                          value={values.name}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box pt={2}>
                        <TextField
                          sx={{ minWidth: 400 }}
                          size="small"
                          id="outlined-basic"
                          name="rssUrl"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          label={
                            <FormattedMessage id="app.feed.add_feed_url"></FormattedMessage>
                          }
                          error={touched.rssUrl && Boolean(errors.rssUrl)}
                          helperText={touched.rssUrl && errors.rssUrl}
                          variant="outlined"
                          value={values.rssUrl}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box
                        pt={0}
                        ml={0}
                        mt={2}
                        component="img"
                        sx={{
                          height: "auto",
                          width: "auto",
                          maxHeight: 150,
                          maxWidth: 200,
                        }}
                        alt="Logo"
                        src={values.logo ? values.logo : NoImage}
                      ></Box>
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
export default EditFeedDialog;
