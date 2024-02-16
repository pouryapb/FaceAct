import React, { useContext } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core";

import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import Home from "./Pages/Home";
import Profile from "./Pages/Profile";
import CssBaseline from "@material-ui/core/CssBaseline";

import { AuthContext } from "./Context/auth-context";

const theme = createMuiTheme({
  palette: {
    type: "dark",
    // background: "ffffff",
  },
});

const App = () => {
  const { token } = useContext(AuthContext);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter basename="/FaceAct">
        <Switch>
          {!token && <Redirect from="/" to="/signin" exact />}
          {!token && <Redirect from="/home" to="/signin" exact />}
          {token && <Redirect from="/signin" to="/home" exact />}
          {token && <Redirect from="/" to="/home" exact />}
          {!token && <Route path="/signin" component={SignIn} />}
          {!token && <Route path="/signup" component={SignUp} />}
          {token && <Route path="/home" component={Home} />}
          <Route path="/:username" component={Profile} />
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
