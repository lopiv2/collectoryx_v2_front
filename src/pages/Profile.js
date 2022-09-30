import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";
import { Formik, Field, Form, ErrorMessage } from 'formik'
import { Box } from "@mui/material";
import { Grid } from "@mui/material";
import ConfigService from "../app/api/config.api";
import "../styles/Dashboard.css";
import { ToastContainer, toast } from "react-toastify";
import * as Yup from "yup";
import { AppContext } from "../components/AppContext";
import { Avatar, Button, Checkbox, TextField } from "@mui/material";

function Profile() {
  const intl = useIntl();
  const [value, setValue] = useState("1");
  const [formValues, setFormValues] = useState(null);
  const { userData, setUserData } = React.useContext(AppContext);
  const [userDetails, setUserDetails] = useState(null);

  const handleChangeColor = (value, set) => {
    set(value);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    ConfigService.getUserDetails(userData.id)
      .then((response) => {
        setUserDetails(response.data)
        //console.log(response.data)
      })
  }, [])

  useEffect(() => {
    if (userDetails !== null) {
      const data = {
        id: userDetails.id,
        userName: userDetails.userName,
        email: userDetails.email,
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        password: userDetails.password,
      };
      setFormValues(data);
    }
  }, [userDetails]);

  const required = intl.formatMessage({ id: 'app.signin.required' });

  const validationSchema = Yup.object().shape({
    userName: Yup.string().min(3, "It's too short").required(required),
    email: Yup.string().email("Enter valid email").required(required),
    firstName: Yup.string().min(3, "It's too short").required(required),
    lastName: Yup.string().min(3, "It's too short").required(required),
    password: Yup.string().min(8, "Password minimum length should be 8").required(required),
  })

  useEffect(() => {
    const modif = JSON.stringify(userData);
    localStorage.setItem("user", modif);
  }, [userData]);

  const onSubmit = async (values) => {
    const user = {
      userName: values.userName,
      email: values.email,
    };
    //console.log(user.token);
    ConfigService.updateProfile(values).then((response) => {
      //console.log(response.data)
      if (response.status === 200) {
        toast.success(
          <FormattedMessage id="app.config.saved"></FormattedMessage>,
          { theme: "colored" }
        );
        setUserData((previous) => ({
          ...previous,
          userName: values.userName,
          email: values.email
        }));
      }
      else {
        toast.error(response.data.message, { theme: "colored" });
      }
    })
  };


  const newItemSchema = Yup.object().shape({
    name: Yup.string()
      .min(
        5,
        intl.formatMessage({
          id: "app.form.too_short",
        })
      )
      .max(
        50,
        intl.formatMessage({
          id: "app.form.too_long",
        })
      )
      .required(
        <FormattedMessage id="app.collection.add_collection_field_required"></FormattedMessage>
      ),
  });

  return (
    <Box>
      <ToastContainer autoClose={2000} />
      <Grid container justifyContent="flex-end">
        <Grid item xs={12}>
          <Typography variant="h4" component="h4">
            <FormattedMessage id="app.sidemenu.my_account" ></FormattedMessage>
          </Typography>
        </Grid>
      </Grid>
      <Grid container pt={2}>
        <Grid>
          <Avatar name={userData.userName} size={5} round="200px" sx={{ width: 150, height: 150 }} >
            <Typography variant="h3">
              {userData.userName.charAt(0).toUpperCase()}
            </Typography>
          </Avatar>
          {formValues && (<Formik initialValues={formValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            {(props) => (
              <Form>
                <Grid sx={{ minWidth: 400 }} pt={2}>
                  <Field as={TextField} fullWidth name="email" label={
                    <FormattedMessage id="app.signup.fields.email"></FormattedMessage>}
                    placeholder="Enter your email" helperText={<ErrorMessage name="email" />} />
                </Grid>
                <Grid pt={2}>
                  <Field as={TextField} fullWidth name="firstName" label={
                    <FormattedMessage id="app.signup.fields.first_name"></FormattedMessage>}
                    placeholder="Enter your first name" helperText={<ErrorMessage name="firstName" />} />
                </Grid>
                <Grid pt={2}>
                  <Field as={TextField} fullWidth name="lastName" label={
                    <FormattedMessage id="app.signup.fields.last_name"></FormattedMessage>}
                    placeholder="Enter your last name" helperText={<ErrorMessage name="lastName" />} />
                </Grid>
                <Grid pt={2}>
                  <Field as={TextField} fullWidth name='password' type="password"
                    label={
                      <FormattedMessage id="app.signup.fields.password"></FormattedMessage>} placeholder="Enter your password"
                    helperText={<ErrorMessage name="password" />} />
                </Grid>
                <Grid container pt={2}>
                  <Grid item xs={10} md={8} lg={4}>
                    <Button type='submit' variant='contained' disabled={props.isSubmitting}
                      color='primary'>{props.isSubmitting ? "Loading" : <FormattedMessage id="app.button.edit"></FormattedMessage>}</Button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>)}
        </Grid>
      </Grid>
    </Box>
  );
}

export default Profile;
