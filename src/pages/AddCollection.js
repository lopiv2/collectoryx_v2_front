import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Typography } from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";
import { TextField } from "@mui/material";
import { Box } from "@mui/material";
import { MenuItem } from "@mui/material";
import { Grid } from "@mui/material";
import { Button } from "@mui/material";
import ConfigService from "../app/api/config.api";
import "../styles/Dashboard.css";
import NoImage from "../images/no-photo-available.png";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import OptionsService from "../components/DropDownOptions";
import TagsInput from "../components/TagsInput";
import AddIcon from "@mui/icons-material/Add";
import TableCustomFields from "../components/TableCustomFields";
import * as Yup from "yup";
import GoogleIcon from "@mui/icons-material/Google";
import { Tooltip } from "@mui/material";
import ImageGalleryDialog from "../components/ImageGalleryDialog";

function AddCollection() {
  const [template, setTemplate] = useState("");
  const [selectedFile, setSelectedFile] = useState("");
  const [preview, setPreview] = useState();
  const navigate = useNavigate();
  const [fields, setFields] = useState([]);
  const [optionalFields, setOptionalFields] = useState([]);
  const intl = useIntl();
  const [confirmOpenGallery, setConfirmOpenGallery] = useState(false);
  const [img, setImg] = useState();
  const [imgGallerySelected, setImgGallerySelected] = useState(false);
  const [licenseCollections, setLicenseCollections] = useState([]);

  const handleChangeTemplate = (event) => {
    setTemplate(event.target.value);
  };

  const handleImageClick = () => {
    setPreview(require("../../../images/" + img));
    setImgGallerySelected(true);
  };

  function generateId(length) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  const handleClickNewField = () => {
    const newField = {
      id: generateId(8),
      name: "",
      type: "INTEGER",
    };
    setOptionalFields((optionalFields) => [...optionalFields, newField]);
  };

  var user = null;
  var userData = null;
  if (localStorage.getItem("user")) {
    user = localStorage.getItem("user");
    userData = JSON.parse(user);
  }

  const submitForm = (values) => {
    //Si se sube imagen desde la galeria
    if (imgGallerySelected === true) {
      ConfigService.createCollection(
        values.name,
        values.template,
        img,
        values.metadata,
        userData.id
      ).then((response) => {
        if (response.status === 200) {
          navigate(-1);
          toast.success(
            <FormattedMessage id="app.collection.created"></FormattedMessage>,
            { theme: "colored" }
          );
        }
      });
    }

    //Si no se sube imagen
    if (values.file === undefined && imgGallerySelected === false) {
      ConfigService.createCollection(
        values.name,
        values.template,
        null,
        values.metadata,
        userData.id
      ).then((response) => {
        if (response.status === 200) {
          navigate(-1);
          toast.success(
            <FormattedMessage id="app.collection.created"></FormattedMessage>,
            { theme: "colored" }
          );
        }
      });
    }
    //Si se sube imagen nueva y no de galeria
    if (values.file !== undefined && imgGallerySelected === false) {
      ConfigService.putImage(values.name, values.file).then((resp) => {
        ConfigService.createCollection(
          values.name,
          values.template,
          resp.data.path,
          values.metadata,
          userData.id
        ).then((response) => {
          if (response.status === 200 && resp.status === 200) {
            setTimeout(() => {
              navigate(-1);
            }, 3000);
            toast.success(
              <FormattedMessage id="app.collection.created"></FormattedMessage>,
              { theme: "colored" }
            );
          }
        });
      });
    }
  };

  useEffect(() => {
    if (userData.license.includes("Free")) {
      setTemplate("Action_Figures")
      setLicenseCollections(OptionsService.createCollectionOptions.slice(1));
    } else {
      setTemplate("New")
      setLicenseCollections(OptionsService.createCollectionOptions);
    }
  }, []);

  useEffect(() => {
    var tempArray = [];
    if (userData.license.includes("Free")) {
      tempArray = OptionsService.createCollectionOptions
        .slice(1)
        .find((f) => f.value === template);
      if (tempArray) {
        setFields(tempArray.fields);
      } else {
        setFields("");
      }
    } else {
      tempArray = OptionsService.createCollectionOptions.find(
        (f) => f.value === template
      );
      if (tempArray && template) {
        setFields(tempArray.fields);
      } else {
        setFields("");
      }
    }
  }, [template]);

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const newCollectionSchema = Yup.object().shape({
    name: Yup.string().required(
      <FormattedMessage id="app.collection.add_collection_field_required"></FormattedMessage>
    ),
    template: Yup.string().required(
      <FormattedMessage id="app.collection.add_collection_field_required"></FormattedMessage>
    ),
  });

  return (
    <Box sx={{ display: "flex" }}>
      <Grid>
        <Grid item xs={6}>
          <Typography variant="h4" component="h4">
            <FormattedMessage id="app.collection.add_collection_title"></FormattedMessage>
          </Typography>
        </Grid>
        <Formik
          initialValues={{ name: "", template: "New", logo: "", metadata: [] }}
          validate={(values) => {
            const errors = {};
            /*if (!values.name) {
              errors.name = 'Required';
            }
            return errors;*/
          }}
          validationSchema={newCollectionSchema}
          onSubmit={(values, { setSubmitting }) => {
            {
              template === "New"
                ? (values.metadata = optionalFields)
                : (values.metadata = []);
            }
            values.template = template;
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
                  <Box
                    pt={0}
                    component="img"
                    sx={{
                      height: "auto",
                      width: "auto",
                      maxHeight: 300,
                      maxWidth: 400,
                    }}
                    alt="Logo"
                    src={preview ? preview : NoImage}
                  ></Box>
                </Grid>
                <Grid item>
                  <Box>
                    <Button variant="contained" component="label">
                      {
                        <FormattedMessage id="app.collection.add_collection_upload"></FormattedMessage>
                      }
                      <input
                        type="file"
                        hidden
                        name="file"
                        accept="image/png, image/jpeg"
                        onChange={(e) => {
                          setFieldValue("file", e.currentTarget.files[0]);
                          setSelectedFile(e.currentTarget.files[0]);
                        }}
                      />
                    </Button>
                  </Box>
                </Grid>
                <Grid item>
                  <Tooltip
                    title={intl.formatMessage({
                      id: "app.tooltip.search_gallery",
                    })}
                    placement="bottom"
                    arrow
                  >
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={(e) => {
                        setConfirmOpenGallery(true);
                      }}
                    >
                      {
                        <FormattedMessage id="app.button.search_gallery"></FormattedMessage>
                      }
                    </Button>
                  </Tooltip>
                </Grid>
                <Grid item xs={2}>
                  <Tooltip
                    title={intl.formatMessage({
                      id: "app.tooltip.search_google",
                    })}
                    placement="right"
                    arrow
                  >
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={(e) => {
                        console.log(e);
                      }}
                    >
                      <GoogleIcon></GoogleIcon>
                    </Button>
                  </Tooltip>
                </Grid>
                <Grid item xs={12}>
                  <Box pt={2}>
                    <TextField
                      sx={{ minWidth: 300 }}
                      size="small"
                      id="name"
                      name="name"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.name && Boolean(errors.name)}
                      helperText={touched.name && errors.name}
                      label={
                        <FormattedMessage id="app.collection.add_collection_name"></FormattedMessage>
                      }
                      variant="outlined"
                      value={values.name}
                    />
                  </Box>
                </Grid>
                {licenseCollections && (
                  <Grid item xs={8}>
                    <TextField
                      id="demo-simple-select"
                      name="template"
                      select
                      size="small"
                      sx={{ minWidth: 300 }}
                      defaultValue=""
                      value={template}
                      label={
                        <FormattedMessage id="app.collection.template_label"></FormattedMessage>
                      }
                      onChange={handleChangeTemplate}
                    >
                      {licenseCollections?.map((option) => {
                        return (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label ?? option.value}
                          </MenuItem>
                        );
                      })}
                    </TextField>
                  </Grid>
                )}
                <Grid item xs={6.8}>
                  <Typography variant="h6" component="h6">
                    <FormattedMessage id="app.collection.template_default_fields"></FormattedMessage>
                  </Typography>
                  <TagsInput
                    fields={fields}
                    optional={optionalFields}
                  ></TagsInput>
                </Grid>
                {template === "New" && (
                  <Grid item xs={6.8}>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={handleClickNewField}
                    >
                      <FormattedMessage id="app.collection.add_collection_new_field"></FormattedMessage>
                    </Button>
                  </Grid>
                )}
                <Grid item xs={6.8}>
                  {optionalFields.length > 0 && (
                    <TableCustomFields
                      updateFields={setOptionalFields}
                      rows={optionalFields}
                      operation="add"
                    ></TableCustomFields>
                  )}
                </Grid>
              </Grid>
              <Box pt={3}>
                <Grid container>
                  <Grid item xs={1}>
                    <Button
                      variant="contained"
                      type="submit"
                      disabled={isSubmitting}
                      form="form"
                    >
                      <FormattedMessage id="app.button.accept"></FormattedMessage>
                    </Button>
                  </Grid>
                  <Grid item xs={2}>
                    <Button variant="contained" onClick={() => navigate(-1)}>
                      <FormattedMessage id="app.button.cancel"></FormattedMessage>
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Form>
          )}
        </Formik>
      </Grid>
      <ImageGalleryDialog
        title={intl.formatMessage({
          id: "app.dialog.gallery_title",
        })}
        open={confirmOpenGallery}
        setImageSelected={setImg}
        setOpen={setConfirmOpenGallery}
        onConfirm={handleImageClick}
      >
        <FormattedMessage id="app.dialog.confirm_delete"></FormattedMessage>
      </ImageGalleryDialog>
    </Box>
  );
}

export default AddCollection;
