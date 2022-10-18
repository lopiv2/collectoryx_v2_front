import React from "react";
import {
  Grid,
  Paper,
  Avatar,
  Typography,
  TextField,
  Button,
} from "@material-ui/core";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { FormHelperText } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import AuthService from "../../app/api/auth.api";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useIntl, FormattedMessage } from "react-intl";
const Signup = () => {
  const paperStyle = { padding: 20, width: 300, margin: "0 auto" };
  const intl = useIntl();
  const headerStyle = { margin: 0 };
  const avatarStyle = { backgroundColor: "#1bbd7e" };
  const marginTop = { marginTop: 5 };
  const navigate = useNavigate();
  const initialValues = {
    userName: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    termsAndConditions: false,
  };
  const required = intl.formatMessage({ id: "app.signin.required" });
  const validationSchema = Yup.object().shape({
    userName: Yup.string().min(1, "It's too short").required(required),
    email: Yup.string().email("Enter valid email").required(required),
    firstName: Yup.string().min(1, "It's too short").required(required),
    lastName: Yup.string().min(1, "It's too short").required(required),
    password: Yup.string()
      .min(8, "Password minimum length should be 8")
      .required(required),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Password not matched")
      .required(required),
    termsAndConditions: Yup.string().oneOf(
      ["true"],
      intl.formatMessage({ id: "app.signup.fields.terms" })
    ),
  });
  const onSubmit = async (values, props) => {
    //console.log(values)
    //console.log(props)
    AuthService.register(
      values.firstName,
      values.lastName,
      values.email,
      values.userName,
      values.password
    ).then((response) => {
      //console.log(response.data)
      if (response.data.error === false) {
        toast.success(intl.formatMessage({ id: "app.signup.account_created" }), { theme: "colored" });
        setTimeout(() => {
          props.resetForm();
          props.setSubmitting(false);
          navigate("/login");
        }, 2000);
      } else {
        if (response.data.message.includes("Email already exists")) {
          toast.error(intl.formatMessage({ id: "app.signup.mail_exists" }), { theme: "colored" });
        }
        if (response.data.message.includes("Username already exists")) {
          toast.error(intl.formatMessage({ id: "app.signup.username_exists" }), { theme: "colored" });
        }
      }
    });
  };

  const onClickCancel = () => {
    navigate("/login");
  };
  return (
    <Grid p={2}>
      <Paper style={paperStyle}>
        <Grid align="center">
          <Avatar style={avatarStyle}>
            <AddCircleOutlineOutlinedIcon />
          </Avatar>
          <h2 style={headerStyle}>
            <FormattedMessage id="app.signup"></FormattedMessage>
          </h2>
          <Typography variant="caption" gutterBottom>
            <FormattedMessage id="app.signup.title"></FormattedMessage>
          </Typography>
        </Grid>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {(props) => (
            <Form>
              <Field
                as={TextField}
                fullWidth
                name="userName"
                label={
                  <FormattedMessage id="app.signup.fields.name"></FormattedMessage>
                }
                placeholder="Enter your name"
                helperText={
                  <ErrorMessage style={{ color: "red" }} name="userName" />
                }
              />
              <Field
                as={TextField}
                fullWidth
                name="email"
                label={
                  <FormattedMessage id="app.signup.fields.email"></FormattedMessage>
                }
                placeholder="Enter your email"
                helperText={<ErrorMessage name="email" />}
              />
              <Field
                as={TextField}
                fullWidth
                name="firstName"
                label={
                  <FormattedMessage id="app.signup.fields.first_name"></FormattedMessage>
                }
                placeholder="Enter your first name"
                helperText={<ErrorMessage name="firstName" />}
              />
              <Field
                as={TextField}
                fullWidth
                name="lastName"
                label={
                  <FormattedMessage id="app.signup.fields.last_name"></FormattedMessage>
                }
                placeholder="Enter your last name"
                helperText={<ErrorMessage name="lastName" />}
              />
              <Field
                as={TextField}
                fullWidth
                name="password"
                type="password"
                label={
                  <FormattedMessage id="app.signup.fields.password"></FormattedMessage>
                }
                placeholder="Enter your password"
                helperText={<ErrorMessage name="password" />}
              />
              <Field
                as={TextField}
                fullWidth
                name="confirmPassword"
                type="password"
                label={
                  <FormattedMessage id="app.signup.fields.confirm_password"></FormattedMessage>
                }
                placeholder="Confirm your password"
                helperText={<ErrorMessage name="confirmPassword" />}
              />
              <FormControlLabel
                control={<Field as={Checkbox} name="termsAndConditions" />}
                label={
                  <FormattedMessage id="app.signup.fields.terms"></FormattedMessage>
                }
              />
              <FormHelperText>
                <ErrorMessage name="termsAndConditions" />
              </FormHelperText>
              <Grid container spacing={5} ml={1}>
                <Grid item xs={10} md={8} lg={4}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={props.isSubmitting}
                    color="primary"
                  >
                    {props.isSubmitting ? (
                      "Loading"
                    ) : (
                      <FormattedMessage id="app.signup"></FormattedMessage>
                    )}
                  </Button>
                </Grid>
                <Grid item xs={10} md={8} lg={4}>
                  <Button
                    onClick={onClickCancel}
                    variant="contained"
                    disabled={props.isSubmitting}
                    color="secondary"
                  >
                    {props.isSubmitting ? "Loading" : "Cancel"}
                  </Button>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Paper>
    </Grid>
  );
};

export default Signup;
