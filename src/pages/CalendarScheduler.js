import React, { useState, useCallback, useMemo, useEffect, useContext } from "react";
import { Typography } from "@mui/material";
import PropTypes from 'prop-types'
import { FormattedMessage, useIntl } from "react-intl";
import { Box } from "@mui/material";
import { Grid } from "@mui/material";
import { Calendar, Views, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import ConfigService from "../app/api/config.api";
import styles from "../styles/Collections.css";
import { ToastContainer, toast } from "react-toastify";
import { GetLocaleDateTime } from "../utils/generic";
import "react-big-calendar/lib/css/react-big-calendar.css";
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { AppContext } from "../components/AppContext";
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import Button from "@mui/material/Button";
import CreateEventDialog from "../components/CreateEventDialog";

function CalendarScheduler() {
  const intl = useIntl();
  const [local, setLocal] = useState("");
  const [eventsList, setEventsList] = useState([]);
  const loc = GetLocaleDateTime()
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const { userData, setUserData } = React.useContext(AppContext);

  const events = [
    {
      id: 0,
      title: 'Board meeting',
      start: new Date(2018, 0, 29, 9, 0, 0),
      end: new Date(2018, 0, 29, 13, 0, 0),
      resourceId: 1,
    },
    {
      id: 1,
      title: 'MS training',
      start: new Date(2018, 0, 29, 14, 0, 0),
      end: new Date(2018, 0, 29, 16, 30, 0),
      resourceId: 2,
    },
    {
      id: 2,
      title: 'Team lead meeting',
      start: new Date(2018, 0, 29, 8, 30, 0),
      end: new Date(2018, 0, 29, 12, 30, 0),
      resourceId: 3,
    },
    {
      id: 10,
      title: 'Board meeting',
      start: new Date(2018, 0, 30, 23, 0, 0),
      end: new Date(2018, 0, 30, 23, 59, 0),
      resourceId: 1,
    },
    {
      id: 11,
      title: 'Birthday Party',
      start: new Date(2018, 0, 30, 7, 0, 0),
      end: new Date(2018, 0, 30, 10, 30, 0),
      resourceId: 4,
    },
    {
      id: 12,
      title: 'Board meeting',
      start: new Date(2018, 0, 29, 23, 59, 0),
      end: new Date(2018, 0, 30, 13, 0, 0),
      resourceId: 1,
    },
    {
      id: 13,
      title: 'Board meeting',
      start: new Date(2018, 0, 29, 23, 50, 0),
      end: new Date(2018, 0, 30, 13, 0, 0),
      resourceId: 2,
    },
    {
      id: 14,
      title: 'Board meeting',
      start: new Date(2018, 0, 29, 23, 40, 0),
      end: new Date(2018, 0, 30, 13, 0, 0),
      resourceId: 4,
    },
  ]

  useEffect(() => {
    ConfigService.getAllUserEventsPeriod(userData.id)
      .then((response) => {
        setEventsList(response.data);
        console.log(response.data)
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const resourceMap = [
    { resourceId: 1, resourceTitle: 'Board room' },
    { resourceId: 2, resourceTitle: 'Training room' },
    { resourceId: 3, resourceTitle: 'Meeting room 1' },
    { resourceId: 4, resourceTitle: 'Meeting room 2' },
  ]
  const [myEvents, setMyEvents] = useState(eventsList)
  const DragAndDropCalendar = withDragAndDrop(Calendar)

  useEffect(() => {
    setMyEvents(eventsList)
  }, [eventsList]);

  const moveEvent = useCallback(
    ({
      event,
      start,
      end,
      resourceId,
      isAllDay: droppedOnAllDaySlot = false,
    }) => {
      const { allDay } = event
      if (!allDay && droppedOnAllDaySlot) {
        event.allDay = true
      }

      setMyEvents((prev) => {
        const existing = prev.find((ev) => ev.id === event.id) ?? {}
        const filtered = prev.filter((ev) => ev.id !== event.id)
        return [...filtered, { ...existing, start, end, resourceId, allDay }]
      })
    },
    [setMyEvents]
  )

  const resizeEvent = useCallback(
    ({ event, start, end }) => {
      setMyEvents((prev) => {
        const existing = prev.find((ev) => ev.id === event.id) ?? {}
        const filtered = prev.filter((ev) => ev.id !== event.id)
        return [...filtered, { ...existing, start, end }]
      })
    },
    [setMyEvents]
  )

  useEffect(() => {
    setLocal(loc.locale)
  }, []);

  const handleOpenCreateEventDialog = () => {
    setOpenCreate(true);
  };

  const locales = {
    "es-ES": require("date-fns/locale/es")
  };

  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales
  });

  const { defaultDate, scrollToTime } = useMemo(
    () => ({
      defaultDate: new Date(2018, 0, 29),
      scrollToTime: new Date(1972, 0, 1, 8),
    }),
    []
  )


  return (
    <Box>
      <ToastContainer autoClose={2000} />
      <Grid container justifyContent="flex-end">
        <Grid item xs={12}>
          <Typography variant="h4" component="h4">
            <FormattedMessage id="app.sidemenu.calendar"></FormattedMessage>
          </Typography>
        </Grid>
      </Grid>
      <Grid item xs={12} pb={1}>
        <Button
          variant="outlined"
          sx={{ borderRadius: 28 }}
          startIcon={<AddIcon />}
          disableRipple
          disableElevation
          disableFocusRipple
          onClick={() => handleOpenCreateEventDialog()}
        >
          <FormattedMessage id="app.button.create"></FormattedMessage>
        </Button>
      </Grid>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }} className="calendars">
        <DragAndDropCalendar
          events={myEvents}
          localizer={localizer}
          defaultView={Views.MONTH}
          onEventDrop={moveEvent}
          onEventResize={resizeEvent}
          style={{ height: 700 }}
          culture={"en-US"}
          resizable
          resourceIdAccessor="resourceId"
          resources={resourceMap}
          resourceTitleAccessor="resourceTitle"
          selectable
          showMultiDayTimes={true}
          step={15}
          messages={{
            next: "sig",
            previous: "ant",
            today: "Hoy",
            month: "Mes",
            week: "Semana",
            day: "Día"
          }}
        />
      </Box>
      <CreateEventDialog
        open={openCreate}
        setOpen={setOpenCreate}
        eventsList={eventsList}
        setEventsList={setEventsList}
      >
        <FormattedMessage id="app.dialog.confirm_delete"></FormattedMessage>
      </CreateEventDialog>
    </Box>
  );
}

CalendarScheduler.propTypes = {
  localizer: PropTypes.instanceOf(dateFnsLocalizer),
}

export default CalendarScheduler;
