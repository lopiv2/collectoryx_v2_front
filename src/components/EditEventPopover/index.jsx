import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import { FormattedMessage } from "react-intl";
import {
  Grid,
  Box,
  TextField,
  Typography,
  MenuItem,
  Checkbox,
} from "@mui/material";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import ConfigService from "../../app/api/config.api";
import { isUndefined } from "lodash";
import { toast } from "react-toastify";
import { Popover } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import BasicDateTimePicker from "../../components/BasicDateTimePicker";
import { IconButton } from "@mui/material";
import { format } from "date-fns";
import { SetLocaleDateTime } from "../../utils/generic";

const EditEventPopover = (props) => {
  const {
    id,
    open,
    anchorEl,
    setAnchorEl,
    onClose,
    event,
    setConfirmOpen,
    setOpen,
  } = props;
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [allDay, setAllDay] = useState();
  const [editable, setEditable] = useState(false);
  const [arrowRef, setArrowRef] = useState(null);
  const loc = SetLocaleDateTime();

  const handleChangeAllDay = (event) => {
    setAllDay(event.target.checked);
  };

  useEffect(() => {
    if (!isUndefined(event)) {
      setStartDate(event.start);
      setEndDate(event.end);
      setAllDay(event.allDay);
    }
  }, [event]);

  const newEventSchema = Yup.object().shape({
    title: Yup.string().required(
      <FormattedMessage id="app.collection.add_collection_field_required"></FormattedMessage>
    ),
  });

  const submitForm = (values) => {
    ConfigService.updateEvent(values).then((response) => {
      if (response.status === 200) {
        toast.success(
          <FormattedMessage id="app.event.edited"></FormattedMessage>,
          { theme: "colored" }
        );
        setEditable(false);
        setAnchorEl(null);
        setOpen(true);
      }
    });
  };

  return (
    !isUndefined(event) && (
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        PaperProps={{
          style: { width: editable ? "25%" : "15%" },
        }}
        modifiers={[
          {
            name: "arrow",
            enabled: true,
            options: {
              element: arrowRef,
            },
          },
        ]}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row-reverse",
          }}
        >
          <IconButton onClick={() => setAnchorEl(null)}>
            <CloseIcon />
          </IconButton>
          {editable === false && (
            <IconButton
              onClick={() => {
                setConfirmOpen(true);
              }}
            >
              <DeleteIcon />
            </IconButton>
          )}
          {editable === false && (
            <IconButton onClick={() => setEditable(true)}>
              <EditIcon />
            </IconButton>
          )}
        </Box>
        <Grid item xs={3} ml={2}>
          <Formik
            initialValues={{
              id: event.id,
              title: event.title,
              description: event.extendedProps
                ? event.extendedProps.description
                : null,
              allDay: event.allDay,
              start: event.start,
              end: event.end,
              type: event.extendedProps ? event.extendedProps.type : null,
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
                      {editable ? (
                        <TextField
                          sx={{ minWidth: 400 }}
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
                      ) : (
                        <Box pl={3}>
                          <Typography variant="h5">{values.title}</Typography>
                        </Box>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={9}>
                    {editable ? (
                      <TextField
                        id="description"
                        name="description"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        size="small"
                        sx={{ minWidth: 400 }}
                        value={values.description}
                        label={
                          <FormattedMessage id="app.event.description"></FormattedMessage>
                        }
                      ></TextField>
                    ) : (
                      <Box pl={3}>
                        <Typography variant="h6">
                          {values.description}
                        </Typography>
                      </Box>
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    {editable ? (
                      <Box ml={-1}>
                        <Checkbox
                          value={allDay}
                          checked={allDay}
                          onChange={handleChangeAllDay}
                        ></Checkbox>
                        <Typography variant="body1" display="inline">
                          <FormattedMessage id="app.event.all_day"></FormattedMessage>
                        </Typography>
                      </Box>
                    ) : allDay ? (
                      <Box pl={3}>
                        <FormattedMessage id="app.event.all_day"></FormattedMessage>
                      </Box>
                    ) : null}
                  </Grid>
                  {editable ? (
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
                  ) : (
                    <Box pl={5} pb={2}>
                      <Typography variant="body1">
                        {format(new Date(startDate), "cccc LLLL d, yyyy", {
                          locale: loc,
                        })}
                      </Typography>
                    </Box>
                  )}
                  {editable ? (
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
                  ) : null}
                  {editable ? (
                    <Grid item xs={9} pb={2}>
                      <TextField
                        id="type"
                        name="type"
                        select
                        size="small"
                        sx={{ minWidth: 300 }}
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
                  ) : null}
                  {editable ? (
                    <Grid sx={{ p: 2 }}>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        form="form"
                        variant="contained"
                      >
                        <FormattedMessage id="app.button.accept"></FormattedMessage>
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => setEditable(false)}
                      >
                        <FormattedMessage id="app.button.cancel"></FormattedMessage>
                      </Button>
                    </Grid>
                  ) : null}
                </Grid>
              </Form>
            )}
          </Formik>
        </Grid>
      </Popover>
    )
  );
};
export default EditEventPopover;
