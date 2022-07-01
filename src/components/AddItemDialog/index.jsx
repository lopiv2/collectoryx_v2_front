import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { FormattedMessage } from "react-intl";
import { Grid, Box, TextField, MenuItem, Typography } from "@mui/material";
import * as Yup from 'yup';
import NoImage from "../../images/no-photo-available.png";
import ConfigService from '../../app/api/config.api';

const AddItemDialog = (props) => {
    const [selectedFile, setSelectedFile] = useState("")
    const [preview, setPreview] = useState()
    const { title, open, setOpen, onConfirm } = props;
    const [serie, setSerie] = useState("New");

    const handleChangeSerie = (event) => {
        setSerie(event.target.value);
    };

    const newItemSchema = Yup.object().shape({
        name: Yup.string()
            .min(2, 'Too Short!')
            .max(50, 'Too Long!')
            .required(<FormattedMessage id="app.collection.add_collection_field_required"></FormattedMessage>),
        serie: Yup.string()
            .required(<FormattedMessage id="app.collection.add_collection_field_required"></FormattedMessage>),
        price: Yup.number()
            .moreThan(0, <FormattedMessage id="app.collection.add_item_number_positive"></FormattedMessage>)
            .required(<FormattedMessage id="app.collection.add_collection_field_required"></FormattedMessage>),
        year: Yup.number()
            .moreThan(1899, <FormattedMessage id="app.collection.add_item_year_1900"></FormattedMessage>)
            .min(4, <FormattedMessage id="app.collection.add_item_year_4digits"></FormattedMessage>)
            .max(4, <FormattedMessage id="app.collection.add_item_year_4digits"></FormattedMessage>)
            .required(<FormattedMessage id="app.collection.add_collection_field_required"></FormattedMessage>),
        adquiring_date: Yup.date()
            .required(<FormattedMessage id="app.collection.add_collection_field_required"></FormattedMessage>),
    });

    const submitForm = (values) => {
        console.log(values);
        /*if (values.file === undefined) {
          ConfigService.createCollection(values.name, values.template, null, values.metadata).then((response) => {
            if (response.status === 200) {
              toast.success(<FormattedMessage id="app.collection.created"></FormattedMessage>, { theme: "colored" });
              setTimeout(() => {
                navigate("/");
              }, 3000)
            }
          });
        }
        else {
          ConfigService.putImage(values.name, values.file).then((response) => {
            ConfigService.createCollection(values.name, values.template, response.data.path, values.metadata);
            if (response.status === 200) {
              toast.success(<FormattedMessage id="app.collection.created"></FormattedMessage>, { theme: "colored" });
              setTimeout(() => {
                navigate("/");
              }, 3000)
            }
            //console.log(response);
          });
        }*/

    };

    return (
        <Dialog
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="confirm-dialog"
        >
            <DialogTitle id="confirm-dialog">{title}</DialogTitle>
            <DialogContent>
                <Grid container>
                    <Grid>
                        <Formik
                            initialValues={{
                                name: "",
                                serie: "",
                                price: "",
                                year: "",
                                adquiring_date: "",
                                own: false,
                                image: "",
                                notes: "",
                                metadata: []
                            }}
                            validationSchema={newItemSchema}
                            onSubmit={(values, { setSubmitting }) => {
                                {

                                }
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
                                                    id="name"
                                                    name="name"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    error={touched.name && Boolean(errors.name)}
                                                    helperText={touched.name && errors.name}
                                                    label={<FormattedMessage id="app.collection.view_collections_item_name"></FormattedMessage>}
                                                    variant="outlined"
                                                    value={values.name} />
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} >
                                            <TextField
                                                id="demo-simple-select"
                                                name="template"
                                                select
                                                size="small"
                                                sx={{ minWidth: 300 }}
                                                defaultValue={"hola"}
                                                value={values.serie}
                                                label={<FormattedMessage id="app.collection.view_collections_item_serie"></FormattedMessage>}
                                                onChange={handleChangeSerie}
                                            >
                                                {/*OptionsService.createCollectionOptions?.map(option => {
                                                    return (
                                                        <MenuItem key={option.value} value={option.value}>
                                                            {option.label ?? option.value}
                                                        </MenuItem>
                                                    );
                                                })*/}
                                            </TextField>
                                        </Grid>
                                        <Grid item xs={12} >
                                            <TextField
                                                sx={{ minWidth: 300 }}
                                                size="small"
                                                id="name"
                                                name="name"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={touched.name && Boolean(errors.name)}
                                                helperText={touched.name && errors.name}
                                                label={<FormattedMessage id="app.collection.view_collections_item_price"></FormattedMessage>}
                                                variant="outlined"
                                                value={values.name} />
                                        </Grid>
                                        <Grid item xs={2}>
                                            <Box pt={8} >
                                                <Grid item xs={6} >
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
                                            </Box>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <Box pt={8.2} ml={9} >
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
                                        <Grid item xs={5}>
                                            <Box
                                                pt={0}
                                                ml={2}
                                                component="img"
                                                sx={{
                                                    height: 150,
                                                    width: 350,
                                                }}
                                                alt="Logo"
                                                src={preview ? preview : NoImage}
                                            >
                                            </Box>
                                        </Grid>
                                        <Grid item xs={8}>

                                        </Grid>
                                    </Grid>
                                </Form>
                            )}
                        </Formik>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    onClick={() => {
                        setOpen(false);
                        onConfirm();
                    }}
                >
                    <FormattedMessage id="app.button.accept"></FormattedMessage>
                </Button>
                <Button variant="contained" onClick={() => setOpen(false)}>
                    <FormattedMessage id="app.button.cancel"></FormattedMessage>
                </Button>
            </DialogActions>
        </Dialog>
    );
};
export default AddItemDialog;