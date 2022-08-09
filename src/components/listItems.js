import React, { useState, useEffect } from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import { ListItemText, ListItem, ListItemAvatar } from "@material-ui/core";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CollectionsIcon from "@mui/icons-material/Collections";
import BarChartIcon from "@mui/icons-material/BarChart";
import SettingsIcon from "@mui/icons-material/Settings";
import RssFeedIcon from "@mui/icons-material/RssFeed";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ScreenshotMonitorIcon from "@mui/icons-material/ScreenshotMonitor";
import EventNoteIcon from "@mui/icons-material/EventNote";
import KeyIcon from "@mui/icons-material/Key";
import PreviewIcon from "@mui/icons-material/Preview";
import ConstructionIcon from "@mui/icons-material/Construction";
import TuneIcon from "@mui/icons-material/Tune";
import BallotIcon from "@mui/icons-material/Ballot";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FeedIcon from "@mui/icons-material/Feed";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import { Typography } from "@material-ui/core";
import "../styles/Dashboard.css";
import { FormattedMessage } from "react-intl";
import { NavLink } from "react-router-dom";
import ConfigService from "../app/api/config.api";
import CircularProgress from "@mui/material/CircularProgress";
import { Box, Grid } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import { ThemeProvider, createTheme } from "@material-ui/core";
import { getFavicon } from "../utils/generic";

