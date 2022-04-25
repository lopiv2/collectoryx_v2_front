import React, { useEffect } from 'react';
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
import AuthService from "../app/api/auth.api";
import { AppContext } from "./AppContext";
<<<<<<< HEAD
=======
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

>>>>>>> 4a1d133b (first commit)

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

const theme = createTheme();

export default function SignInSide() {
<<<<<<< HEAD
  const { isLogged, setIsLogged } = React.useContext(AppContext);

  useEffect(() => {
    if (isLogged === true) {
      //console.log(isLogged);
    }
  }, [isLogged]);
=======
  const { userName, setUserName, isLogged, setIsLogged } = React.useContext(AppContext);
  const navigate = useNavigate();
>>>>>>> 4a1d133b (first commit)

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
<<<<<<< HEAD
    AuthService.login(data.get("user_name"), data.get("password")).then(() => {
      setIsLogged(true);
      console.log(AuthService.getCurrentUser());
=======
    AuthService.login(data.get("user_name"), data.get("password")).then((response) => {
      setIsLogged(true);
      setUserName(data.get("user_name"));
      if (response.data.error === true) {
        toast.error(response.data.message, { theme: "colored" });
        //console.log(response.data.error);
      }
      else {
        navigate("/dashboard");
      }
>>>>>>> 4a1d133b (first commit)
    });
  };

  return (
    <ThemeProvider theme={theme}>
<<<<<<< HEAD
=======
      <ToastContainer autoClose={3000} />
>>>>>>> 4a1d133b (first commit)
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: "url(https://source.unsplash.com/random)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
<<<<<<< HEAD
=======

>>>>>>> 4a1d133b (first commit)
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="user_name"
<<<<<<< HEAD
                label="Email Address"
=======
                label="User Name"
>>>>>>> 4a1d133b (first commit)
                name="user_name"
                autoComplete="user_name"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
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
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="#" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
