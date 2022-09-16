import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
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
import { format, set } from "date-fns";
import ImageGalleryDialog from "../components/ImageGalleryDialog";
import { isUndefined } from "lodash";

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

  useEffect(() => {
    if (location.state !== null) {
      setCollectionId(location.state.id)
    }
    else{
      console.log(location.state)
    }
    //setCollectionId(location.state.id)
    
  }, [location])

  const handleChangeOwn = (event) => {
    setOwn(event.target.checked);
  };

  const handleImageClick = () => {
    setPreview(require("../../public/images/" + img));
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
    let newItems = [...metadataValues];
    metadataValues[index].value = val;
    setMetadataValues(newItems);
  };

  const checkFieldType = (field) => {
    switch (field.type) {
      case "BOOLEAN":
        var check = true;
        if (field.value === 1 || field.value === true) {
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
            sx={{ minWidth: 300 }}
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
            sx={{ minWidth: 300 }}
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
      const collectionSeries = ConfigService.getCollectionSeries(collectionId)
        .then((response) => {
          //console.log(response.data)
          setCollectionSeriesList(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [collectionId]);

  useEffect(() => {
    if (location.state != null) {
      const data = {
        id: location.state.item.id,
        name: location.state.item.name,
        serie: location.state.item.serie ? location.state.item.serie.id : null,
        price: location.state.item.price,
        year: location.state.item.year,
        adquiringDate: date,
        own: location.state.item.own,
        image: "",
        notes: location.state.item.notes,
        metadata: location.state.item.metadata,
      };
      setMetadataValues(location.state.item.metadata);
      setFormValues(data);
    }
  }, [location.state]);

  const submitForm = (values) => {
    //console.log(values);
    //Tiene imagen seteada ya en la BBDD y la actualizamos desde galeria de imagenes sin subir nada
    if (preview !== undefined && imgGallerySelected === true) {
      ConfigService.updateItem(
        values,
        location.state.id,
        img,
        values.metadata
      ).then((response) => {
        if (response.status === 200) {
          toast.success(
            <FormattedMessage id="app.collection.item-edited"></FormattedMessage>,
            { theme: "colored" }
          );
          setTimeout(() => {
            navigate(-1);
          }, 3000);
        }
      });
    }
    //Tiene imagen seteada ya en la BBDD y no la actualizamos
    if (
      preview !== undefined &&
      values.file === undefined &&
      imgGallerySelected === false
    ) {
      ConfigService.updateItem(
        values,
        location.state.id,
        location.state.item.image.path,
        values.metadata
      ).then((response) => {
        if (response.status === 200) {
          toast.success(
            <FormattedMessage id="app.collection.item-edited"></FormattedMessage>,
            { theme: "colored" }
          );
          setTimeout(() => {
            navigate(-1);
          }, 3000);
        }
      });
    }
    //Si no tiene imagen seteada y no actualizamos dicha imagen
    if (preview === undefined && values.file === undefined) {
      ConfigService.updateItem(
        values,
        location.state.id,
        null,
        values.metadata
      ).then((response) => {
        if (response.status === 200) {
          toast.success(
            <FormattedMessage id="app.collection.item-edited"></FormattedMessage>,
            { theme: "colored" }
          );
          setTimeout(() => {
            navigate(-1);
          }, 3000);
        }
      });
    }
    //Si se actualiza la imagen, sea la que sea
    if (values.file !== undefined) {
      ConfigService.putImage(values.name, values.file).then((response) => {
        if (response.data.path) {
          //console.log(preview)
          //console.log(response.data.path)
          ConfigService.updateItem(
            values,
            location.state.id,
            response.data.path,
            values.metadata
          ).then((responseItem) => {
            if (response.status === 200 && responseItem.status === 200) {
              toast.success(
                <FormattedMessage id="app.collection.item-edited"></FormattedMessage>,
                { theme: "colored" }
              );
              setTimeout(() => {
                navigate(-1);
              }, 3000);
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
    if (location.state != null) {
      if (location.state.item.image) {
        setPreview(
          require("../../public/images/" + location.state.item.image.path)
        );
      }
      setOwn(location.state.item.own);
      const dateFormatPickup = new Date(location.state.item.adquiringDate);
      setDate(dateFormatPickup);
    }

  }, [location.state]);

  const newItemSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required(
        <FormattedMessage id="app.collection.add_collection_field_required"></FormattedMessage>
      ),
    serie: Yup.string().required(
      <FormattedMessage id="app.collection.add_collection_field_required"></FormattedMessage>
    ),
    price: Yup.number()
      .moreThan(
        0,
        <FormattedMessage id="app.collection.add_item_number_positive"></FormattedMessage>
      )
      .required(
        <FormattedMessage id="app.collection.add_collection_field_required"></FormattedMessage>
      ),
    year: Yup.number()
      .moreThan(
        1899,
        <FormattedMessage id="app.collection.add_item_year_1900"></FormattedMessage>
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
    /*adquiringDate: Yup.date()
            .required(<FormattedMessage id="app.collection.add_collection_field_required"></FormattedMessage>),*/
  });
  //console.log(location.state.item)
  return location.state !== null && (
    <Box sx={{ display: "flex" }}>
      <ToastContainer autoClose={2000} />
      <Grid container>
        <Grid item xs={6}>
          <Typography variant="h5" component="h5">
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
                values.adquiringDate = d;
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
                          maxHeight: 300,
                          maxWidth: 400,
                        }}
                        alt="Logo"
                        src={preview ? preview : NoImage}
                      ></Box>
                    </Grid>
                    <Box ml={2}>
                      <Grid container spacing={2}>
                        <Grid item>
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
                              id: "app.tooltip.search_google",
                            })}
                            placement="right"
                            arrow
                          >
                            <Button
                              color="primary"
                              variant="contained"
                              onClick={(e) => {
                                console.log(e);
                              }}
                            >
                              <GoogleIcon></GoogleIcon>
                            </Button>
                          </Tooltip>
                        </Grid>
                      </Grid>
                    </Box>
                    <Grid container spacing={40}>
                      <Grid item xs={2}>
                        <Box pt={2} ml={2}>
                          <Typography variant="body1">
                            <FormattedMessage id="app.collection.view_collections_item_name"></FormattedMessage>
                          </Typography>
                          <TextField
                            sx={{ minWidth: 300 }}
                            size="small"
                            id="name"
                            name="name"
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
                        <Box pt={2}>
                          <Typography variant="body1">
                            <FormattedMessage id="app.collection.view_collections_item_serie"></FormattedMessage>
                          </Typography>
                          <TextField
                            id="serie"
                            name="serie"
                            select
                            size="small"
                            sx={{ minWidth: 300 }}
                            value={values.serie!=null ? values.serie : ""}
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
                          sx={{ minWidth: 300 }}
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
                    <Grid item xs={3}>
                      <Box pt={2} ml={4.7}>
                        <Typography variant="body1">
                          <FormattedMessage id="app.collection.view_collections_item_year"></FormattedMessage>
                        </Typography>
                        <TextField
                          sx={{ minWidth: 300 }}
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
                      <Grid item xs={2}>
                        <Box pt={2} pl={6.5}>
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
                            renderInput={(params) => <TextField {...params} />}
                          />
                        </Box>
                      </Grid>
                    </Grid>
                    <Grid container>
                      <Grid item xs={4.65}>
                        <Box pt={2} ml={2}>
                          <Typography variant="body1">
                            <FormattedMessage id="app.collection.view_collections_item_notes"></FormattedMessage>
                          </Typography>
                          <TextField
                            fullWidth
                            sx={{ minWidth: 300 }}
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
                  {formValues.metadata.length > 0 && (<Grid item xs={2}>
                    <Box pt={2}>
                      <Typography variant="body1">
                        <FormattedMessage id="app.collection.view_collections_item_metadata"></FormattedMessage>
                      </Typography>
                    </Box>
                  </Grid>)}
                  {formValues.metadata.length > 0 && (
                    <Grid
                      container
                      sx={{ border: 2 }}
                      mt={2}
                      style={{ maxWidth: "38%" }}
                    >
                      {formValues.metadata.map((item, index) => (
                        <Grid item xs={12} key={index} pl={2}>
                          <Box pt={2} pb={2}>
                            <Typography variant="body1">{item.name}</Typography>
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
  );
}

export default EditItem;