export default function MainListItems() {
  const [open, setOpen] = useState(false);
  const [openCol, setOpenCol] = useState(false);
  const [openMarket, setOpenMarket] = useState(false);
  const [openFeeds, setOpenFeeds] = useState(false);
  const [feedsList, setFeedsList] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [totalFeeds, setTotalFeeds] = useState(0);
  let totalFeedsCount = 0;

  if (localStorage.getItem("user")) {
    var user = localStorage.getItem("user");
    var userData = JSON.parse(user);
  }

  const avatarStyle = {
    backgroundColor: "#71a9c9",
    height: 24,
    width: 24,
  };

  const theme = createTheme({
    typography: {
      subtitle1: {
        fontSize: 12,
      },
      subtitle1: {
        fontSize: 12,
      },
      body1: {
        fontWeight: 500,
      },
      button: {
        fontStyle: "italic",
      },
    },
  });

  useEffect(() => {
    const feeds = ConfigService.getAllUserFeeds(userData.id)
      .then((response) => {
        setFeedsList(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);


  useEffect(() => {
    feedsList.map((feed) => {
      totalFeedsCount = totalFeedsCount + feed.feedData.articles;
    });
    setTotalFeeds(totalFeedsCount);
  }, [feedsList]);

  const handleClickSettings = () => {
    setOpen(!open);
  };

  const handleClickCollections = () => {
    setOpenCol(!openCol);
  };

  const handleClickMarket = () => {
    setOpenMarket(!openMarket);
  };

  const handleClickFeed = () => {
    setOpenFeeds(!openFeeds);
  };

  return (
    <ThemeProvider theme={theme}>
      <List
        sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        component="nav"
        aria-labelledby="nested-list-subheader"
      >
        <NavLink
          className="nav-link"
          to="/"
          style={{ textDecoration: "none", color: "black" }}
        >
          <ListItemButton>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <FormattedMessage id="app.sidemenu.dashboard"></FormattedMessage>
          </ListItemButton>
        </NavLink>
        <Divider sx={{ my: 1 }} />
        <ListItemButton
          sx={{ margin: "5px 0" }}
          onClick={handleClickCollections}
        >
          <ListItemIcon>
            <CollectionsIcon />
          </ListItemIcon>
          <FormattedMessage id="app.sidemenu.collections"></FormattedMessage>
          {openCol ? (
            <ExpandLess sx={{ ml: 4 }} />
          ) : (
            <ExpandMore sx={{ ml: 4 }} />
          )}
        </ListItemButton>
        <Collapse in={openCol} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <NavLink
              className="nav-link"
              to="/collections"
              style={{ textDecoration: "none", color: "black" }}
            >
              <ListItemButton
                sx={{ pl: 4, margin: "5px 0", fontSize: ".75rem" }}
              >
                <ListItemIcon>
                  <PreviewIcon />
                </ListItemIcon>
                <FormattedMessage
                  sx={{ pl: 4 }}
                  id="app.sidemenu.collections.show"
                ></FormattedMessage>
              </ListItemButton>
            </NavLink>
            <NavLink
              className="nav-link"
              to="/collections/manage"
              style={{ textDecoration: "none", color: "black" }}
            >
              <ListItemButton
                sx={{ pl: 4, margin: "5px 0", fontSize: ".75rem" }}
              >
                <ListItemIcon>
                  <ConstructionIcon />
                </ListItemIcon>
                <FormattedMessage id="app.sidemenu.collections.admin"></FormattedMessage>
              </ListItemButton>
            </NavLink>
            <NavLink
              className="nav-link"
              to="/collections/manage-series"
              style={{ textDecoration: "none", color: "black" }}
            >
              <ListItemButton
                sx={{ pl: 4, margin: "5px 0", fontSize: ".75rem" }}
              >
                <ListItemIcon>
                  <BallotIcon />
                </ListItemIcon>
                <FormattedMessage id="app.sidemenu.collections.series"></FormattedMessage>
              </ListItemButton>
            </NavLink>
          </List>
        </Collapse>
        <ListItemButton sx={{ margin: "5px 0" }} onClick={handleClickMarket}>
          <ListItemIcon>
            <ShoppingCartIcon />
          </ListItemIcon>
          <FormattedMessage id="app.sidemenu.marketplace"></FormattedMessage>
          {openMarket ? (
            <ExpandLess sx={{ ml: 4 }} />
          ) : (
            <ExpandMore sx={{ ml: 4 }} />
          )}
        </ListItemButton>
        <Collapse in={openMarket} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <NavLink
              className="nav-link"
              to="/market/license"
              style={{ textDecoration: "none", color: "black" }}
            >
              <ListItemButton
                sx={{ pl: 4, margin: "5px 0", fontSize: ".75rem" }}
              >
                <ListItemIcon>
                  <KeyIcon />
                </ListItemIcon>
                <FormattedMessage
                  sx={{ pl: 4 }}
                  id="app.sidemenu.marketplace.buy_license"
                ></FormattedMessage>
              </ListItemButton>
            </NavLink>
            <NavLink
              className="nav-link"
              to="/collections/manage"
              style={{ textDecoration: "none", color: "black" }}
            >
              <ListItemButton
                sx={{ pl: 4, margin: "5px 0", fontSize: ".75rem" }}
              >
                <ListItemIcon>
                  <ConstructionIcon />
                </ListItemIcon>
                <FormattedMessage id="app.sidemenu.collections.admin"></FormattedMessage>
              </ListItemButton>
            </NavLink>
            <NavLink
              className="nav-link"
              to="/collections/manage-series"
              style={{ textDecoration: "none", color: "black" }}
            >
              <ListItemButton
                sx={{ pl: 4, margin: "5px 0", fontSize: ".75rem" }}
              >
                <ListItemIcon>
                  <BallotIcon />
                </ListItemIcon>
                <FormattedMessage id="app.sidemenu.collections.series"></FormattedMessage>
              </ListItemButton>
            </NavLink>
          </List>
        </Collapse>
        <ListItemButton sx={{ margin: "5px 0" }}>
          <ListItemIcon>
            <BarChartIcon />
          </ListItemIcon>
          <FormattedMessage id="app.sidemenu.reports"></FormattedMessage>
        </ListItemButton>
        <ListItemButton sx={{ margin: "5px 0" }} onClick={handleClickSettings}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <FormattedMessage id="app.sidemenu.config"></FormattedMessage>
          {open ? <ExpandLess sx={{ ml: 4 }} /> : <ExpandMore sx={{ ml: 4 }} />}
        </ListItemButton>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <NavLink
              className="nav-link"
              to="/config/general"
              style={{ textDecoration: "none", color: "black" }}
            >
              <ListItemButton sx={{ pl: 4, margin: "5px 0" }}>
                <ListItemIcon>
                  <TuneIcon />
                </ListItemIcon>
                <FormattedMessage id="app.sidemenu.options.general"></FormattedMessage>
              </ListItemButton>
            </NavLink>
            <ListItemButton sx={{ pl: 4, margin: "5px 0" }}>
              <ListItemIcon>
                <EventNoteIcon />
              </ListItemIcon>
              <FormattedMessage id="app.sidemenu.options.logs"></FormattedMessage>
            </ListItemButton>
            <ListItemButton sx={{ pl: 4, margin: "5px 0" }}>
              <ListItemIcon>
                <ScreenshotMonitorIcon />
              </ListItemIcon>
              <FormattedMessage id="app.sidemenu.options.ui"></FormattedMessage>
            </ListItemButton>
            <NavLink
              className="nav-link"
              to="/feeds/manage"
              style={{ textDecoration: "none", color: "black" }}
            >
              <ListItemButton sx={{ pl: 4, margin: "5px 0" }}>
                <ListItemIcon>
                  <ConstructionIcon />
                </ListItemIcon>
                <FormattedMessage id="app.sidemenu.feeds.admin"></FormattedMessage>
              </ListItemButton>
            </NavLink>
          </List>
        </Collapse>
        <Divider sx={{ my: 1 }} />
        <ListItemButton sx={{ margin: "5px 0" }} onClick={handleClickFeed}>
          <ListItemIcon>
            <RssFeedIcon />
          </ListItemIcon>
          <FormattedMessage id="app.sidemenu.feeds"></FormattedMessage>
          {openFeeds ? (
            <ExpandLess sx={{ ml: 4 }} />
          ) : (
            <ExpandMore sx={{ ml: 4 }} />
          )}
          {totalFeeds > 0 && (
            <Grid container direction="row-reverse">
              <Grid item>
                <Avatar sx={{ mr: 5 }} style={avatarStyle}>
                  <Typography display="inline" variant="subtitle1">
                    {totalFeeds}
                  </Typography>
                </Avatar>
              </Grid>
            </Grid>
          )}
        </ListItemButton>
        <Collapse in={openFeeds} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {isLoading == false ? (
              feedsList.map((feed, index) => (
                <NavLink
                  key={index}
                  className="nav-link"
                  state={feed.name}
                  to={{ pathname: `/feeds/${feed.name}` }}
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <ListItem disableGutters style={{ paddingTop: 0, paddingBottom: 0, margin: 0 }}>
                    <ListItemButton
                      sx={{ pl: 4, margin: "5px 0", fontSize: ".75rem" }}
                    >
                      <ListItemIcon style={{ minWidth: 40 }}>
                        {feed.logo ? (
                          <Box
                            component="img"
                            sx={{
                              height: "auto",
                              width: "auto",
                              maxHeight: 24,
                              maxWidth: 24,
                            }}
                            alt="Logo"
                            src={feed.logo}
                          ></Box>
                        ) : (
                          <Box
                            sx={{
                              height: "auto",
                              width: "auto",
                              maxHeight: 24,
                              maxWidth: 24,
                            }}
                          >
                            <FeedIcon />
                          </Box>
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={feed.name}
                        primaryTypographyProps={{ variant: "subtitle1" }}
                      ></ListItemText>
                      <ListItemAvatar style={{ minWidth: 0 }}>
                        <Avatar style={avatarStyle}>
                          <Typography display="inline" variant="subtitle1">
                            {feed.feedData.articles}
                          </Typography>
                        </Avatar>
                      </ListItemAvatar>
                    </ListItemButton>
                  </ListItem>
                </NavLink>
              ))
            ) : (
              <Box
                sx={{
                  my: 8,
                  mx: 4,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <CircularProgress />
                <FormattedMessage id="app.feed.loading"></FormattedMessage>
              </Box>
            )}
          </List>
        </Collapse>
      </List>
    </ThemeProvider>
  );
}
