import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";
import { Box } from "@mui/material";
import { Grid } from "@mui/material";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import ConfigService from "../app/api/config.api";
import styles from "../styles/Collections.css";
import { ToastContainer, toast } from "react-toastify";
import { GetLocaleDateTime } from "../utils/generic";
import "react-big-calendar/lib/css/react-big-calendar.css";
import 'date-fns/locale/pt-BR';

function CalendarScheduler() {
  const intl = useIntl();
  const [local, setLocal] = useState("");
  const loc = GetLocaleDateTime()

  useEffect(() => {
    setLocal(loc.locale)
  }, []);

  //console.log(GetLocaleDateTime().locale)

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

  const myevents = [
    {
      id: 0,
      title: "training",
      start: new Date(2021, 5, 8, 9, 0, 0),
      end: new Date(2021, 5, 8, 13, 0, 0),
      resourceId: 1
    },
    {
      id: 1,
      title: "late lunch",
      start: new Date(2021, 5, 8, 14, 0, 0),
      end: new Date(2021, 5, 8, 16, 30, 0),
      resourceId: 2
    },
    {
      id: 2,
      title: "fight",
      start: new Date(2021, 5, 8, 8, 30, 0),
      end: new Date(2021, 5, 8, 12, 30, 0),
      resourceId: 3
    },
    {
      id: 3,
      title: "party",
      start: new Date(2021, 5, 8, 7, 0, 0),
      end: new Date(2021, 5, 8, 10, 30, 0),
      resourceId: 4
    }
  ];

  return (
    <Box>
      <ToastContainer autoClose={2000} />
      <Grid container justifyContent="flex-end">
        <Grid item xs={12}>
          <Typography variant="h4" component="h4">
            <FormattedMessage id="app.config.general_title"></FormattedMessage>
          </Typography>
        </Grid>
      </Grid>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }} className="calendars">
        <Calendar
          events={myevents}
          localizer={localizer}
          defaultDate={new Date(2021, 5, 8)}
          style={{ height: 700 }}
          culture={"pt-BR"}
          messages={{
            next: "sig",
            previous: "ant",
            today: "Hoy",
            month: "Mes",
            week: "Semana",
            day: "DÃƒÂ­a"
          }}
        />
      </Box>
    </Box>
  );
}

export default CalendarScheduler;
