import React, { useState } from 'react';
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

function AddCollection() {

  const [template, setTemplate] = useState("New");

  const handleChangeTemplate = (event) => {
    setTemplate(event.target.value);
    //console.log(template);
  };

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
            //console.log("values: ", values);
            ConfigService.createCollection(values.name,values.template,values.logo);
            setSubmitting(false);
          }}>
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
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
                  <Box pt={16} >
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
                  <Box pt={16.2} ml={9} >
                    <Button
                      variant="contained"
                      component="label"
                    >
                      {<FormattedMessage id="app.collection.add_collection_upload"></FormattedMessage>}
                      <input
                        type="file"
                        hidden
                      />
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={5}>
                  <Box
                    pt={1}
                    ml={2}
                    component="img"
                    sx={{
                      height: 233,
                      width: 350,
                      maxHeight: { xs: 233, md: 167 },
                      maxWidth: { xs: 350, md: 250 },
                    }}
                    alt="The house from the offer."
                    src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&w=350&dpr=2"
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