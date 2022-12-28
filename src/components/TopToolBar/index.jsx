import React, { useEffect, useState, useContext } from "react";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Avatar from "react-avatar";
import Grid from "@mui/material/Grid";
import MuiAppBar from "@mui/material/AppBar";
import { FormattedMessage } from "react-intl";
import LanguageSwitcher from "../LanguageSelector";
import { AppContext } from "../AppContext";
import { styled } from "@mui/material/styles";
import AuthService from "../../app/api/auth.api";
import { useNavigate } from "react-router-dom";
import ConfigService from "../../app/api/config.api";

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default function TopToolBar(props) {
  const navigate = useNavigate();
  let user;

  const onClickLogout = () => {
    AuthService.logout();
    navigate("/login");
    //console.log(AuthService.isLogged());
  };

  const onClickProfile = () => {
    navigate("/profile");
  };

  const handleClickEvents = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseEvents = () => {
    setAnchorEl(null);
  };

  const handleClick = (event) => {
    props.setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    props.setAnchorEl(null);
  };

  //const navigate = useNavigate();
  const { userData, dailyEvents, setDailyEvents, userConfig, setUserConfig } = useContext(AppContext);
  const [expiringDate, setExpiringDate] = useState();
  const [eventAlarms, setEventAlarms] = useState(0);
  const [telegramConnectionParameters, setTelegramConnectionParameters] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const openAnch = Boolean(anchorEl);

  //First
  useEffect(() => {
    if (dailyEvents != null) {
      setEventAlarms(dailyEvents.length)
    }
  }, [dailyEvents])

  //Second
  useEffect(() => {
    if (eventAlarms != null) {
      ConfigService.checkConnectionTelegram(userData.id).then((response) => {
        setTelegramConnectionParameters(response.data);
      })
    }
  }, [eventAlarms])

  //Third, Only send notifications once in a logging session
  useEffect(() => {
    if (telegramConnectionParameters != null && userConfig.notificationsSent === false) {
      dailyEvents.map((event) => {
        ConfigService.sendMessageTelegram(
          telegramConnectionParameters.botToken,
          telegramConnectionParameters.chatId,
          "HTML",
          "<b>" + event.title + "</b>" + "%0A" + event.extendedProps.description
        ).then((response) => {

        })
      })
      setUserConfig((previous) => ({
        ...previous,
        notificationsSent: true,
      }));
    }
  }, [telegramConnectionParameters])

  useEffect(() => {
    setExpiringDate(userData.expiringDate);
    const d = new Date();
    d.setHours(0)
    d.setMinutes(0)
    d.setSeconds(0)
    const startDay = d;
    const endDay = new Date(startDay)
    endDay.setDate(endDay.getDate() + 1)
    ConfigService.getAllUserEventsPeriod(userData.id, startDay, endDay)
      .then((response) => {
        //console.log(response.data)
        setDailyEvents([]);
        response.data.map((i) => {
          const data = {
            id: i.id,
            title: i.title,
            start: i.start,
            allDay: i.allDay,
            end: i.end,
            extendedProps: {
              description: i.description,
              type: i.type,
            },
          };
          //console.log(data)
          setDailyEvents((dailyEvents) => [...dailyEvents, data]);
        });
      })
      .catch((err) => {
        console.log(err);
      })
  }, [userData]);

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    userData && (
      <AppBar position="absolute" open={props.open}>
        <Toolbar
          sx={{
            pr: "24px", // keep right padding when drawer closed
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={props.toggleDrawer}
            sx={{
              marginRight: "36px",
              ...(props.open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 3, sm: 8, md: 12 }}
            justifyContent="space-around"
          >
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              <Grid item xs={2} sm={3} md={3}>
                <Typography
                  variant="h5"
                  component="h5"
                  color="white"
                  weight="600"
                  sx={{
                    display: { xs: "none", sm: "block" },
                    typography: { sm: "h5", xs: "h6" },
                    pl: { md: 20, lg: 60, xl: 60 },
                    pt: 3
                  }}
                >
                  <FormattedMessage
                    id="app.sidemenu.welcome"
                    values={{ user: capitalizeFirstLetter(userData.userName) }}
                  ></FormattedMessage>
                </Typography>
              </Grid>
              {AuthService.checkUserLogged() === "USER_ROLE" ? (
                <Grid item xs={2} sm={3} md={3}>
                  {/*<FormattedMessage
                    id={
                      userData.expiringDate > 0
                        ? "app.dashboard.license_days"
                        : userData.license === "Free"
                        ? "app.license.free"
                        : "app.license.lifetime"
                    }
                    values={{
                      days: expiringDate ?? expiringDate,
                    }}
                  ></FormattedMessage>*/}
                </Grid>
              ) : (
                <Grid item xs={2} ml={50}>
                  <Typography
                    component="h1"
                    variant="h6"
                    color="yellow"
                    noWrap
                    sx={{ flexGrow: 1 }}
                  >
                    <FormattedMessage id="app.dashboard.admin_panel"></FormattedMessage>
                  </Typography>
                </Grid>
              )}
            </Typography>
          </Grid>
          <Grid item xs={2} sm={4} md={4} sx={{ ml: { sm: 6, md: 10, lg: 27, xl: 90 }, mr: { sm: 0, md: 0, xs: 10, lg: 0 } }} >
            <LanguageSwitcher></LanguageSwitcher>
          </Grid>
          <Grid item xs={2} sm={4} md={4}>
            <IconButton
              color="inherit"
              sx={{ color: props.theme.palette.secondary.contrastText }}
            >
              <Badge badgeContent={eventAlarms} color="secondary">
                <NotificationsIcon
                  onClick={eventAlarms > 0 ? handleClickEvents : null}
                  size="small"
                  sx={{ ml: 1 }}
                  aria-controls={openAnch ? "events-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={openAnch ? "true" : undefined} />
              </Badge>
            </IconButton>
          </Grid>
          <Grid item xs={2} sm={4} md={4}>
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 1 }}
              aria-controls={props.openAnch ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={props.openAnch ? "true" : undefined}
              color="inherit"
            >
              <Avatar name={userData.userName} size={35} round="200px" />
            </IconButton>
          </Grid>
          <Menu
            id="events-menu"
            anchorEl={anchorEl}
            open={openAnch}
            onClose={handleCloseEvents}
            onClick={handleCloseEvents}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            {dailyEvents.length > 0 ? dailyEvents.map((event, index) =>
              <MenuItem key={index}>
                <Grid>
                  <Typography variant="body1">
                    {event.title + "\n"}
                  </Typography>
                  <Typography variant="body2">
                    {event.extendedProps.description}
                  </Typography>
                  <Typography variant="body1" style={{ whiteSpace: 'pre-line' }}>

                  </Typography>
                  {dailyEvents.length > 1 && index + 1 !== dailyEvents.length ? <Divider variant="fullWidth" /> : null}
                </Grid>
              </MenuItem>
            ) : null}
          </Menu>
          <Menu
            id="account-menu"
            anchorEl={props.anchorEl}
            open={props.openAnch}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem onClick={onClickProfile}>
              <FormattedMessage id="app.sidemenu.my_account"></FormattedMessage>
            </MenuItem>
            <MenuItem onClick={onClickLogout}>
              <FormattedMessage id="app.sidemenu.logout"></FormattedMessage>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar >
    )
  );
}
