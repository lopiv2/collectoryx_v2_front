import React, { useState, useEffect, useContext } from "react";
import TopToolBar from "../TopToolBar";
import SideBar from "../SideBar";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import "../../styles/Dashboard.css";
import Copyright from "../Copyright";
import { Outlet } from "react-router-dom";
import ConfigService from "../../app/api/config.api";
import { setToLocalStorage } from "../../utils/generic";
import { useTheme } from "../../utils/useTheme";
import WebFont from "webfontloader";
import { AppContext } from "../AppContext";
import { green, blue, grey } from "@mui/material/colors";
import { CreateTheme } from "../../utils/generic";

const drawerWidth = 240;
const mdTheme = createTheme();

function Layout(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openAnch = Boolean(anchorEl);
  const [open, setOpen] = React.useState(true);
  //const [themes, setThemes] = useState([]);
  //const { theme, themeLoaded, getFonts } = useTheme();
  const [themeLoaded, setThemeLoaded] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState("");
  const { userData, setUserData, userConfig, setUserConfig } =
    React.useContext(AppContext);

  useEffect(() => {
    if (localStorage.getItem("user")) {
      var user = JSON.parse(localStorage.getItem("user"));
      setUserData(user);
      setThemeLoaded(true);
      const userConf = ConfigService.getUserConfig(user.id)
        .then((response) => {
          setUserConfig(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  useEffect(() => {
    if (selectedTheme !== "") {
      setThemeLoaded(true);
      //console.log(selectedTheme);
    }
  }, [selectedTheme]);

  useEffect(() => {
    if (userData !== "") {
      const currTheme = CreateTheme(userData);
      setSelectedTheme(currTheme);
    }
  }, [userData]);

  // 4: Load all the fonts
  /*useEffect(() => {
    WebFont.load({
      google: {
        families: getFonts(),
      },
    });
  });*/

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#1976d2", //Barra top
        light: "#42a5f5",
        dark: blue[50],
        contrastText: "#fff",
      },
      secondary: {
        main: "#9c27b0",
        light: "#ba68c8",
        dark: green[50],
        contrastText: "#fff",
      },
      text: {
        primary: "#fff", //Texto primario
        secondary: "#ebebeb", //Texto Secundario
        disabled: green[50],
      },
      background: {
        paper: "#000000", //Barra lateral y cartas
        default: green[50],
      },
    },
    components: {
      MuiContainer: {
        //Sobreescribe el estilo del contenedor
        styleOverrides: {
          root: {
            backgroundColor: "#1f262a",
            backgroundImage:
              "url(https://designshack.net/wp-content/uploads/gradient-background.jpg)",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center",
            backgroundSize: "cover",
            backgroundAttachment: "fixed",
            height: "100%",
          },
        },
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: {
            color: "#e3f2fd",
            paddingTop: "12px",
            paddingBottom: "12px",
          },
        },
      },
      MuiNavLink: {
        styleOverrides: {
          root: {
            textDecoration: "none",
            color: "white",
          },
        },
      },
    },
    overrides: {
      MuiCssBaseline: {
        "@global": {
          body: {
            backgroundColor: "#1f262a",
            backgroundImage:
              "url(https://designshack.net/wp-content/uploads/gradient-background.jpg)",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center",
            backgroundSize: "cover",
            backgroundAttachment: "fixed",
            height: "100%",
          },
        },
      },
    },
  });

  const lightTheme = createTheme({
    palette: {
      mode: "light",
      primary: {
        main: "#1976d2", //Barra top
        light: "#42a5f5",
        dark: blue[50],
        contrastText: "#000000",
      },
      secondary: {
        main: "#9c27b0",
        light: "#ba68c8",
        dark: green[50],
        contrastText: "#fff",
      },
      text: {
        primary: "#000000", //Texto primario
        secondary: "rgba(0,0,0,0.6)", //Texto Secundario
        disabled: green[50],
      },
      background: {
        paper: "#fff", //Barra lateral y cartas
        default: green[50],
      },
    },
    components: {
      MuiContainer: {
        //Sobreescribe el estilo del contenedor
        styleOverrides: {
          root: {
            backgroundColor: "#1f262a",
            backgroundImage:
              "url(https://designshack.net/wp-content/uploads/gradient-background.jpg)",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center",
            backgroundSize: "cover",
            backgroundAttachment: "fixed",
            height: "100%",
          },
        },
      },
    },
    overrides: {
      MuiCssBaseline: {
        "@global": {
          body: {
            backgroundColor: "#1f262a",
            backgroundImage:
              "url(https://designshack.net/wp-content/uploads/gradient-background.jpg)",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center",
            backgroundSize: "cover",
            backgroundAttachment: "fixed",
            height: "100%",
          },
        },
      },
    },
  });

  return (
    themeLoaded &&
    selectedTheme !== "" && (
      <ThemeProvider theme={selectedTheme}>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <TopToolBar
            theme={selectedTheme}
            anchorEl={anchorEl}
            setAnchorEl={setAnchorEl}
            drawerWidth={drawerWidth}
            open={open}
            openAnch={openAnch}
            toggleDrawer={toggleDrawer}
          ></TopToolBar>
          <SideBar
            theme={selectedTheme}
            drawerWidth={drawerWidth}
            open={open}
            openAnch={openAnch}
            toggleDrawer={toggleDrawer}
          ></SideBar>
          <Box
            component="main"
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === "light"
                  ? theme.palette.grey[100]
                  : theme.palette.grey[900],
              flexGrow: 1,
              height: "100vh",
              overflow: "auto",
            }}
          >
            <Toolbar />
            <Container maxWidth="xlg" sx={{ mt: 2, mb: 4 }}>
              <Outlet></Outlet>
              <Copyright sx={{ pt: 4 }} />
            </Container>
          </Box>
        </Box>
      </ThemeProvider>
    )
  );
}
export default Layout;
