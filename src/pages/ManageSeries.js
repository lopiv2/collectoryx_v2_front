import React, { useState, useEffect } from 'react';
import { Typography } from "@mui/material";
import { FormattedMessage } from 'react-intl';
import { Box } from "@mui/material";
import { Grid } from '@mui/material';
import { Button } from '@mui/material';
import ConfigService from "../app/api/config.api";
import "../styles/Dashboard.css";
import NoImage from "../images/no-photo-available.png";
import MUIDataTable from "mui-datatables";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import styles from "../styles/Collections.css"
import { Formik, Form } from 'formik';
import { TextField } from "@mui/material";
import { useIntl } from 'react-intl';
import { Avatar } from "@mui/material";

function ManageSeries(props) {

  const [collectionsList, setCollectionsList] = useState([]);
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState("");
  const [preview, setPreview] = useState();
  const intl = useIntl();

  useEffect(() => {
    const collections = ConfigService.getCollectionSeries().then((response) => {
      setCollectionsList(response.data);
      //console.log(response.data);
    })
      .catch(err => {
        console.log(err);
      });
  }, [])

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

  const submitForm = (values) => {
    ConfigService.putImage(values.name, values.file).then((response) => {
      ConfigService.createSerie(values.name, response.data.path);
      if (response.data.status === 200) {
        toast.success(<FormattedMessage id="app.collection.serie-created"></FormattedMessage>, { theme: "colored" });
      }
      //console.log(response);
    });
  };

  const options = {
    filterType: 'checkbox',
  };

  const columns = [intl.formatMessage({ id: 'app.collection.add_collection_serie' }), intl.formatMessage({ id: 'app.collection.add_collection_logo' })];

  return (
    <Box sx={{ display: 'flex' }}>
      <ToastContainer autoClose={2000} />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4" component="h4">
            <FormattedMessage id="app.collection.view_collections_series"></FormattedMessage>
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Formik
            initialValues={{ name: "", logo: "" }}
            validate={values => {
              const errors = {};
              /*if (!values.name) {
                errors.name = 'Required';
              }
              return errors;*/
            }}
            onSubmit={(values, { setSubmitting }) => {
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
                        label={<FormattedMessage id="app.collection.add_collection_serie"></FormattedMessage>}
                        variant="outlined"
                        value={values.name} />
                    </Box>
                  </Grid>
                  <Grid item xs={4} pt={1} >
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
                  <Grid item xs={4}>
                    <Box pt={.3} ml={5} >
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
                  <Grid item xs={12} pt={1}>
                    <Box
                      pt={0}
                      ml={0}
                      component="img"
                      sx={{
                        height: 150,
                        width: 200,
                      }}
                      alt="Logo"
                      src={preview ? preview : NoImage}
                    >
                    </Box>
                  </Grid>
                  <Grid item xs={8}>
                    <Button variant="contained" type="submit" disabled={isSubmitting} form="form">
                      <FormattedMessage id="app.button.add_new"></FormattedMessage>
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </Grid>
        <Grid item xs={6}>
          <MUIDataTable
            title={<FormattedMessage id="app.collection.view_collections_series"></FormattedMessage>}
            data={collectionsList.length > 0 ? collectionsList.map(item => {
              return [
                item.name,
                <Avatar variant="rounded" src={require('../../../images/' + item.logo.path)} sx={{ width: 100, height: 35 }} >
                </Avatar>,
                "hola"
              ]
            }) : []}
            columns={columns}
            options={options}
          />
        </Grid>
      </Grid>
    </Box >
  );
}

export default ManageSeries;