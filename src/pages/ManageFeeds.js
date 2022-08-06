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

function ManageFeeds(props) {
  const [feedsList, setFeedsList] = useState([]);
  const navigate = useNavigate();
  const intl = useIntl();

  if (localStorage.getItem("user")) {
    var user = localStorage.getItem("user");
    var userData = JSON.parse(user);
  }

  useEffect(() => {
    const feeds = ConfigService.getAllUserFeeds(userData.id)
      .then((response) => {
        setFeedsList(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const submitForm = (values) => {
    ConfigService.createFeed(userData.id, values.name, values.url, null).then(
      (response) => {
        if (response.status === 200) {
          toast.success(
            <FormattedMessage id="app.feed.created"></FormattedMessage>,
            { theme: "colored" }
          );
          setFeedsList((feedsList) => [...feedsList, response.data]);
        }
      }
    );
  };

  const newSerieSchema = Yup.object().shape({
    name: Yup.string().required(
      <FormattedMessage id="app.collection.add_collection_field_required"></FormattedMessage>
    ),
    url: Yup.string().required(
      <FormattedMessage id="app.collection.add_collection_field_required"></FormattedMessage>
    ),
  });

  const options = {
    sorting: true,
    exportButton: true,
    headerStyle: { fontWeight: 'bold',},
  };

  const columns = [
    {
      title: intl.formatMessage({ id: "app.feed.add_feed_name" }),
      field: "name",
    },
    {
      title: intl.formatMessage({ id: "app.feed.add_feed_url" }),
      field: "url",
    },
  ];

  const data = feedsList.map((item) => {
    let rows = {
      name: item.name,
      url: item.rssUrl,
    };
    return rows;
  });

  return (
    <Box sx={{ display: "flex" }}>
      <ToastContainer autoClose={2000} />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4" component="h4">
            <FormattedMessage id="app.feed.add_feed"></FormattedMessage>
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Formik
            initialValues={{ name: "", url: "" }}
            validate={(values) => {
              const errors = {};
              /*if (!values.name) {
                errors.name = 'Required';
              }
              return errors;*/
            }}
            validationSchema={newSerieSchema}
            onSubmit={(values, { setSubmitting }) => {
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
                          <FormattedMessage id="app.feed.add_feed_name"></FormattedMessage>
                        }
                        error={touched.name && Boolean(errors.name)}
                        helperText={touched.name && errors.name}
                        variant="outlined"
                        value={values.name}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box pt={2}>
                      <TextField
                        sx={{ minWidth: 300 }}
                        size="small"
                        id="outlined-basic"
                        name="url"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label={
                          <FormattedMessage id="app.feed.add_feed_url"></FormattedMessage>
                        }
                        error={touched.url && Boolean(errors.url)}
                        helperText={touched.url && errors.url}
                        variant="outlined"
                        value={values.url}
                      />
                    </Box>
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
        <Grid item xs={6}>
          <MaterialTable
            title={<FormattedMessage id="app.feed.list"></FormattedMessage>}
            data={data}
            columns={columns}
            options={options}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default ManageFeeds;
