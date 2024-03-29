import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { Box } from "@mui/material";
import { Grid } from "@mui/material";
import { Button } from "@mui/material";
import ConfigService from "../../app/api/config.api";
import MaterialTable from "@material-table/core";
import { ToastContainer, toast } from "react-toastify";
import { Formik, Form } from "formik";
import { TextField } from "@mui/material";
import { useIntl } from "react-intl";
import { Avatar } from "@mui/material";
import * as Yup from "yup";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ConfirmDialog from "../ConfirmDialog";
import EditApiDialog from "../EditApiDialog";
import { AppContext } from "../../components/AppContext";
import { isUndefined } from "lodash";
import NoImage from "../../images/no-photo-available.png";

function ManageApiTab(props) {
  const [apisList, setApisList] = useState([]);
  const [apiEdited, setApiEdited] = useState();
  const [newApiEdited, setNewApiEdited] = useState();
  const [openEdit, setOpenEdit] = useState(false);
  const intl = useIntl();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [value, setValue] = useState(null);
  const { userData, setUserData } = React.useContext(AppContext);

  const handleDeleteClick = () => {
    ConfigService.deleteApi(value).then((response) => {
      if (response.data === true) {
        toast.success(
          <FormattedMessage id="app.collection.item-deleted"></FormattedMessage>,
          { theme: "colored" }
        );
        var index = apisList.findIndex((apisList) => apisList.id === value);
        if (index > -1) {
          apisList.splice(index, 1);
          setApisList([...apisList]);
        }
      }
    });
  };

  useEffect(() => {
    if (!isUndefined(newApiEdited)) {
      var index = apisList.findIndex((x) => x.id === newApiEdited.id);
      let newItems = [...apisList];
      newItems[index] = newApiEdited;
      setApisList(newItems);
      setNewApiEdited(undefined);
    }
  }, [newApiEdited]);

  useEffect(() => {
    ConfigService.getAllApis(userData.id)
      .then((response) => {
        setApisList(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const submitForm = (values) => {
    ConfigService.createApi(
      userData.id,
      values.name,
      values.header,
      values.url,
      values.key,
      values.logo
    ).then((response) => {
      if (response.status === 200) {
        toast.success(
          <FormattedMessage id="app.config.general.api-created"></FormattedMessage>,
          { theme: "colored" }
        );
        setApisList((apisList) => [...apisList, response.data]);
      }
    });
  };

  const newSerieSchema = Yup.object().shape({
    name: Yup.string().required(
      <FormattedMessage id="app.collection.add_collection_field_required"></FormattedMessage>
    ),
  });

  const actions = [
    {
      icon: EditIcon,
      tooltip: intl.formatMessage({ id: "app.button.edit" }),
      onClick: (event, rowData) => {
        const data = apisList.find((api) => api.id === rowData.id_api);
        setApiEdited(data);
        setOpenEdit(true);
      },
    },
    (rowData) => ({
      icon: DeleteIcon,
      tooltip: intl.formatMessage({ id: "app.button.delete" }),
      onClick: (event, rowData) => {
        setValue(rowData.id_api);
        setConfirmOpen(true);
      },
      hidden: rowData.locked,
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
      title: intl.formatMessage({
        id: "app.config.general_apis_tab_list_name",
      }),
      field: "id_api",
      hidden: true,
    },
    {
      title: intl.formatMessage({
        id: "app.config.general_apis_tab_list_name",
      }),
      field: "name",
    },
    {
      title: intl.formatMessage({ id: "app.config.general_apis_tab_list_url" }),
      field: "url",
    },
    {
      title: intl.formatMessage({ id: "app.config.general_apis_tab_list_key" }),
      field: "key",
      render: (rowData) => <p>{rowData.key.split("").map(() => "*")}</p>,
    },
    {
      title: intl.formatMessage({ id: "app.collection.add_collection_logo" }),
      field: "logo",
    },
    {
      title: intl.formatMessage({ id: "app.collection.add_collection_logo" }),
      field: "locked",
      hidden: true,
    },
  ];

  const data = apisList.map((item) => {
    let cols = {
      id_api: item.id,
      name: item.name,
      header: item.header,
      url: item.apiLink,
      key: item.keyCode,
      logo:
        item.logo === null ? (
          <Avatar
            imgProps={{ referrerPolicy: "no-referrer" }}
            variant="rounded"
            src={NoImage}
            sx={{ width: 100, height: 35 }}
          ></Avatar>
        ) : (
          <Avatar
            imgProps={{ referrerPolicy: "no-referrer" }}
            variant="rounded"
            src={item.logo}
            sx={{ width: 100, height: 35 }}
          ></Avatar>
        ),
      locked: item.locked,
    };
    return cols;
  });

  return (
    <Box sx={{ display: "flex" }}>
      <ToastContainer autoClose={2000} />
      <Grid container spacing={2}>
        {/*Hidden: there´s no need by the moment to add apis beside default ones}
        {/*<Grid item xs={12}>
          <Typography variant="h4" component="h4">
            <FormattedMessage id="app.config.general_apis_tab_add_title"></FormattedMessage>
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Formik
            initialValues={{ name: "", key: "", url: "", logo: "", header: "" }}
            validate={(values) => {
              const errors = {};
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
                          <FormattedMessage id="app.config.general_apis_tab_list_name"></FormattedMessage>
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
                      name="key"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      size="small"
                      sx={{ minWidth: 300 }}
                      value={values.key}
                      label={
                        <FormattedMessage id="app.config.general_apis_tab_list_key"></FormattedMessage>
                      }
                    ></TextField>
                  </Grid>
                  <Grid item xs={9}>
                    <TextField
                      id="demo-simple-select"
                      name="header"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      size="small"
                      sx={{ minWidth: 300 }}
                      value={values.header}
                      label={
                        <FormattedMessage id="app.config.general_apis_tab_list_header"></FormattedMessage>
                      }
                    ></TextField>
                  </Grid>
                  <Grid item xs={9}>
                    <TextField
                      id="demo-simple-select"
                      name="url"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      size="small"
                      sx={{ minWidth: 300 }}
                      value={values.url}
                      label={
                        <FormattedMessage id="app.config.general_apis_tab_list_url"></FormattedMessage>
                      }
                    ></TextField>
                  </Grid>
                  <Grid item xs={9}>
                    <TextField
                      id="demo-simple-select"
                      name="logo"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      size="small"
                      sx={{ minWidth: 300 }}
                      value={values.logo}
                      label={
                        <FormattedMessage id="app.config.general_apis_tab_list_logo"></FormattedMessage>
                      }
                    ></TextField>
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
                    </Grid>*/}
        <Grid item xs={12} mr={2}>
          <MaterialTable
            title={
              <FormattedMessage id="app.config.general_apis_tab_list_title"></FormattedMessage>
            }
            data={data}
            columns={columns}
            options={options}
            actions={actions}
          />
        </Grid>
      </Grid>
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
      <EditApiDialog
        items={apiEdited}
        setItem={setApiEdited}
        newItem={newApiEdited}
        setNewItem={setNewApiEdited}
        open={openEdit}
        setOpen={setOpenEdit}
      >
        <FormattedMessage id="app.dialog.confirm_delete"></FormattedMessage>
      </EditApiDialog>
    </Box>
  );
}

export default ManageApiTab;
