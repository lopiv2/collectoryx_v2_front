import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Typography } from "@mui/material";
import { FormattedMessage } from 'react-intl';
import { TextField } from "@mui/material";
import { Box } from "@mui/material";
import { MenuItem } from "@mui/material";
import { Grid } from '@mui/material';
import { Button } from '@mui/material';
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
        <Grid item xs={12}>
          <Typography variant="h4" component="h4">
            <FormattedMessage id="app.collection.add_collection_title"></FormattedMessage>
          </Typography>
        </Grid>
        <Formik
          initialValues={{ name: "", template: "New" , logo:""}}
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
              <Box pt={1} >
                <Grid item xs={8} >
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
                </Grid>
              </Box>
              <Box pt={1} >
                <Grid item xs={8} >
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

              <Box pt={3}>
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