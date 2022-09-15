import React, { useEffect, useContext } from 'react';
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AuthService from "../../app/api/auth.api";
import { AppContext } from "../../components/AppContext";
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { Context } from "../../components/Wrapper";
import { FormattedMessage } from 'react-intl';
import LanguageSwitcher from '../../components/LanguageSelector';

function Copyright(props) {

  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

function importAll(r) {
  return r.keys().map(r);
}

const images = importAll(require.context('../../../public/images/home/', false, /\.(png|jpe?g|svg)$/));
const theme = createTheme();

export default function SignInSide() {
  const { userName, setUserName, isLogged, setIsLogged, role, setRole } = useContext(AppContext);
  const navigate = useNavigate();
  const context = useContext(Context);
  const selectedImage = images[Math.floor(Math.random() * images.length)];

  //console.log(selectedImage)

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    AuthService.login(data.get("userName"), data.get("password")).then((response) => {
      setIsLogged(true);
      setUserName(data.get("userName"));
      setRole(response.data.role)
      if (response.data.error === true) {
        toast.error(response.data.message, { theme: "colored" });
        //console.log(response.data.error);
      }
      else {
        navigate("/");
      }
    });
  };

  const onClickSignUp = () => {
    navigate('/signup')
  }

  return (
    <ThemeProvider theme={theme}>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ backgroundImage: `url(${selectedImage})`, minHeight: '100vh' }}
        sx={{
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <Grid item pt={-10}>
          <Grid item component={Paper}
            elevation={6}
            style={{
              background: 'linear-gradient(to right bottom, #57abdb, #ffffff69)'
            }}>
            <Grid container justifyContent="flex-end" m={0} p={4}>
              <LanguageSwitcher></LanguageSwitcher>
            </Grid>
            <Box
              sx={{
                my: 0,
                mx: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                <FormattedMessage id="app.signin"></FormattedMessage>
              </Typography>
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 1 }}
              >
                <TextField
                  sx={{
                    input: {
                      color: "black",
                      background: "white",
                      opacity: .75
                    }
                  }}
                  margin="normal"
                  required
                  fullWidth
                  id="userName"
                  label={<FormattedMessage id="app.signup.fields.name"></FormattedMessage>}
                  name="userName"
                  autoComplete="userName"
                  autoFocus
                />
                <TextField
                  sx={{
                    input: {
                      color: "black",
                      background: "white",
                      opacity: .75
                    }
                  }}
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label={<FormattedMessage id="app.signin.password"></FormattedMessage>}
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, opacity: 1 }}
                >
                  <FormattedMessage id="app.signin"></FormattedMessage>
                </Button>
                <Grid container>
                  <Grid item xs>
                    <Link href="#" variant="body2">
                      Forgot password?
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link
                      href="#"
                      variant="body2"
                      onClick={onClickSignUp}>
                      {"Don't have an account? Sign Up"}
                    </Link>
                  </Grid>
                </Grid>
                <Copyright sx={{ mt: 5 }} />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Grid>
      <CssBaseline />
    </ThemeProvider >
  );
}
