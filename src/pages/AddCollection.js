import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Typography } from "@mui/material";
import { FormattedMessage } from 'react-intl';
import { Select } from "@mui/material";
import { Box } from "@mui/material";
import { MenuItem } from "@mui/material";
import { Grid } from '@mui/material';

function AddCollection() {

  const [template, setTemplate] = useState("");

  const handleChange = (event) => {
    setTemplate(event.target.value);
    console.log(template);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4" component="h4">
            <FormattedMessage id="app.collection.add_collection_title"></FormattedMessage>
          </Typography>
        </Grid>
        <Formik>
          {({ isSubmitting }) => (
            <Form>
              <Grid item xs={8}>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={template}
                  label="Age"
                  onChange={handleChange}
                >
                  <MenuItem value={"New"}>New</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </Grid>

              <button type="submit" disabled={isSubmitting}>
                Submit
              </button>
            </Form>
          )}

        </Formik>
      </Grid>
    </Box >

  );
}

export default AddCollection;