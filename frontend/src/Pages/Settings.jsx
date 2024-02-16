import React, { useContext, useState } from "react";
import {
  Container,
  Card,
  CardContent,
  Box,
  Avatar,
  makeStyles,
  CardHeader,
  TextField,
  Button,
  Snackbar,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";

import { AuthContext } from "../Context/auth-context";

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: theme.spacing(10),
    height: theme.spacing(10),
    marginBottom: "0.5rem",
  },
  gridItem: {
    textAlign: "center",
  },
  input: {
    display: "none",
  },
}));

const Settings = () => {
  const classes = useStyles();

  const [avatar, setAvatar] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [file, setFile] = useState(null);
  const [snackOpen, setOpen] = useState(false);
  const [severity, setSeverity] = useState("");
  const [alertMsg, setAlertMsg] = useState("");

  const { token, userId, logout, ip } = useContext(AuthContext);

  const firstLoad = () => {
    fetch(ip + "/uinfo/" + userId, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        if (!(res.status === 200 || res.status === 201 || res.status === 304)) {
          throw new Error("failed!");
        }
        return res.json();
      })
      .then((resBody) => {
        setAvatar(ip + "/" + resBody.avatar);
        setFirstName(resBody.firstName);
        setLastName(resBody.lastName);
        setEmail(resBody.email);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  if (email === "") {
    firstLoad();
  }

  const reader = new FileReader();

  const handleFile = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);

      reader.onload = (event) => {
        setAvatar(event.target.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const updateInfo = () => {
    const requestBody = [
      { propName: "firstName", value: firstName },
      { propName: "lastName", value: lastName },
      { propName: "email", value: email },
    ];

    fetch(ip + "/uinfo/" + userId, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(requestBody),
    })
      .then((res) => {
        if (!(res.status === 200 || res.status === 201)) {
          throw new Error("failed!");
        }
      })
      .then(() => {
        setSeverity("success");
        setAlertMsg("Updates Saved!");
        setOpen(true);
      })
      .catch((err) => {
        console.log(err);
        setSeverity("error");
        setAlertMsg("Update failed!");
        setOpen(true);
      });

    const formData = new FormData();
    formData.append("avatarImg", file);

    fetch(ip + "/avatarup/" + userId, {
      method: "PATCH",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: formData,
    })
      .then((res) => {
        if (!(res.status === 200 || res.status === 201)) {
          throw new Error("failed!");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const snackClose = () => {
    setOpen(false);
  };

  return (
    <Container
      maxWidth="sm"
      style={{ paddingBottom: "0.1rem", marginBottom: "1.5rem" }}
    >
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
      <Card elevation={3}>
        <CardHeader />
        <form id="av-up" noValidate autoComplete="off">
          <CardContent>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
            >
              <Avatar src={avatar} className={classes.avatar} />
              <input
                className={classes.input}
                accept="image/*"
                id="upload-btn"
                type="file"
                onChange={handleFile}
              />
              <label htmlFor="upload-btn">
                <Button variant="outlined" component="span">
                  Choose profile image
                </Button>
              </label>
            </Box>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="firstname"
              label="Firstname"
              name="firstname"
              autoComplete="firstname"
              value={firstName}
              onChange={(event) => {
                setFirstName(event.target.value);
              }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="lastname"
              label="Lastname"
              name="lastname"
              autoComplete="lastname"
              value={lastName}
              onChange={(event) => {
                setLastName(event.target.value);
              }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
              }}
            />
          </CardContent>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
            marginBottom="1rem"
          >
            <Button color="secondary" variant="outlined" onClick={updateInfo}>
              save profile
            </Button>
            <Button
              style={{ marginLeft: "0.5rem" }}
              color="default"
              variant="outlined"
              onClick={logout}
            >
              Logout
            </Button>
          </Box>
        </form>
      </Card>
    </Container>
  );
};

export default Settings;
