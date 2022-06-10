import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Typography } from "@mui/material";
import { FormattedMessage } from 'react-intl';
import { TextField } from "@mui/material";
import { Box } from "@mui/material";
import { MenuItem } from "@mui/material";
import { Grid } from '@mui/material';
import { Button } from '@mui/material';
import ConfigService from "../app/api/config.api";
import "../styles/Dashboard.css";
import NoImage from "../images/no-photo-available.png";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import OptionsService from "../components/DropDownOptions";


function AddCollection() {

  const [template, setTemplate] = useState("New");
  const [selectedFile, setSelectedFile] = useState("")
  const [preview, setPreview] = useState()
  const navigate = useNavigate();

  const handleChangeTemplate = (event) => {
    setTemplate(event.target.value);
  };

  const submitForm = (values) => {
    ConfigService.putImage(values.name, values.file).then((response) => {
      ConfigService.createCollection(values.name, values.template, response.data.path);
      if (response.data.status = 200) {
        toast.success(<FormattedMessage id="app.collection.created"></FormattedMessage>, { theme: "colored" });
        setTimeout(() => {
          navigate("/");
        }, 3000)
      }
      console.log(response);
    });
  };


  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined)
      return
    }

    const objectUrl = URL.createObjectURL(selectedFile)
    setPreview(objectUrl)

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedFile])


  return (
    <Box sx={{ display: 'flex' }}>
      <ToastContainer autoClose={2000} />
      <Grid>
        <Grid item xs={6}>
          <Typography variant="h4" component="h4">
            <FormattedMessage id="app.collection.add_collection_title"></FormattedMessage>
          </Typography>
        </Grid>
        <Formik
          initialValues={{ name: "", template: "New", logo: "" }}
          validate={values => {
            const errors = {};
            /*if (!values.name) {
              errors.name = 'Required';
            }
            return errors;*/
          }}
          onSubmit={(values, { setSubmitting }) => {
            values.template = template;
            submitForm(values);
            setSubmitting(false);
          }}>
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
                <Grid item xs={12} >
                  <Box pt={2} >
                    <TextField
                      sx={{ minWidth: 300 }}
                      size="small"
                      id="outlined-basic"
                      name="name"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      label={<FormattedMessage id="app.collection.add_collection_name"></FormattedMessage>}
                      variant="outlined"
                      value={values.name} />
                  </Box>
                </Grid>
                <Grid item xs={2}>
                  <Box pt={8} >
                    <Grid item xs={6} >
                      <TextField
                        sx={{ minWidth: 300 }}
                        size="small"
                        id="outlined-basic"
                        name="logo"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label={<FormattedMessage id="app.collection.add_collection_logo"></FormattedMessage>}
                        variant="outlined"
                        value={selectedFile.name || ''} />
                    </Grid>
                  </Box>
                </Grid>
                <Grid item xs={2}>
                  <Box pt={8.2} ml={9} >
                    <Button
                      variant="contained"
                      component="label"
                    >
                      {<FormattedMessage id="app.collection.add_collection_upload"></FormattedMessage>}
                      <input
                        type="file"
                        hidden
                        name='file'
                        accept="image/png, image/jpeg"
                        onChange={(e) => {
                          setFieldValue('file', e.currentTarget.files[0]);
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
                  >
                  </Box>
                </Grid>
                <Grid item xs={8}>
                  <TextField
                    id="demo-simple-select"
                    name="template"
                    select
                    size="small"
                    sx={{ minWidth: 300 }}
                    defaultValue={template}
                    value={template}
                    label={<FormattedMessage id="app.collection.template_label"></FormattedMessage>}
                    onChange={handleChangeTemplate}
                  >
                    {OptionsService.createCollectionOptions?.map(option => {
                      return (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label ?? option.value}
                        </MenuItem>
                      );
                    })}
                  </TextField>
                </Grid>
              </Grid>
              <Box pt={3}>
              </Box>
              <Box pt={3}>
                <Grid item xs={8}>
                  <Button variant="contained" type="submit" disabled={isSubmitting} form="form">
                    <FormattedMessage id="app.button.accept"></FormattedMessage>
                  </Button>
                </Grid>
              </Box>
            </Form>
          )}
        </Formik>
      </Grid>
    </Box >
  );
}

export default AddCollection;