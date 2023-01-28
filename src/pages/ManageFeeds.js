import React, { useState, useEffect, useContext } from "react";
import { Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { Box } from "@mui/material";
import { Grid } from "@mui/material";
import { Button } from "@mui/material";
import ConfigService from "../app/api/config.api";
import NoImage from "../images/no-photo-available.png";
import "../styles/Dashboard.css";
import MaterialTable from "@material-table/core";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import { TextField, Avatar } from "@mui/material";
import { useIntl } from "react-intl";
import { cleanUrl } from "../utils/generic";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import * as Yup from "yup";
import ConfirmDialog from "../components/ConfirmDialog";
import { AppContext } from "../components/AppContext";
import EditFeedDialog from "../components/EditFeedDialog";
import { isUndefined } from "lodash";

function ManageFeeds(props) {
  const [feedEdited, setFeedEdited] = useState();
  const [newFeedEdited, setNewFeedEdited] = useState();
  const { feedsList, setFeedsList } = useContext(AppContext);
  const navigate = useNavigate();
  const intl = useIntl();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const { userData, setUserData } = React.useContext(AppContext);

  const handleDeleteClick = () => {
    const deleteColl = ConfigService.deleteFeed(value).then((response) => {
      if (response.data === true) {
        toast.success(
          <FormattedMessage id="app.collection.item-deleted"></FormattedMessage>,
          { theme: "colored" }
        );
        var index = feedsList.findIndex((feedsList) => feedsList.id === value);
        if (index > -1) {
          feedsList.splice(index, 1);
          setFeedsList([...feedsList]);
        }
      }
    });
  };

  useEffect(() => {
    if (!isUndefined(newFeedEdited)) {
      var index = feedsList.findIndex((x) => x.id == newFeedEdited.id);
      let newItems = [...feedsList];
      newItems[index] = newFeedEdited;
      setFeedsList(newItems);
      setNewFeedEdited(undefined);
    }
  }, [newFeedEdited]);

  const submitForm = (values) => {
    ConfigService.createFeed(
      userData.id,
      values.name,
      values.url,
      "https://" + cleanUrl(values.url)
    ).then((response) => {
      if (response.status === 200) {
        toast.success(
          <FormattedMessage id="app.feed.created"></FormattedMessage>,
          { theme: "colored" }
        );
        setFeedsList((feedsList) => [...feedsList, response.data]);
      }
    });
  };

  const newSerieSchema = Yup.object().shape({
    name: Yup.string().required(
      <FormattedMessage id="app.collection.add_collection_field_required"></FormattedMessage>
    ),
    url: Yup.string().required(
      <FormattedMessage id="app.collection.add_collection_field_required"></FormattedMessage>
    ),
  });

  const actions = [
    {
      icon: EditIcon,
      tooltip: intl.formatMessage({ id: "app.button.edit" }),
      onClick: (event, rowData) => {
        const data = feedsList.find((feed) => feed.id === rowData.id);
        setFeedEdited(data);
        setOpenEdit(true);
      },
    },
    (rowData) => ({
      icon: DeleteIcon,
      tooltip: intl.formatMessage({ id: "app.button.delete" }),
      onClick: (event, rowData) => {
        setValue(rowData.id);
        setConfirmOpen(true);
      },
    }),
  ];

  const options = {
    sorting: true,
    exportButton: true,
    headerStyle: { fontWeight: "bold" },
    actionsColumnIndex: -1,
  };

  const columns = [
    {
      title: intl.formatMessage({ id: "app.feed.add_feed_name" }),
      field: "id",
      hidden: true,
    },
    {
      title: intl.formatMessage({ id: "app.feed.add_feed_name" }),
      field: "name",
    },
    {
      title: intl.formatMessage({ id: "app.feed.add_feed_url" }),
      field: "url",
    },
    {
      title: intl.formatMessage({ id: "app.collection.add_collection_logo" }),
      field: "logo",
    },
  ];

  const data = feedsList.map((item) => {
    let rows = {
      id: item.id,
      name: item.name,
      url: item.rssUrl,
      logo: (
        <Avatar
          variant="rounded"
          src={item.logo ? item.logo : NoImage}
          sx={{ width: 50, height: 50 }}
        ></Avatar>
      ),
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
        <Grid item xs={12}>
          <MaterialTable
            title={<FormattedMessage id="app.feed.list"></FormattedMessage>}
            data={data}
            columns={columns}
            options={options}
            actions={actions}
          />
          <ConfirmDialog
            title={intl.formatMessage({
              id: "app.dialog.delete_title",
            })}
            open={confirmOpen}
            setOpen={setConfirmOpen}
            onConfirm={handleDeleteClick}
          >
            <FormattedMessage id="app.dialog.confirm_delete"></FormattedMessage>
          </ConfirmDialog>
          <EditFeedDialog
            items={feedEdited}
            collectionList={feedsList}
            setItem={setFeedEdited}
            newItem={newFeedEdited}
            setNewItem={setNewFeedEdited}
            open={openEdit}
            setOpen={setOpenEdit}
          >
            <FormattedMessage id="app.dialog.confirm_delete"></FormattedMessage>
          </EditFeedDialog>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ManageFeeds;
