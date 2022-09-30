import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useContext,
} from "react";
import { Typography } from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";
import { Box } from "@mui/material";
import { Grid } from "@mui/material";
import { Popover } from "@mui/material";
import { IconButton } from "@mui/material";
import {
  format,
  parse,
  startOfWeek,
  getDay,
  getHours,
  getMinutes,
  isAfter,
} from "date-fns";
import ConfigService from "../app/api/config.api";
import styles from "../styles/Collections.css";
import { ToastContainer, toast } from "react-toastify";
import { GetLocaleDateTime } from "../utils/generic";
import { AppContext } from "../components/AppContext";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import CreateEventDialog from "../components/CreateEventDialog";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import ConfirmDialog from "../components/ConfirmDialog";
import EditEventPopover from "../components/EditEventPopover";
import { isUndefined } from "lodash";

function CalendarScheduler() {
  const intl = useIntl();
  const [local, setLocal] = useState("");
  const [eventsList, setEventsList] = useState([]);
  const loc = GetLocaleDateTime();
  const [openCreate, setOpenCreate] = useState(false);
  const [reloadCreated, setReloadCreated] = useState(false);
  const [startDragging, setStartDragging] = useState(false);
  const [dateClickedEvent, setDateClickedEvent] = useState("");
  const [eventClicked, setEventClicked] = useState("");
  const [initialDateCalendar, setInitialDateCalendar] = useState("");
  const [finalDateCalendar, setFinalDateCalendar] = useState("");
  const [openEdit, setOpenEdit] = useState(false); //Variable that controls if openEdit popper is opened
  const { userData, setUserData } = React.useContext(AppContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const today = new Date();
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleClose = () => {
    setAnchorEl(null);
  };

  const requestEvents = (startDate, endDate) => {
    ConfigService.getAllUserEventsPeriod(userData.id, startDate, endDate)
      .then((response) => {
        //console.log(response.data)
        setEventsList([]);
        response.data.map((i) => {
          const data = {
            id: i.id,
            title: i.title,
            start: i.start,
            allDay: i.allDay,
            end: i.end,
            backgroundColor:
              i.type === "Event"
                ? isAfter(today,new Date(i.end))
                  ? "rgba(195, 227, 176, 1)"
                  : "rgba(107, 181, 64, 1)"
                : isAfter(today,new Date(i.end))
                  ? "rgba(64, 177, 181, 1)"
                  : "rgba(161, 220, 222, 1)",
            extendedProps: {
              description: i.description,
              type: i.type,
            },
          };
          //console.log(data)
          setEventsList((eventsList) => [...eventsList, data]);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (openEdit === true) {
      requestEvents(initialDateCalendar, finalDateCalendar);
      setOpenEdit(false);
    }
  }, [openEdit]);

  useEffect(() => {
    if (reloadCreated === true) {
      requestEvents(initialDateCalendar, finalDateCalendar);
      setReloadCreated(false);
    }
  }, [reloadCreated]);

  useEffect(() => {
    requestEvents(initialDateCalendar, finalDateCalendar);
  }, [initialDateCalendar, finalDateCalendar]);

  useEffect(() => {
    setLocal(loc.locale);
  }, [loc]);

  const handleOpenCreateEventDialog = () => {
    setOpenCreate(true);
  };

  function renderEventContent(eventContent) {
    //console.log(eventContent.event.start)
    return (
      <Box>
        <Box>{eventContent.event.title}</Box>
        {!eventContent.event.allDay ? (
          <Box>
            {getHours(eventContent.event.start) +
              ":" +
              getMinutes(eventContent.event.start) +
              " - " +
              getHours(eventContent.event.end) +
              ":" +
              getMinutes(eventContent.event.end)}
          </Box>
        ) : (
          <Box>
            <FormattedMessage id="app.event.all_day"></FormattedMessage>
          </Box>
        )}
      </Box>
    );
  }

  const handleEventClick = (clickInfo) => {
    setEventClicked(clickInfo.event);
    setAnchorEl(clickInfo.jsEvent.target);
  };

  const handleEventResize = (clickInfo, newResource) => {
    if (isUndefined(clickInfo.newResource)) {
      const values = {
        id: clickInfo.event.id,
        title: clickInfo.event.title,
        start: clickInfo.event.start,
        end: clickInfo.event.end,
        allDay: clickInfo.event.allDay,
        type: clickInfo.event.extendedProps.type,
        description: clickInfo.event.extendedProps.description,
      };
      ConfigService.updateEvent(values).then((response) => {
        if (response.status === 200) {
          toast.success(
            <FormattedMessage id="app.event.edited"></FormattedMessage>,
            { theme: "colored" }
          );
          requestEvents(initialDateCalendar, finalDateCalendar);
        }
      });
    }
  };

  const handleDeleteClick = () => {
    //console.log(eventClicked.id)
    ConfigService.deleteEvent(eventClicked.id).then((response) => {
      if (response.data === true) {
        toast.success(
          <FormattedMessage id="app.event.deleted"></FormattedMessage>,
          { theme: "colored" }
        );
        handleClose();
        requestEvents(initialDateCalendar, finalDateCalendar);
      }
    });
  };

  const dateClickHandler = (clickInfo) => {
    setDateClickedEvent(clickInfo.date);
    handleOpenCreateEventDialog();
  };

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
      <Box sx={{ borderBottom: 1, borderColor: "divider" }} className="fc">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          customButtons={{
            newAppointment: {
              text: "Nueva cita",
              click: () => {
                dateClickHandler();
              },
            },
          }}
          dateClick={(e) => dateClickHandler(e)}
          locale={local === "es-ES" ? esLocale : ""}
          events={eventsList}
          initialView="dayGridMonth"
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          datesSet={(dateInfo) => {
            setInitialDateCalendar(dateInfo.startStr.split("T")[0]);
            setFinalDateCalendar(dateInfo.endStr.split("T")[0]);
            requestEvents(initialDateCalendar, finalDateCalendar);
          }}
          eventContent={renderEventContent}
          eventClick={handleEventClick}
          eventResize={handleEventResize}
          //eventDragStart={setStartDragging(true)}
          eventDrop={handleEventResize}
        />
      </Box>
      <CreateEventDialog
        open={openCreate}
        setOpen={setOpenCreate}
        dateClickedEvent={dateClickedEvent}
        reloadCreated={reloadCreated}
        setReloadCreated={setReloadCreated}
      >
        <FormattedMessage id="app.dialog.confirm_delete"></FormattedMessage>
      </CreateEventDialog>
      <ConfirmDialog
        title={intl.formatMessage({
          id: "app.dialog.delete_title",
        })}
        open={confirmOpen}
        setOpen={setConfirmOpen}
        onConfirm={handleDeleteClick}
      >
        <FormattedMessage id="app.dialog.confirm_delete"></FormattedMessage>
      </ConfirmDialog>
      <EditEventPopover
        id={id}
        open={open}
        event={eventClicked}
        setEventClicked={setEventClicked}
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        setConfirmOpen={setConfirmOpen}
        setOpen={setOpenEdit}
        onClose={handleClose}
      ></EditEventPopover>
    </Box>
  );
}

export default CalendarScheduler;
