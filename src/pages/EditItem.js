import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import { Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import { FormattedMessage, useIntl } from "react-intl";
import { TextField } from "@mui/material";
import { Box } from "@mui/material";
import { MenuItem } from "@mui/material";
import { Grid } from "@mui/material";
import { Button } from "@mui/material";
import ConfigService from "../app/api/config.api";
import "../styles/Dashboard.css";
import NoImage from "../images/no-photo-available.png";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { GetCurrencySymbolLocale } from "../utils/generic";
import Checkbox from "@mui/material/Checkbox";
import InputAdornment from "@mui/material/InputAdornment";
import BasicDatePicker from "../components/BasicDatePicker";
import esLocale from "date-fns/locale/es";
import enLocale from "date-fns/locale/en-US";
import GoogleIcon from "@mui/icons-material/Google";
import { Tooltip } from "@mui/material";
import { format } from "date-fns";
import ImageGalleryDialog from "../components/ImageGalleryDialog";
import { isUndefined } from "lodash";
import URLImageDialog from "../components/URLImageDialog";
import LinkIcon from "@mui/icons-material/Link";

const localeMap = {
  en: enLocale,
  es: esLocale,
};

function EditItem(props) {
  const [date, setDate] = useState(new Date());
  const [own, setOwn] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");
  const location = useLocation();
  const [preview, setPreview] = useState();
  const navigate = useNavigate();
  const intl = useIntl();
  const [formValues, setFormValues] = useState(null);
  const [collectionSeriesList, setCollectionSeriesList] = useState([]);
  const [collectionId, setCollectionId] = useState();
  const [metadataValues, setMetadataValues] = useState([]);
  const currency = GetCurrencySymbolLocale();
  const [confirmOpenGallery, setConfirmOpenGallery] = useState(false);
  const [img, setImg] = useState();
  const [imgGallerySelected, setImgGallerySelected] = useState(false);
  const [urlImageChosen, setUrlImageChosen] = useState(false); //If a image was selected from url
  const [openUrl, setOpenUrl] = useState(false);

  useEffect(() => {
    if (location.state !== null) {
      setCollectionId(location.state.id);
    } else {
      console.log(location.state);
    }
    //setCollectionId(location.state.id)
  }, [location]);

  const handleChangeOwn = (event) => {
    setOwn(event.target.checked);
  };

  const handleImageClick = () => {
    setPreview("/images/uploads/" + img);
    //return "/images/uploads/" + item.image.path;
    setImgGallerySelected(true);
  };

  const handleChangeMetadataValue = (item, val) => {
    if (typeof val === "boolean") {
      if (val === true) {
        val = 1;
      } else {
        val = 0;
      }
    }
    var index = metadataValues.findIndex((x) => x.id === item.id);
    //console.log(metadataValues)
    let newItems = [...metadataValues];
    metadataValues[index].value = val;
    setMetadataValues(newItems);
  };

  const checkFieldType = (field) => {
    switch (field.type) {
      case "BOOLEAN":
        var check = true;

        if (field.value == 1 || field.value === true) {
          check = true;
        } else {
          check = false;
        }

        return (
          <Checkbox
            value={field.value}
            checked={check}
            onChange={(e) => handleChangeMetadataValue(field, e.target.checked)}
          ></Checkbox>
        );
      case "INTEGER":
        return (
          <TextField
            inputProps={{ type: "number" }}
            sx={{ minWidth: { xs: 120, sm: 250 } }}
            size="small"
            id="name"
            name="name"
            onChange={(e) => handleChangeMetadataValue(field, e.target.value)}
            variant="outlined"
            value={field.value}
          />
        );
      default:
        return (
          <TextField
            sx={{ minWidth: { xs: 120, sm: 250 } }}
            size="small"
            id="name"
            name="name"
            error={true}
            onChange={(e) => handleChangeMetadataValue(field, e.target.value)}
            variant="outlined"
            value={field.value}
          />
        );
    }
  };

  useEffect(() => {
    if (!isUndefined(collectionId)) {
      ConfigService.getCollectionSeries(collectionId)
        .then((response) => {
          //console.log(response.data)
          setCollectionSeriesList(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [collectionId]);

  /*useEffect(() => {
    if (metadataValues !== null) {
      setFormValues((existingValues) => ({
        // Retain the existing values
        ...existingValues,
        // update the firstName
        metadata: metadataValues,
      }));
      console.log(metadataValues)
    }
  }, [metadataValues]);*/

  useEffect(() => {
    if (location.state != null) {
      const data = {
        id: location.state.item.id,
        name: location.state.item.name,
        serie: location.state.item.serie ? location.state.item.serie.id : null,
        price: location.state.item.price,
        year: location.state.item.year,
        acquiringDate: date,
        own: location.state.item.own,
        image: "",
        notes: location.state.item.notes,
        metadata: location.state.item.metadata,
      };
      //console.log(location.state.item);
      if (location.state.item.image) {
        setPreview(location.state.item.image.path);
      }

      setMetadataValues(location.state.item.metadata);
      setFormValues(data);
    }
  }, [location.state]);

  const submitForm = (values) => {
    //Image set from URL
    //console.log(values.metadata);
    if (urlImageChosen === true && values.file === undefined) {
      ConfigService.updateItem(
        values,
        location.state.id,
        preview,
        values.metadata
      ).then((response) => {
        if (response.status === 200) {
          navigate(-1);
          toast.success(
            <FormattedMessage id="app.collection.item-edited"></FormattedMessage>,
            { theme: "colored" }
          );
        }
      });
    }
    //Image set in Database and updated from gallery
    if (
      preview !== undefined &&
      imgGallerySelected === true &&
      urlImageChosen === false
    ) {
      ConfigService.updateItem(
        values,
        location.state.id,
        img,
        values.metadata
      ).then((response) => {
        if (response.status === 200) {
          navigate(-1);
          toast.success(
            <FormattedMessage id="app.collection.item-edited"></FormattedMessage>,
            { theme: "colored" }
          );
        }
      });
    }
    //Image set in Database and not updated from gallery
    if (
      preview !== undefined &&
      values.file === undefined &&
      imgGallerySelected === false &&
      urlImageChosen === false
    ) {
      ConfigService.updateItem(
        values,
        location.state.id,
        location.state.item.image.path,
        values.metadata
      ).then((response) => {
        if (response.status === 200) {
          navigate(-1);
          toast.success(
            <FormattedMessage id="app.collection.item-edited"></FormattedMessage>,
            { theme: "colored" }
          );
        }
      });
    }
    //Image not set in Database and not updated
    if (
      preview === undefined &&
      values.file === undefined &&
      urlImageChosen === false
    ) {
      ConfigService.updateItem(
        values,
        location.state.id,
        null,
        values.metadata
      ).then((response) => {
        if (response.status === 200) {
          navigate(-1);
          toast.success(
            <FormattedMessage id="app.collection.item-edited"></FormattedMessage>,
            { theme: "colored" }
          );
        }
      });
    }
    //Image updated
    if (values.file !== undefined) {
      ConfigService.putImage(values.name, values.file).then((response) => {
        if (response.data.path) {
          ConfigService.updateItem(
            values,
            location.state.id,
            response.data.path,
            values.metadata
          ).then((responseItem) => {
            if (response.status === 200 && responseItem.status === 200) {
              navigate(-1);
              toast.success(
                <FormattedMessage id="app.collection.item-edited"></FormattedMessage>,
                { theme: "colored" }
              );
            }
          });
        }
      });
    }
  };

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);
      setImgGallerySelected(false);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [selectedFile]);

  useEffect(() => {
    //console.log(location.state.item);
    if (location.state != null) {
      if (location.state.item.image) {
        if (!location.state.item.image.path.includes("http")) {
          setPreview("/images/uploads/" + location.state.item.image.path);
        } else {
          setPreview(location.state.item.image.path);
        }
      }
      setOwn(location.state.item.own);
      const dateFormatPickup = new Date(location.state.item.acquiringDate);
      setDate(dateFormatPickup);
    }
  }, [location.state]);

  const newItemSchema = Yup.object().shape({
    name: Yup.string()
      .min(1, "Too Short!")
      .max(50, "Too Long!")
      .required(
        <FormattedMessage id="app.collection.add_collection_field_required"></FormattedMessage>
      ),
    serie: Yup.string().required(
      <FormattedMessage id="app.collection.add_collection_field_required"></FormattedMessage>
    ),
    price: Yup.number()
      .moreThan(
        -1,
        <FormattedMessage id="app.collection.add_item_number_positive"></FormattedMessage>
      )
      .required(
        <FormattedMessage id="app.collection.add_collection_field_required"></FormattedMessage>
      ),
    year: Yup.number()
      .moreThan(
        999,
        <FormattedMessage id="app.collection.add_item_year_999"></FormattedMessage>
      )
      .test(
        "len",
        <FormattedMessage id="app.collection.add_item_year_4digits"></FormattedMessage>,
        (val) => {
          if (val) return val.toString().length === 4;
        }
      )
      .required(
        <FormattedMessage id="app.collection.add_collection_field_required"></FormattedMessage>
      ),
    /*acquiringDate: Yup.date()
            .required(<FormattedMessage id="app.collection.add_collection_field_required"></FormattedMessage>),*/
  });
  //console.log(location.state.item)
  return (
    location.state !== null && (
      <Box sx={{ display: "flex" }}>
        <ToastContainer autoClose={2000} />
        <Grid container>
          <Grid item xs={12}>
            <Typography
              variant="h5"
              component="h5"
              sx={{ typography: { sm: "h5", xs: "h6" } }}
            >
              <FormattedMessage id="app.collection.edit_item_title"></FormattedMessage>
              {location.state.name}
            </Typography>
          </Grid>
          <Grid>
            {formValues && (
              <Formik
                initialValues={formValues}
                enableReinitialize={true}
                validationSchema={newItemSchema}
                onSubmit={(values, { setSubmitting }) => {
                  values.own = own;
                  const d = format(new Date(date), "yyyy-MM-dd");
                  values.acquiringDate = d;
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
                  <Form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSubmit();
                    }}
                    id="form"
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Box
                          pt={0}
                          ml={0}
                          mt={2}
                          component="img"
                          sx={{
                            height: "auto",
                            width: "auto",
                            maxHeight: { xs: 200, md: 300 },
                            maxWidth: { xs: 300, md: 400 },
                          }}
                          alt="Logo"
                          src={preview ? preview : NoImage}
                        ></Box>
                      </Grid>
                      <Box ml={2}>
                        <Grid
                          container
                          spacing={{ xs: 6, md: 12 }}
                          columns={{ xs: 3, sm: 8, md: 12 }}
                        >
                          <Grid item xs={1} sm={3} md={3}>
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
                                  setFieldValue(
                                    "file",
                                    e.currentTarget.files[0]
                                  );
                                  setSelectedFile(e.currentTarget.files[0]);
                                }}
                              />
                            </Button>
                          </Grid>
                          <Grid item xs={2} sm={3} md={3}>
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
                          <Grid item xs={4} sm={3} md={3}>
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
                      </Box>
                      <Grid
                        container
                        spacing={{ xs: 2, sm: 15, md: 12 }}
                        columns={{ xs: 4, sm: 8, md: 12 }}
                      >
                        <Grid item xs={2}>
                          <Box pt={2} ml={2}>
                            <Typography variant="body1">
                              <FormattedMessage id="app.collection.view_collections_item_name"></FormattedMessage>
                            </Typography>
                            <TextField
                              sx={{ minWidth: { xs: 250, sm: 260 } }}
                              size="small"
                              id="name"
                              name="name"
                              multiline
                              maxRows={4}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={touched.name && Boolean(errors.name)}
                              helperText={touched.name && errors.name}
                              variant="outlined"
                              value={values.name}
                            />
                          </Box>
                        </Grid>
                        <Grid item xs={4}>
                          <Box pt={2} pl={2}>
                            <Typography variant="body1">
                              <FormattedMessage id="app.collection.view_collections_item_serie"></FormattedMessage>
                            </Typography>
                            <TextField
                              id="serie"
                              name="serie"
                              select
                              size="small"
                              sx={{ minWidth: { xs: 250, sm: 237 } }}
                              value={values.serie != null ? values.serie : ""}
                              error={touched.serie && Boolean(errors.serie)}
                              helperText={touched.serie && errors.serie}
                              onChange={(selectedOption) => {
                                let event = {
                                  target: {
                                    name: "serie",
                                    value: selectedOption,
                                  },
                                };
                                handleChange(event.target.value);
                              }}
                            >
                              {collectionSeriesList?.map((option) => {
                                return (
                                  <MenuItem key={option.id} value={option.id}>
                                    {option.name}
                                  </MenuItem>
                                );
                              })}
                            </TextField>
                          </Box>
                        </Grid>
                      </Grid>
                      <Grid item xs={2}>
                        <Box pt={2}>
                          <Typography variant="body1">
                            <FormattedMessage id="app.collection.view_collections_item_price"></FormattedMessage>
                          </Typography>
                          <TextField
                            sx={{ minWidth: { xs: 100, sm: 260 } }}
                            size="small"
                            id="price"
                            name="price"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.price && Boolean(errors.price)}
                            helperText={touched.price && errors.price}
                            variant="outlined"
                            value={values.price}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  {currency}
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box pt={2} sx={{ pl: { xs: 7.7, sm: 2.1 } }}>
                          <Typography variant="body1">
                            <FormattedMessage id="app.collection.view_collections_item_year"></FormattedMessage>
                          </Typography>
                          <TextField
                            sx={{ minWidth: { xs: 140, sm: 237 } }}
                            size="small"
                            id="year"
                            name="year"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.year && Boolean(errors.year)}
                            helperText={touched.year && errors.year}
                            variant="outlined"
                            value={values.year}
                          />
                        </Box>
                      </Grid>
                      <Grid container spacing={2}>
                        <Grid item xs={2}>
                          <Box pt={2} ml={2}>
                            <Typography variant="body1">
                              <FormattedMessage id="app.collection.view_collections_item_own"></FormattedMessage>
                            </Typography>
                            <Checkbox
                              value={own}
                              checked={own}
                              onChange={handleChangeOwn}
                            ></Checkbox>
                          </Box>
                        </Grid>
                        <Grid item xs={9}>
                          <Box pt={2} sx={{ pl: { xs: 9.8, sm: 1.3 } }}>
                            <Typography variant="body1">
                              <FormattedMessage id="app.collection.view_collections_item_date"></FormattedMessage>
                            </Typography>
                            <BasicDatePicker
                              id="date"
                              name="date"
                              label=""
                              size="small"
                              value={date}
                              error={touched.year && Boolean(errors.year)}
                              helperText={touched.year && errors.year}
                              onChange={(newValue) => {
                                setDate(newValue);
                              }}
                              renderInput={(params) => (
                                <TextField {...params} />
                              )}
                            />
                          </Box>
                        </Grid>
                      </Grid>
                      <Grid container>
                        <Grid item xs={4}>
                          <Box pt={2} ml={2}>
                            <Typography variant="body1">
                              <FormattedMessage id="app.collection.view_collections_item_notes"></FormattedMessage>
                            </Typography>
                            <TextField
                              fullWidth
                              sx={{ minWidth: { xs: 250, sm: 267 } }}
                              size="small"
                              id="notes"
                              name="notes"
                              multiline
                              maxRows={4}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              variant="outlined"
                              value={values.notes}
                            />
                          </Box>
                        </Grid>
                      </Grid>
                    </Grid>
                    {formValues.metadata.length > 0 && (
                      <Grid item xs={2}>
                        <Box pt={2}>
                          <Typography variant="body1">
                            <FormattedMessage id="app.collection.view_collections_item_metadata"></FormattedMessage>
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                    {formValues.metadata.length > 0 && (
                      <Grid
                        container
                        sx={{
                          border: 2,
                          maxWidth: { xs: "93%", sm: "32.7%" },
                        }}
                        mt={2}
                      >
                        {formValues.metadata.map((item, index) => (
                          <Grid item xs={12} key={index} pl={2}>
                            <Box pt={2} pb={2}>
                              <Typography variant="body1">
                                {item.name}
                              </Typography>
                              {checkFieldType(item)}
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    )}
                    <Box pt={2}>
                      <Grid container spacing={2}>
                        <Grid item>
                          <Button
                            variant="contained"
                            type="submit"
                            disabled={isSubmitting}
                            form="form"
                          >
                            <FormattedMessage id="app.button.accept"></FormattedMessage>
                          </Button>
                        </Grid>
                        <Grid item>
                          <Button
                            variant="contained"
                            onClick={() => navigate(-1)}
                          >
                            <FormattedMessage id="app.button.cancel"></FormattedMessage>
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>
                  </Form>
                )}
              </Formik>
            )}
          </Grid>
        </Grid>
        <URLImageDialog
          url={preview}
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
      </Box>
    )
  );
}

export default EditItem;
