import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { TextField } from "@mui/material";
import { Box } from "@mui/material";
import { Grid } from "@mui/material";
import { Button } from "@mui/material";
import ConfigService from "../app/api/config.api";
import "../styles/Dashboard.css";
import NoImage from "../images/no-photo-available.png";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import TagsInput from "../components/TagsInput";
import AddIcon from "@mui/icons-material/Add";
import TableCustomFields from "../components/TableCustomFields";
import * as Yup from "yup";
import { useLocation } from "react-router-dom";

function EditCollection() {
  const [template, setTemplate] = useState("New");
  const [selectedFile, setSelectedFile] = useState("");
  const location = useLocation();
  const [preview, setPreview] = useState();
  const navigate = useNavigate();
  const [fields, setFields] = useState([]);
  const [optionalFields, setOptionalFields] = useState([]);

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

  const submitForm = (values) => {
    if (values.file === undefined) {
      ConfigService.createCollection(
        values.name,
        values.template,
        null,
        values.metadata
      ).then((response) => {
        if (response.status === 200) {
          toast.success(
            <FormattedMessage id="app.collection.created"></FormattedMessage>,
            { theme: "colored" }
          );
          setTimeout(() => {
            navigate("/");
          }, 3000);
        }
      });
    } else {
      ConfigService.putImage(values.name, values.file).then((response) => {
        ConfigService.createCollection(
          values.name,
          values.template,
          response.data.path,
          values.metadata
        );
        if (response.status === 200) {
          toast.success(
            <FormattedMessage id="app.collection.created"></FormattedMessage>,
            { theme: "colored" }
          );
          setTimeout(() => {
            navigate("/");
          }, 3000);
        }
        //console.log(response);
      });
    }
  };

  useEffect(() => {
    if (location.state.item.logo) {
      setPreview(require("../../../images/" + location.state.item.logo.path));
    }
    ConfigService.getCollectionById(location.state.item.id).then((response) => {
      //setFields(response.data.metadata)
      console.log(response.data)
    })
    
  }, [location.state.item]);

  /*useEffect(() => {
    var tempArray = [];
    tempArray = OptionsService.createCollectionOptions.find(
      (f) => f.value === template
    );
    if (tempArray.fields) {
      setFields(tempArray.fields);
    } else {
      setFields("");
    }
  }, [template]);*/

  useEffect(() => {
    if (!selectedFile) {
      //setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

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
      <ToastContainer autoClose={2000} />
      <Grid>
        <Grid item xs={6}>
          <Typography variant="h4" component="h4">
            <FormattedMessage id="app.collection.edit_collection_title"></FormattedMessage>
            {location.state.item.name}
          </Typography>
        </Grid>
        <Formik
          initialValues={{
            name: location.state.item.name,
            logo: "",
            metadata: [],
          }}
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
                <Grid item xs={2}>
                  <Box pt={8}>
                    <Grid item xs={6}>
                      <TextField
                        sx={{ minWidth: 300 }}
                        size="small"
                        id="outlined-basic"
                        name="logo"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label={
                          <FormattedMessage id="app.collection.add_collection_logo"></FormattedMessage>
                        }
                        variant="outlined"
                        value={selectedFile.name || ""}
                      />
                    </Grid>
                  </Box>
                </Grid>
                <Grid item xs={2}>
                  <Box pt={8.2} ml={9}>
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
                <Grid item xs={5}>
                  <Box
                    pt={0}
                    ml={2}
                    component="img"
                    sx={{
                      height: 150,
                      width: 350,
                    }}
                    alt="Logo"
                    src={preview ? preview : NoImage}
                  ></Box>
                </Grid>
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
    </Box>
  );
}

export default EditCollection;
