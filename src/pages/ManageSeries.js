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
import { Formik, Form } from "formik";
import { TextField, MenuItem, Tooltip } from "@mui/material";
import { useIntl } from "react-intl";
import { Avatar } from "@mui/material";
import * as Yup from "yup";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ConfirmDialog from "../components/ConfirmDialog";
import EditSerieDialog from "../components/EditSerieDialog";
import { isUndefined } from "lodash";
import { AppContext } from "../components/AppContext";
import { useNavigate } from "react-router-dom";
import ImageGalleryDialog from "../components/ImageGalleryDialog";
import LinkIcon from '@mui/icons-material/Link';
import URLImageDialog from "../components/URLImageDialog";

function ManageSeries(props) {
  const [collectionSeriesList, setCollectionSeriesList] = useState([]);
  const [collectionList, setCollectionList] = useState([]);
  const [serieEdited, setSerieEdited] = useState();
  const [newSerieEdited, setNewSerieEdited] = useState();
  //const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState("");
  const [preview, setPreview] = useState();
  const [collection, setCollection] = useState();
  const intl = useIntl();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const { userData, setUserData } = React.useContext(AppContext);
  const [confirmOpenGallery, setConfirmOpenGallery] = useState(false);
  const [img, setImg] = useState();
  const [imgGallerySelected, setImgGallerySelected] = useState(false);
  const [urlImageChosen, setUrlImageChosen] = useState(false); //If a image was selected from url
  const [openUrl, setOpenUrl] = useState(false);
  const navigate = useNavigate();

  const handleImageClick = () => {
    setPreview("/images/uploads/" + img);
    setImgGallerySelected(true);
  };

  const handleDeleteClick = () => {
    ConfigService.deleteSerie(value).then((response) => {
      if (response.data === true) {
        toast.success(
          <FormattedMessage id="app.collection.item-deleted"></FormattedMessage>,
          { theme: "colored" }
        );
        var index = collectionSeriesList.findIndex(
          (collectionSeriesList) => collectionSeriesList.id === value
        );
        if (index > -1) {
          collectionSeriesList.splice(index, 1);
          setCollectionSeriesList([...collectionSeriesList]);
        }
      }
    });
  };

  useEffect(() => {
    if (!isUndefined(newSerieEdited)) {
      var index = collectionSeriesList.findIndex((x) => x.id === newSerieEdited.id);
      let newItems = [...collectionSeriesList];
      newItems[index] = newSerieEdited;
      setCollectionSeriesList(newItems);
      setNewSerieEdited(undefined);
    }
  }, [newSerieEdited]);

  useEffect(() => {
    ConfigService.getAllSeries(userData.id)
      .then((response) => {
        setCollectionSeriesList(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
    const query = {
      id: userData.id,
      orderField: "name",
      orderDirection: "up",
    };
    ConfigService.getCollectionLists(query)
      .then((response) => {
        setCollectionList(response.data.content);
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
    //Empty serie without any kind of image
    if (values.file === undefined && imgGallerySelected === false && urlImageChosen === false) {
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
    }
    //Create Serie with uploading image from gallery or url
    if (values.file === undefined && (imgGallerySelected === true || urlImageChosen === true)) {
      ConfigService.createSerie(values.name, values.collection, preview).then(
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
    }
    //Create Serie with uploading image
    if (values.file !== undefined && imgGallerySelected === false && urlImageChosen === false) {
      ConfigService.createSerieWithImage(values.name, values.file, values.collection).then((response) => {
        if (response.data !== null) {
          if (response.status === 200) {
            toast.success(
              <FormattedMessage id="app.collection.serie-created"></FormattedMessage>,
              { theme: "colored" }
            );
          }
        }
        setCollectionSeriesList((collectionSeriesList) => [
          ...collectionSeriesList,
          response.data,
        ]);
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

  const actions = [
    {
      icon: EditIcon,
      tooltip: intl.formatMessage({ id: "app.button.edit" }),
      onClick: (event, rowData) => {
        const data = collectionSeriesList.find((serie) => serie.id === rowData.id);
        setSerieEdited(data);
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
      title: intl.formatMessage({ id: "app.collection.add_collection_serie" }),
      field: "name",
    },
    {
      title: intl.formatMessage({ id: "app.collection.add_collection_name" }),
      field: "collection",
    },
    {
      title: intl.formatMessage({ id: "app.collection.add_collection_logo" }),
      field: "logo",
    },
  ];

  const data = collectionSeriesList.map((item) => {
    let cols = {
      id: item.id,
      name: item.name,
      collection: item.collection ? item.collection.collection : null,
      logo:
        item.logo === null ? (
          <Avatar
            variant="rounded"
            src={NoImage}
            sx={{ width: 100, height: 35 }}
          ></Avatar>
        ) : (
          <Avatar
            variant="rounded"
            src={!item.logo.path.includes("http") ? "/images/uploads/" + item.logo.path : item.logo.path}
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
        <Grid item xs={4}>
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
            onSubmit={(values, { setSubmitting, resetForm }) => {
              values.collection = collection;
              submitForm(values);
              setSubmitting(false);
              resetForm();
              setCollection("");
              setPreview(null)
              setSelectedFile(null)
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
                  <Grid item xs={9} mb={2}>
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
                      {collectionList.map((option) => {
                        return (
                          <MenuItem key={option.id} value={option.id}>
                            {option.name}
                          </MenuItem>
                        );
                      })}
                    </TextField>
                  </Grid>
                  {/*<Grid item xs={4} pt={1}>
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
                      value={selectedFile ? selectedFile.name || "" : ""}
                    />
                    </Grid>*/}
                  <Grid container spacing={2} ml={0}>
                    <Grid item>
                      <Box>
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
                    <Grid item>
                      <Tooltip
                        title={intl.formatMessage({
                          id: "app.tooltip.search_gallery",
                        })}
                        placement="bottom"
                        arrow
                      >
                        <Button
                          color="primary"
                          variant="contained"
                          onClick={(e) => {
                            setConfirmOpenGallery(true);
                          }}
                        >
                          {
                            <FormattedMessage id="app.button.search_gallery"></FormattedMessage>
                          }
                        </Button>
                      </Tooltip>
                    </Grid>
                    <Grid item>
                      <Tooltip
                        title={intl.formatMessage({
                          id: "app.collection.add_collection_image_url",
                        })}
                        placement="right"
                        arrow
                      >
                        <Button
                          color="primary"
                          variant="contained"
                          onClick={(e) => {
                            setOpenUrl(true);
                          }}
                        >
                          <LinkIcon />
                        </Button>
                      </Tooltip>
                    </Grid>
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
        <Grid item xs={12} mr={2}>
          <MaterialTable
            title={
              <FormattedMessage id="app.collection.view_collections_series"></FormattedMessage>
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
      <URLImageDialog
        setUrl={setPreview}
        setUrlImageChosen={setUrlImageChosen}
        open={openUrl}
        setOpen={setOpenUrl}
      >
        <FormattedMessage id="app.dialog.confirm_delete"></FormattedMessage>
      </URLImageDialog>
      <ImageGalleryDialog
        title={intl.formatMessage({
          id: "app.dialog.gallery_title",
        })}
        open={confirmOpenGallery}
        setImageSelected={setImg}
        setOpen={setConfirmOpenGallery}
        onConfirm={handleImageClick}
      >
        <FormattedMessage id="app.dialog.confirm_delete"></FormattedMessage>
      </ImageGalleryDialog>
      <EditSerieDialog
        items={serieEdited}
        collectionList={collectionList}
        setItem={setSerieEdited}
        newItem={newSerieEdited}
        setNewItem={setNewSerieEdited}
        open={openEdit}
        setOpen={setOpenEdit}
      >
        <FormattedMessage id="app.dialog.confirm_delete"></FormattedMessage>
      </EditSerieDialog>
    </Box>
  );
}

export default ManageSeries;
