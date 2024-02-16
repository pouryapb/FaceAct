import React, { useContext, useState } from "react";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  //FormControlLabel,
  //Checkbox,
  Link,
  Grid,
  Box,
  Typography,
  makeStyles,
  Container,
  Snackbar,
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { Link as RouterLink } from "react-router-dom";
import { Alert } from "@material-ui/lab";

import { AuthContext } from "../Context/auth-context";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Copyright = () => {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link component={RouterLink} color="inherit" to="/">
        FaceAct
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};

const SignIn = () => {
  const classes = useStyles();

  const [username, setUsrname] = useState("");
  const [password, setPassword] = useState("");
  const [snackOpen, setOpen] = useState(false);
  const [severity, setSeverity] = useState("");
  const [alertMsg, setAlertMsg] = useState("");

  const { login, ip } = useContext(AuthContext);

  const submitHandler = (event) => {
    event.preventDefault();
    if (username === "" || password === "") {
      setSeverity("warning");
      setAlertMsg("Please fill the required fields.");
      setOpen(true);
      return;
    }

    const requestBody = {
      username: username,
      password: password,
    };

    fetch(ip + "/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((res) => {
        if (!(res.status === 200 || res.status === 201)) {
          setSeverity("error");
          setAlertMsg("Auth failed!");
          setOpen(true);
          throw new Error("failed!");
        }
        return res.json();
      })
      .then((resBody) => {
        setSeverity("success");
        setAlertMsg("User successfuly created.");
        setOpen(true);
        login(resBody.token, username);
      })
      .catch((err) => {
        setSeverity("error");
        setAlertMsg("Auth failed!");
        setOpen(true);
        console.log(err);
      });
  };

  const snackClose = () => {
    setOpen(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        open={snackOpen}
        autoHideDuration={3000}
        onClose={snackClose}
      >
        <Alert
          elevation={6}
          variant="filled"
          onClose={snackClose}
          severity={severity}
        >
          {alertMsg}
        </Alert>
      </Snackbar>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate onSubmit={submitHandler}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="useename"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(event) => {
              setUsrname(event.target.value);
            }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
          {/* <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          /> */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
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
              <Link component={RouterLink} to="/signup" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
};

export default SignIn;
