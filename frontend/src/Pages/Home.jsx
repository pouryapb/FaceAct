import React from "react";
import { makeStyles, Paper, Tabs, Tab, Container } from "@material-ui/core";
import {
  Home as HomeIcon,
  Search as SearchIcon,
  PersonOutline as ProfileIcon,
  Settings as SettingsIcon,
} from "@material-ui/icons";

import Feeds from "./Feeds";
import Search from "./Search";
import Profile from "./Profile";
import Settings from "./Settings";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
  tab: {
    maxWidth: "25%",
    minWidth: 0,
  },
  tabRoot: {
    minWidth: 0,
    marginBottom: "1rem",
  },
});

export default function IconLabelTabs() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const pages = [<Feeds />, <Search />, <Profile />, <Settings />];

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth="sm">
      <Paper
        elevation={0}
        className={classes.root}
        style={{ paddingBottom: "0.1rem", marginBottom: "1.5rem" }}
      >
        <Tabs
          className={classes.tabRoot}
          value={value}
          onChange={handleChange}
          variant="fullWidth"
          indicatorColor="secondary"
          textColor="secondary"
          aria-label="icon label tabs example"
        >
          <Tab className={classes.tab} icon={<HomeIcon />} label="Home" />
          <Tab className={classes.tab} icon={<SearchIcon />} label="Search" />
          <Tab className={classes.tab} icon={<ProfileIcon />} label="Profile" />
          <Tab
            className={classes.tab}
            icon={<SettingsIcon />}
            label="Settings"
          />
        </Tabs>
        {pages[value]}
      </Paper>
    </Container>
  );
}
