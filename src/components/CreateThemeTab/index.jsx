import React, { useState } from "react";
import { Typography } from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";
import { Box } from "@mui/material";
import { Grid } from "@mui/material";
import { Paper } from "@mui/material";
import { Button } from "@mui/material";
import { TextField } from "@mui/material";
import ConfigService from "../../app/api/config.api";
import { ColorPicker, createColor } from "material-ui-color";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import ThemeTemplate from "../ThemeFiller";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../AppContext";

function CreateThemeTab() {
  const [primaryColor, setPrimaryColor] = useState(createColor("#000"));
  const [secondaryColor, setSecondaryColor] = useState(createColor("#000"));
  const [sidebarColor, setSidebarColor] = useState(createColor("#fff"));
  const [topbarColor, setTopbarColor] = useState(createColor("#2f7cffff"));
  const [listItemColor, setListItemColor] = useState(createColor("#000"));
  const [backColor, setBackColor] = useState(createColor("#fff"));
  const navigate = useNavigate();
  const intl = useIntl();
  const { userData} =
    React.useContext(AppContext); 

  const handleChangeColor = (value, set) => {
    set(value);
  };

  const submitForm = (values) => {
    //console.log(values);
    ConfigService.createTheme(userData.id, values).then((response) => {
      if (response.status === 200) {
        navigate(0);
        toast.success(
          <FormattedMessage id="app.collection.item-created"></FormattedMessage>,
          { theme: "colored" }
        );
      }
    });
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
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h6" component="h5">
          <FormattedMessage id="app.config.appearance_create_theme"></FormattedMessage>
        </Typography>
        <Box sx={{ width: 2 }}>
          <ThemeTemplate
            sx={{ fontSize: 200 }}
            primarycolor={primaryColor}
            secondarycolor={secondaryColor}
            topbarcolor={topbarColor}
            sidebarcolor={sidebarColor}
            listitemcolor={listItemColor}
            backcolor={backColor}
          ></ThemeTemplate>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            "& > :not(style)": {
              m: 1,
              width: "auto",
              height: "auto",
            },
          }}
        >
          <Formik
            initialValues={{
              name: "",
              primary: "",
              secondary: "",
              sidebar: "",
              topbar: "",
              listItem: "",
              image: "",
              backColor: "",
            }}
            validationSchema={newItemSchema}
            onSubmit={(values, { setSubmitting }) => {
              values.primary = primaryColor;
              values.secondary = secondaryColor;
              values.sidebar = sidebarColor;
              values.topbar = topbarColor;
              values.listItem = listItemColor;
              values.backColor = backColor;
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
                <Paper elevation={1}>
                  <Grid container justifyContent="space-between">
                    <Grid item mt={1} ml={1}>
                      <Typography variant="body2" component="h5">
                        <FormattedMessage id="app.config.appearance_create_theme.name"></FormattedMessage>
                      </Typography>
                    </Grid>
                    <Grid item>
                      <TextField
                        variant="standard"
                        id="name"
                        name="name"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.name && Boolean(errors.name)}
                        helperText={touched.name && errors.name}
                        value={values.name}
                      />
                    </Grid>
                  </Grid>
                  <Grid container justifyContent="space-between">
                    <Grid item mt={1} ml={1}>
                      <Typography variant="body2" component="h5">
                        <FormattedMessage id="app.config.appearance_create_theme.primary_text"></FormattedMessage>
                      </Typography>
                    </Grid>
                    <Grid item>
                      <ColorPicker
                        value={primaryColor}
                        onChange={(e) => handleChangeColor(e, setPrimaryColor)}
                      />
                    </Grid>
                  </Grid>
                  <Grid container justifyContent="space-between">
                    <Grid item mt={1} ml={1}>
                      <Typography variant="body2" component="h5">
                        <FormattedMessage id="app.config.appearance_create_theme.secondary_text"></FormattedMessage>
                      </Typography>
                    </Grid>
                    <Grid item>
                      <ColorPicker
                        value={secondaryColor}
                        onChange={(e) =>
                          handleChangeColor(e, setSecondaryColor)
                        }
                      />
                    </Grid>
                  </Grid>
                  <Grid container justifyContent="space-between">
                    <Grid item mt={1} ml={1}>
                      <Typography variant="body2" component="h5">
                        <FormattedMessage id="app.config.appearance_create_theme.side_bar"></FormattedMessage>
                      </Typography>
                    </Grid>
                    <Grid item>
                      <ColorPicker
                        value={sidebarColor}
                        onChange={(e) => handleChangeColor(e, setSidebarColor)}
                      />
                    </Grid>
                  </Grid>
                  <Grid container justifyContent="space-between">
                    <Grid item mt={1} ml={1}>
                      <Typography variant="body2" component="h5">
                        <FormattedMessage id="app.config.appearance_create_theme.top_bar"></FormattedMessage>
                      </Typography>
                    </Grid>
                    <Grid item>
                      <ColorPicker
                        value={topbarColor}
                        onChange={(e) => handleChangeColor(e, setTopbarColor)}
                      />
                    </Grid>
                  </Grid>
                  <Grid container justifyContent="space-between">
                    <Grid item mt={1} ml={1}>
                      <Typography variant="body2" component="h5">
                        <FormattedMessage id="app.config.appearance_create_theme.list_item"></FormattedMessage>
                      </Typography>
                    </Grid>
                    <Grid item>
                      <ColorPicker
                        value={listItemColor}
                        onChange={(e) => handleChangeColor(e, setListItemColor)}
                      />
                    </Grid>
                  </Grid>
                  <Grid container justifyContent="space-between">
                    <Grid item mt={1} ml={1}>
                      <Typography variant="body2" component="h5">
                        <FormattedMessage id="app.config.appearance_create_theme.back_image"></FormattedMessage>
                      </Typography>
                    </Grid>
                    <Grid item>
                      <TextField variant="standard" value={values.image} />
                    </Grid>
                  </Grid>
                  <Grid container justifyContent="space-between">
                    <Grid item mt={1} ml={1}>
                      <Typography variant="body2" component="h5">
                        <FormattedMessage id="app.config.appearance_create_theme.back_color"></FormattedMessage>
                      </Typography>
                    </Grid>
                    <Grid item>
                      <ColorPicker
                        value={backColor}
                        onChange={(e) => handleChangeColor(e, setBackColor)}
                      />
                    </Grid>
                  </Grid>
                </Paper>
                <Grid item mt={1}>
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={isSubmitting}
                    form="form"
                  >
                    <FormattedMessage id="app.button.create"></FormattedMessage>
                  </Button>
                </Grid>
              </Form>
            )}
          </Formik>
        </Box>
      </Grid>
    </Grid>
  );
}

export default CreateThemeTab;
