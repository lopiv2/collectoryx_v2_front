import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { Box } from "@mui/material";
import { Grid } from "@mui/material";
import { Button } from "@mui/material";
import ConfigService from "../app/api/config.api";
import "../styles/Dashboard.css";
import NoImage from "../images/no-photo-available.png";
import MaterialTable from "@material-table/core";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import { TextField, MenuItem } from "@mui/material";
import { useIntl } from "react-intl";
import { Avatar } from "@mui/material";
import * as Yup from "yup";

function ManageSeries(props) {
  const [collectionSeriesList, setCollectionSeriesList] = useState([]);
  const [collectionList, setCollectionList] = useState([]);
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState("");
  const [preview, setPreview] = useState();
  const [collection, setCollection] = useState();
  const intl = useIntl();

  if (localStorage.getItem("user")) {
    var user = localStorage.getItem("user");
    var userData = JSON.parse(user);
  }

  useEffect(() => {
    const collectionSeries = ConfigService.getAllSeries(userData.id)
      .then((response) => {
        setCollectionSeriesList(response.data);
        //console.log(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
    const collections = ConfigService.getCollectionLists(userData.id)
      .then((response) => {
        setCollectionList(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

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

  const submitForm = (values) => {
    if (values.file === undefined) {
      ConfigService.createSerie(values.name, values.collection, null).then(
        (response) => {
          if (response.status === 200) {
            toast.success(
              <FormattedMessage id="app.collection.serie-created"></FormattedMessage>,
              { theme: "colored" }
            );
            setCollectionSeriesList((collectionSeriesList) => [
              ...collectionSeriesList,
              response.data,
            ]);
          }
        }
      );
    } else {
      ConfigService.putImage(values.name, values.file).then((response) => {
        ConfigService.createSerie(
          values.name,
          values.collection,
          response.data.path
        );
        if (response.status === 200) {
          toast.success(
            <FormattedMessage id="app.collection.serie-created"></FormattedMessage>,
            { theme: "colored" }
          );
        }
        //console.log(response);
      });
    }
  };

  const handleChangeCollection = (event) => {
    setCollection(event.target.value);
  };

  const newSerieSchema = Yup.object().shape({
    name: Yup.string().required(
      <FormattedMessage id="app.collection.add_collection_field_required"></FormattedMessage>
    ),
  });

  const options = {
    sorting: true,
    exportButton: true,
  };

  const columns = [
    {
      title: intl.formatMessage({ id: "app.collection.add_collection_serie" }),
      field: "name",
    },
    {
      title: intl.formatMessage({ id: "app.collection.add_collection_logo" }),
      field: "logo",
    },
  ];

  const data = collectionSeriesList.map((item) => {
    let cols = {
      name: item.name,
      logo: item.logo === null ? (
        <Avatar
          variant="rounded"
          src={require("../images/no-photo-available.png")}
          sx={{ width: 100, height: 35 }}
        ></Avatar>
      ) : (
        <Avatar
          variant="rounded"
          src={require("../../../images/" + item.logo.path)}
          sx={{ width: 100, height: 35 }}
        ></Avatar>
      ),
    };
    return cols;
  });

  return (
    <Box sx={{ display: "flex" }}>
      <ToastContainer autoClose={2000} />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4" component="h4">
            <FormattedMessage id="app.collection.view_collections_series_add"></FormattedMessage>
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Formik
            initialValues={{ name: "", logo: "" }}
            validate={(values) => {
              const errors = {};
              /*if (!values.name) {
                errors.name = 'Required';
              }
              return errors;*/
            }}
            validationSchema={newSerieSchema}
            onSubmit={(values, { setSubmitting }) => {
              values.collection = collection;
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
                        id="outlined-basic"
                        name="name"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label={
                          <FormattedMessage id="app.collection.add_collection_serie"></FormattedMessage>
                        }
                        error={touched.name && Boolean(errors.name)}
                        helperText={touched.name && errors.name}
                        variant="outlined"
                        value={values.name}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={9}>
                    <TextField
                      id="demo-simple-select"
                      name="collection"
                      select
                      size="small"
                      sx={{ minWidth: 300 }}
                      defaultValue=""
                      value={collection ?? ""}
                      error={touched.collection && Boolean(errors.collection)}
                      helperText={touched.collection && errors.collection}
                      label={
                        <FormattedMessage id="app.collection.add_collection_name"></FormattedMessage>
                      }
                      onChange={handleChangeCollection}
                    >
                      {collectionList?.map((option) => {
                        return (
                          <MenuItem key={option.id} value={option.id}>
                            {option.name}
                          </MenuItem>
                        );
                      })}
                    </TextField>
                  </Grid>
                  <Grid item xs={4} pt={1}>
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
                  <Grid item xs={4}>
                    <Box pt={0.3} ml={5}>
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
                    ></Box>
                  </Grid>
                  <Grid item xs={8}>
                    <Button
                      variant="contained"
                      type="submit"
                      disabled={isSubmitting}
                      form="form"
                    >
                      <FormattedMessage id="app.button.add_new"></FormattedMessage>
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </Grid>
        <Grid item xs={5} mr={2}>
          <MaterialTable
            title={
              <FormattedMessage id="app.collection.view_collections_series"></FormattedMessage>
            }
            data={data}
            columns={columns}
            options={options}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default ManageSeries;
