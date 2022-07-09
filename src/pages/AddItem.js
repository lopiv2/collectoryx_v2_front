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
import { parseISO, format } from "date-fns";
import ImageGalleryDialog from "../components/ImageGalleryDialog";

const localeMap = {
  en: enLocale,
  es: esLocale,
};

function AddItem(props) {
  const [date, setDate] = useState(new Date());
  const [own, setOwn] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");
  const [preview, setPreview] = useState();
  const navigate = useNavigate();
  const intl = useIntl();
  const [fields, setFields] = useState([]);
  const [collectionSeriesList, setCollectionSeriesList] = useState([]);
  const location = useLocation();
  const currency = GetCurrencySymbolLocale();
  const [locale, setLocale] = React.useState("es");
  const [confirmOpenGallery, setConfirmOpenGallery] = useState(false);
  const [img, setImg] = useState();
  const [imgGallerySelected, setImgGallerySelected] = useState(false);

  const handleChangeOwn = (event) => {
    setOwn(event.target.checked);
  };

  const handleImageClick = () => {
    setPreview(require("../../../images/" + img));
    setImgGallerySelected(true);
  };

  useEffect(() => {
    const collectionSeries = ConfigService.getCollectionSeries(
      location.state.id
    )
      .then((response) => {
        setCollectionSeriesList(response.data);
        //console.log(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const submitForm = (values) => {
    //console.log(values)
    //Si se sube imagen desde la galeria
    if (imgGallerySelected === true) {
        console.log("gallery")
        console.log(imgGallerySelected)
      ConfigService.createItem(
        values,
        location.state.id,
        img,
        values.metadata
      ).then((response) => {
        if (response.status === 200) {
          toast.success(
            <FormattedMessage id="app.collection.item-created"></FormattedMessage>,
            { theme: "colored" }
          );
          setTimeout(() => {
            navigate(-1);
          }, 3000);
        }
      });
    }
    //Si no se sube imagen
    if (values.file === undefined && imgGallerySelected === false) {
      ConfigService.createItem(
        values,
        location.state.id,
        null,
        values.metadata
      ).then((response) => {
        if (response.status === 200) {
          toast.success(
            <FormattedMessage id="app.collection.item-created"></FormattedMessage>,
            { theme: "colored" }
          );
          setTimeout(() => {
            navigate(-1);
          }, 3000);
        }
      });
    }
    //Si se sube imagen nueva y no de galeria
    if (values.file !== undefined && imgGallerySelected === false) {
      ConfigService.putImage(values.name, values.file).then((response) => {
        ConfigService.createItem(
          values,
          location.state.id,
          response.data.path,
          values.metadata
        );
        if (response.status === 200) {
          toast.success(
            <FormattedMessage id="app.collection.item-created"></FormattedMessage>,
            { theme: "colored" }
          );
          setTimeout(() => {
            navigate(-1);
          }, 3000);
        }
        //console.log(response);
      });
    }
  };

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    setImgGallerySelected(false);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

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

  return (
    <Box sx={{ display: "flex" }}>
      <ToastContainer autoClose={2000} />
      <Grid container>
        <Grid item xs={6}>
          <Typography variant="h5" component="h5">
            <FormattedMessage id="app.button.add_new_item"></FormattedMessage>
            {location.state.name}
          </Typography>
        </Grid>
        <Grid>
          <Formik
            initialValues={{
              name: "",
              serie: "",
              price: "",
              year: "",
              adquiringDate: date,
              own: "",
              image: "",
              notes: "",
              metadata: [],
            }}
            validationSchema={newItemSchema}
            onSubmit={(values, { setSubmitting }) => {
              {
              }
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
              <Form onSubmit={handleSubmit} id="form">
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
                          value={values.serie}
                          error={touched.serie && Boolean(errors.serie)}
                          helperText={touched.serie && errors.serie}
                          onChange={(selectedOption) => {
                            let event = {
                              target: { name: "serie", value: selectedOption },
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
                          //value={values.adquiringDate}
                          value={date}
                          error={touched.year && Boolean(errors.year)}
                          helperText={touched.year && errors.year}
                          /*onChange={selectedOption => {
                                                        let event = { target: { name: 'date', value: selectedOption } }
                                                        console.log(selectedOption);
                                                        handleChange(event.target.value)
                                                    }}*/
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
                      <Button variant="contained" onClick={() => navigate(-1)}>
                        <FormattedMessage id="app.button.cancel"></FormattedMessage>
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Form>
            )}
          </Formik>
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

export default AddItem;
