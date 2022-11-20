import React, { useState, useEffect, useContext } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { FormattedMessage } from "react-intl";
import { Grid, Box, TextField, Typography, Checkbox } from "@mui/material";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import ConfigService from "../../app/api/config.api";
import { toast } from "react-toastify";
import { isValid } from "date-fns";
import { MenuItem } from "@mui/material";
import BasicDateTimePicker from "../../components/BasicDateTimePicker";
import { AppContext } from "../../components/AppContext";

const CreateEventDialog = (props) => {
  const { open, setOpen, dateClickedEvent, setReloadCreated } = props;
  //const intl = useIntl();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [allDay, setAllDay] = useState(false);
  const { userData, setUserData } = useContext(AppContext);

  useEffect(() => {
    if (open === false) {
      setStartDate(new Date());
    }
  }, [open]);

  useEffect(() => {
    if (isValid(dateClickedEvent)) {
      setStartDate(dateClickedEvent);
    }
  }, [dateClickedEvent]);

  const newEventSchema = Yup.object().shape({
    title: Yup.string().required(
      <FormattedMessage id="app.collection.add_collection_field_required"></FormattedMessage>
    ),
  });

  const handleChangeAllDay = (event) => {
    setAllDay(event.target.checked);
  };

  const submitForm = (values) => {
    //console.log(values)
    ConfigService.createEvent(values).then((response) => {
      if (response.status === 200) {
        toast.success(
          <FormattedMessage id="app.event.created"></FormattedMessage>,
          { theme: "colored" }
        );
        setReloadCreated(true);
        setOpen(false);
      }
    });
  };

  return (
    <Dialog
      open={open}
      disableEnforceFocus //Para evitar el maximum stack error
      onClose={() => setOpen(false)}
      aria-labelledby="confirm-dialog"
      style={{ maxWidth: "100%", maxHeight: "100%" }}
    >
      <DialogTitle id="confirm-dialog">
        <Typography component="p" variant="h5" align="center">
          <FormattedMessage id="app.event.create"></FormattedMessage>
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ alignItems: "center" }}>
        <Grid container item justifyContent="flex-end">
          <Formik
            initialValues={{
              userId: userData.id,
              id: "",
              title: "",
              description: "",
              allDay: "",
              start: startDate,
              end: "",
              type: "Event",
            }}
            validationSchema={newEventSchema}
            onSubmit={(values, { setSubmitting }) => {
              //const d = format(new Date(startDate), "yyyy-MM-dd");
              values.start = startDate;
              values.end = endDate;
              values.allDay = allDay;
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
                        sx={{ minWidth: { xs: 220, sm: 260 } }}
                        size="small"
                        id="title"
                        name="title"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label={
                          <FormattedMessage id="app.event.title"></FormattedMessage>
                        }
                        error={touched.title && Boolean(errors.title)}
                        helperText={touched.title && errors.title}
                        variant="outlined"
                        value={values.title}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={9}>
                    <TextField
                      id="description"
                      name="description"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      size="small"
                      sx={{ minWidth: { xs: 220, sm: 260 } }}
                      value={values.description}
                      label={
                        <FormattedMessage id="app.event.description"></FormattedMessage>
                      }
                    ></TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <Box ml={-1}>
                      <Checkbox
                        value={allDay}
                        onChange={handleChangeAllDay}
                      ></Checkbox>
                      <Typography variant="body1" display="inline">
                        <FormattedMessage id="app.event.all_day"></FormattedMessage>
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body1">
                      <FormattedMessage id="app.event.start_date"></FormattedMessage>
                    </Typography>
                    <BasicDateTimePicker
                      disablePast
                      id="dateStart"
                      name="dateStart"
                      label=""
                      size="small"
                      value={startDate}
                      error={touched.start && Boolean(errors.start)}
                      helperText={touched.start && errors.start}
                      onChange={(newValue) => {
                        setStartDate(newValue);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body1">
                      <FormattedMessage id="app.event.end_date"></FormattedMessage>
                    </Typography>
                    <BasicDateTimePicker
                      id="dateEnd"
                      name="dateEnd"
                      label=""
                      size="small"
                      value={endDate}
                      error={touched.end && Boolean(errors.end)}
                      helperText={touched.end && errors.end}
                      onChange={(newValue) => {
                        setEndDate(newValue);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </Grid>
                  <Grid item xs={9}>
                    <TextField
                      id="type"
                      name="type"
                      select
                      size="small"
                      sx={{ minWidth: { xs: 220, sm: 260 } }}
                      value={values.type}
                      label={
                        <FormattedMessage id="app.license.type"></FormattedMessage>
                      }
                      onChange={handleChange}
                    >
                      <MenuItem key="1" value="Event">
                        <FormattedMessage id="app.event.event"></FormattedMessage>
                      </MenuItem>
                      <MenuItem key="2" value="Reminder">
                        <FormattedMessage id="app.event.reminder"></FormattedMessage>
                      </MenuItem>
                    </TextField>
                  </Grid>
                  <DialogActions>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      form="form"
                      variant="contained"
                    >
                      <FormattedMessage id="app.button.accept"></FormattedMessage>
                    </Button>
                    <Button variant="contained" onClick={() => setOpen(false)}>
                      <FormattedMessage id="app.button.cancel"></FormattedMessage>
                    </Button>
                  </DialogActions>
                </Grid>
              </Form>
            )}
          </Formik>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
export default CreateEventDialog;
