import React, { useContext, useState } from "react";
import {
  Button,
  Container,
  TextField,
  Avatar,
  makeStyles,
  Divider,
  Box,
} from "@material-ui/core";

import { AuthContext } from "../Context/auth-context";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: theme.spacing(5),
    height: theme.spacing(5),
    marginRight: "0.5rem",
  },
  button: {
    justifyContent: "left",
  },
}));

const Items = ({ value, link, image }) => {
  const classes = useStyles();

  const { ip } = useContext(AuthContext);

  return (
    <Button
      component={Link}
      className={classes.button}
      color="default"
      fullWidth
      to={link}
      type="submit"
    >
      <Avatar src={ip + "/" + image} className={classes.avatar} />
      {value}
    </Button>
  );
};

const RequestItems = ({ name }) => {
  const { token, ip } = useContext(AuthContext);

  const acceptHandle = () => {
    fetch(ip + "/reqac/" + name, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        if (!(res.status === 200 || res.status === 201)) {
          throw new Error("failed!");
        }
        return res.json();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const denyHandle = () => {
    fetch(ip + "/reqden/" + name, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        if (!(res.status === 200 || res.status === 201)) {
          throw new Error("failed!");
        }
        return res.json();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Box paddingLeft="1rem">
      {name}
      <Button onClick={acceptHandle}>accept</Button>
      <Button onClick={denyHandle}>deny</Button>
    </Box>
  );
};

const Search = () => {
  const [searchValue, setSearchValue] = useState("");
  const [list, setList] = useState([]);
  const [reqs, setReqs] = useState([]);

  const { userId, ip } = useContext(AuthContext);

  setTimeout(() => {
    fetch(ip + "/" + userId, {
      method: "GET",
    })
      .then((res) => {
        if (!(res.status === 200 || res.status === 201 || res.status === 304)) {
          throw new Error("failed!");
        }
        return res.json();
      })
      .then((resBody) => {
        const requests = resBody.requests;
        setReqs(
          requests.map((user, index) => {
            return <RequestItems key={index} name={user} />;
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }, 2000);

  const handleSearch = (event) => {
    const input = event.target.value;
    setSearchValue(input);

    if (input !== "") {
      fetch(ip + "/search/" + input, {
        method: "GET",
      })
        .then((res) => {
          if (!(res.status === 200 || res.status === 201)) {
            throw new Error("failed!");
          }
          return res.json();
        })
        .then((resBody) => {
          setList(
            resBody.map((user) => {
              return (
                <Items
                  key={user._id}
                  value={user.firstName + " " + user.lastName}
                  link={user.username}
                  image={user.avatar}
                />
              );
            })
          );
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setList([]);
    }
  };

  return (
    <Container maxWidth="sm">
      <TextField
        variant="outlined"
        margin="normal"
        fullWidth
        id="search"
        label="Search"
        name="search"
        autoComplete="search"
        value={searchValue}
        onChange={handleSearch}
      />
      {reqs}
      <Divider />
      {list}
    </Container>
  );
};

export default Search;
