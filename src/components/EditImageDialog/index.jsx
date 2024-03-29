import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
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
import NoImage from "../../images/no-photo-available.png";
import ImageGalleryDialog from "../ImageGalleryDialog";

const EditImageDialog = (props) => {
  const { items, open, setOpen, setNewItem } = props;
  const intl = useIntl();
  const [preview, setPreview] = useState();
  const [images, setImages] = useState([]);
  const [img, setImg] = useState();
  const [updatedValues, setUpdatedValues] = useState([]);
  const [confirmOpenGallery, setConfirmOpenGallery] = useState(false);
  const [imgGallerySelected, setImgGallerySelected] = useState(false);

  const fetchImage = async (image) => {
    try {
      setPreview("/images/uploads/" + image)
    } catch (err) {
      console.log(err)
    } finally {

    }
  }

  useEffect(() => {
    if (!isUndefined(items)) {
      if(items!==null){
        fetchImage(items.path)
      }
      return NoImage;
    };
  }, [items])

  const newSerieSchema = Yup.object().shape({
    name: Yup.string().required(
      <FormattedMessage id="app.collection.add_collection_field_required"></FormattedMessage>
    ),
  });

  const submitForm = (values) => {
    ConfigService.updateImage(values, img).then((response) => {
      if (response.status === 200) {
        toast.success(
          <FormattedMessage id="app.collection.image_edited"></FormattedMessage>,
          { theme: "colored" }
        );
        /*const data = {
          id: values.id,
          name: values.name,         
        };*/
        setNewItem(response.data);
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
                logo: items.logo,
                path: items.path,
              }}
              validate={(values) => {
                const errors = {};
              }}
              validationSchema={newSerieSchema}
              onSubmit={(values, { setSubmitting }) => {
                values.logo = preview
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
                            <FormattedMessage id="app.collection.image_name"></FormattedMessage>
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
                        src={preview ? preview : NoImage}
                      ></Box>
                    </Grid>
                    <DialogActions>
                      <Button
                        variant="contained"
                        onClick={() => {
                          setUpdatedValues(values);
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
export default EditImageDialog;
