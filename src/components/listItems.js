import React, { useState } from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CollectionsIcon from "@mui/icons-material/Collections";
import BarChartIcon from "@mui/icons-material/BarChart";
import SettingsIcon from "@mui/icons-material/Settings";
import RssFeedIcon from "@mui/icons-material/RssFeed";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ScreenshotMonitorIcon from "@mui/icons-material/ScreenshotMonitor";
import EventNoteIcon from "@mui/icons-material/EventNote";
import KeyIcon from '@mui/icons-material/Key';
import PreviewIcon from "@mui/icons-material/Preview";
import ConstructionIcon from "@mui/icons-material/Construction";
import TuneIcon from "@mui/icons-material/Tune";
import BallotIcon from "@mui/icons-material/Ballot";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import "../styles/Dashboard.css";
import { FormattedMessage } from "react-intl";
import { NavLink } from "react-router-dom";

export default function MainListItems() {
  const [open, setOpen] = useState(false);
  const [openCol, setOpenCol] = useState(false);
  const [openMarket, setOpenMarket] = useState(false);

  const handleClickSettings = () => {
    setOpen(!open);
  };

  const handleClickCollections = () => {
    setOpenCol(!openCol);
  };

  const handleClickMarket = () => {
    setOpenMarket(!openMarket);
  };

  return (
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
      <ListItemButton sx={{ margin: "5px 0" }} onClick={handleClickCollections}>
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
            <ListItemButton sx={{ pl: 4, margin: "5px 0", fontSize: ".75rem" }}>
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
            <ListItemButton sx={{ pl: 4, margin: "5px 0", fontSize: ".75rem" }}>
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
            <ListItemButton sx={{ pl: 4, margin: "5px 0", fontSize: ".75rem" }}>
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
          <RssFeedIcon />
        </ListItemIcon>
        <FormattedMessage id="app.sidemenu.feeds"></FormattedMessage>
      </ListItemButton>
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
            <ListItemButton sx={{ pl: 4, margin: "5px 0", fontSize: ".75rem" }}>
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
            <ListItemButton sx={{ pl: 4, margin: "5px 0", fontSize: ".75rem" }}>
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
            <ListItemButton sx={{ pl: 4, margin: "5px 0", fontSize: ".75rem" }}>
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
        </List>
      </Collapse>
    </List>
  );
}
