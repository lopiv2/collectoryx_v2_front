import React, { useEffect } from "react";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Avatar, { RedirectSource } from "react-avatar";
//import "./Dashboard.css";
import { FormattedMessage } from "react-intl";
import LanguageSwitcher from "../LanguageSelector";
import { useNavigate } from "react-router-dom";
import AuthService from "../../app/api/auth.api";
import { AppContext } from "../AppContext";

export default function TopToolBar(props,{open2}) {
  //const navigate = useNavigate();
  const { userName, setUserName, isLogged, setIsLogged } =
    React.useContext(AppContext);
  /*const [anchorEl, setAnchorEl] = React.useState(null);
  const openAnch = Boolean(anchorEl);*/
  //const [open, setOpen] = props.open;
  console.log(open2);

  /*const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };*/
  /*const handleClose = () => {
    setAnchorEl(null);
  };*/

  /*const toggleDrawer = () => {
    setOpen(!open);
  };*/

  /*const onClickLogout = () => {

    AuthService.logout();
    navigate('/login')
    //console.log(AuthService.isLogged());
  }*/

  useEffect(() => {
    let user = JSON.parse(localStorage.getItem('user'));
    const { user_name: userName } = user;
    setUserName(userName);
    //console.log(user);
  }, []);

  return (
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
          ...(open2 && { display: "none" }),
        }}
      >
        <MenuIcon />
      </IconButton>
      <Typography
        component="h1"
        variant="h6"
        color="inherit"
        noWrap
        sx={{ flexGrow: 1 }}
      >
        <FormattedMessage id="app.sidemenu.dashboard"></FormattedMessage>
      </Typography>
      <LanguageSwitcher></LanguageSwitcher>
      <IconButton color="inherit">
        <Badge badgeContent={4} color="secondary">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <IconButton
        onClick={props.handleClick}
        size="small"
        sx={{ ml: 1 }}
        aria-controls={props.openAnch ? "account-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={props.openAnch ? "true" : undefined}
        color="inherit"
      >
        <Avatar name={userName} size={35} round="200px" />
      </IconButton>
      <Menu
        id="account-menu"
        anchorEl={props.anchorEl}
        open={props.openAnch}
        onClose={props.handleClose}
        onClick={props.handleClose}
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
        <MenuItem onClick={props.handleClose}>Profile</MenuItem>
        <MenuItem onClick={props.handleClose}>My account</MenuItem>
        <MenuItem onClick={props.onClickLogout}>Logout</MenuItem>
      </Menu>
    </Toolbar>
  );
}
