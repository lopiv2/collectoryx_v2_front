import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { FormattedMessage } from "react-intl";
import { Grid, Box, TextField, Typography } from "@mui/material";
import { Formik, Form } from "formik";
import NoImage from "../../images/no-photo-available.png";
import * as Yup from "yup";

const URLImageDialog = (props) => {
  const { open, setOpen, url, setUrl, setUrlImageChosen } = props;

  const submitForm = (values) => {
    setUrl(values.name);
    setUrlImageChosen(true);
    setOpen(false);
  };

  const newURLSchema = Yup.object().shape({
    name: Yup.string().url(
      <FormattedMessage id="app.collection.add_collection_image_url_warning"></FormattedMessage>
    ),
  });

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="confirm-dialog"
      style={{ maxWidth: "100%", maxHeight: "100%" }}
    >
      <DialogTitle id="confirm-dialog">
        <Typography component="p" variant="h5" align="center">
          <FormattedMessage id="app.collection.add_collection_image_url"></FormattedMessage>
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Grid item xs={3}>
          <Formik
            validateOnBlur={true}
            validateOnChange={true}
            initialValues={{
              name: url ? (url.includes("http") ? url : "") : "",
            }}
            validate={(values) => {
              const errors = {};
            }}
            validationSchema={newURLSchema}
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
                          <FormattedMessage id="app.collection.add_collection_image_url"></FormattedMessage>
                        }
                        error={touched.name && Boolean(errors.name)}
                        helperText={touched.name && errors.name}
                        variant="outlined"
                        value={values.name}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
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
                      src={values.name ? values.name : NoImage}
                    ></Box>
                  </Grid>
                  <DialogActions>
                    <Button
                      variant="contained"
                      disabled={
                        Array.isArray(errors) ||
                        Object.values(errors).toString() !== ""
                      }
                      onClick={() => {
                        submitForm(values);
                      }}
                    >
                      <FormattedMessage id="app.button.accept"></FormattedMessage>
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => {
                        setOpen(false);
                      }}
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
  );
};
export default URLImageDialog;
