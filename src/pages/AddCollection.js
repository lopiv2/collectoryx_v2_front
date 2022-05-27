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

function AddCollection() {

  const [template, setTemplate] = useState("New");
  const [selectedFile, setSelectedFile] = useState()
  const [preview, setPreview] = useState()

  const handleChangeTemplate = (event) => {
    setTemplate(event.target.value);
  };

  // create a preview as a side effect, whenever selected file is changed
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
            setTimeout(() => {
              //alert(JSON.stringify(values, null, 2));
              setSubmitting(false);
            }, 400);
            values.template = template;
            console.log("values: ", values);
            //ConfigService.createCollection(values.name, values.template, values.logo, values.photo);
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
                        value={values.logo} />
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
                        name='photo'
                        accept="image/png, image/jpeg"
                        onChange={(e) => {
                          setFieldValue('photo', e.currentTarget.files[0]);
                          setSelectedFile(e.currentTarget.files[0])
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
                    <MenuItem value="New">
                      <FormattedMessage id="app.collection.new_template"></FormattedMessage>
                    </MenuItem>
                    <MenuItem value="Action_Figures">
                      <FormattedMessage id="app.collection.action_figures"></FormattedMessage>
                    </MenuItem>
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