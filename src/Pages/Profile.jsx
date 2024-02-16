import React, { useContext, useState } from "react";
import {
  makeStyles,
  Card,
  CardHeader,
  CardContent,
  Avatar,
  Typography,
  Divider,
  Container,
  Grid,
  Link,
  Menu,
  MenuItem,
  Box,
  Button,
} from "@material-ui/core";

import Post from "../Components/Post";
import { AuthContext } from "../Context/auth-context";

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: "25px",
    boxShadow: "none",
  },
  avatar: {
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
  gridItem: {
    textAlign: "center",
    cursor: "pointer",
  },
  link: {
    fontSize: "0.6rem",
  },
}));
var recent = 0;
setInterval(() => {
  // console.log("reset");
  recent = 0;
}, 2000);

const Profile = ({ match }) => {
  const classes = useStyles();

  const { token, userId, ip } = useContext(AuthContext);

  const [avatar, setAvatar] = useState(null);
  const [name, setName] = useState("");
  const [posts, setPosts] = useState([]);
  const [reqs, setReqs] = useState([]);
  const [follower, setFollower] = useState([]);
  const [following, setFollowing] = useState([]);
  const [followingState, setFollowingState] = useState("Follow");
  const [followingMenuAnchor, setFollowingMenuAnchor] = useState(null);
  const [followerMenuAnchor, setFollowerMenuAnchor] = useState(null);

  const handleFollowing = (event) => {
    setFollowingMenuAnchor(event.currentTarget);
  };
  const handleFollowers = (event) => {
    setFollowerMenuAnchor(event.currentTarget);
  };
  const handleFollowingMenuClose = () => {
    setFollowingMenuAnchor(null);
  };
  const handleFollowerMenuClose = () => {
    setFollowerMenuAnchor(null);
  };

  const fetchData = () => {
    fetch(ip + "/" + (match ? match.params.username : userId), {
      method: "GET",
    })
      .then((res) => {
        if (!(res.status === 200 || res.status === 201 || res.status === 304)) {
          throw new Error("failed!");
        }
        return res.json();
      })
      .then((resBody) => {
        const followers = resBody.followers;
        setReqs(resBody.requests);
        setAvatar(resBody.avatar ? ip + "/" + resBody.avatar : null);
        setName(resBody.firstName + " " + resBody.lastName);
        setFollower(followers);
        setFollowing(resBody.followings);

        if (!reqs.includes(userId) && !followers.includes(userId)) {
          setFollowingState("Follow");
        } else if (!reqs.includes(userId) && followers.includes(userId)) {
          setFollowingState("Unfollow");
        } else if (reqs.includes(userId)) {
          setFollowingState("Request sent");
        }
      })
      .catch((err) => {
        console.log(err);
      });

    fetch(ip + "/posts/userposts/" + (match ? match.params.username : userId), {
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
        setPosts(resBody);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  setTimeout(() => {
    // console.log(recent);
    if (recent === 0) {
      recent = 1;
      fetch(ip + "/" + (match ? match.params.username : userId), {
        method: "GET",
      })
        .then((res) => {
          if (
            !(res.status === 200 || res.status === 201 || res.status === 304)
          ) {
            throw new Error("failed!");
          }
          return res.json();
        })
        .then((resBody) => {
          const reqs = resBody.requests;
          const followers = resBody.followers;
          setFollower(followers);
          setFollowing(resBody.followings);

          if (!reqs.includes(userId) && !followers.includes(userId)) {
            setFollowingState("Follow");
          } else if (!reqs.includes(userId) && followers.includes(userId)) {
            setFollowingState("Unfollow");
          } else if (reqs.includes(userId)) {
            setFollowingState("Request sent");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, 2000);

  if (name === "") {
    fetchData();
  }

  const req = () => {
    const id = match.params.username;
    fetch(ip + "/req/" + id, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
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

  const unfriend = () => {
    const id = match.params.username;
    fetch(ip + "/unfriend/" + id, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
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

  const unreq = () => {
    const id = match.params.username;
    fetch(ip + "/unreq/" + id, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
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

  const followHandle = () => {
    if (followingState === "Unfollow") {
      setFollowingState("Follow");
      unfriend();
    } else if (followingState === "Follow") {
      setFollowingState("Request sent");
      req();
    } else if (followingState === "Request sent") {
      setFollowingState("Follow");
      unreq();
    }
  };

  const updater = () => {
    fetchData();
  };

  const listOfPosts = posts.map((post) => {
    return (
      <Post
        id={post._id}
        key={post._id}
        username={post.username}
        avatarImage={avatar}
        authorName={name}
        postDate={post.date}
        media={ip + "/" + post.media}
        mediaType={post.mediatype === "image" ? "img" : post.mediatype}
        caption={post.text}
        liked={post.likes.includes(userId) ? true : false}
        likeCount={post.likes.length}
        updater={updater}
      />
    );
  });

  return (
    <Container maxWidth="sm">
      <Card className={classes.root}>
        <CardHeader
          title={match ? match.params.username : userId}
          subheader={name}
        />
        <CardContent>
          <Grid container alignItems="center" spacing={2}>
            <Grid className={classes.gridItem} item xs={3}>
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
              >
                <Avatar src={avatar} className={classes.avatar} />
              </Box>
            </Grid>
            <Grid
              className={classes.gridItem}
              item
              xs={3}
              style={{ cursor: "default" }}
            >
              <Link
                className={classes.link}
                component="p"
                color="textPrimary"
                variant="button"
                underline="none"
              >
                Posts
              </Link>
              <Typography variant="subtitle2">{posts.length}</Typography>
            </Grid>
            <Grid
              className={classes.gridItem}
              item
              xs={3}
              aria-haspopup="true"
              aria-controls="followerList"
              onClick={handleFollowers}
            >
              <Link
                className={classes.link}
                component="p"
                color="textPrimary"
                variant="button"
                underline="none"
              >
                Followers
              </Link>
              <Typography variant="subtitle2">{follower.length}</Typography>
            </Grid>
            <Menu
              id="followerList"
              anchorEl={followerMenuAnchor}
              keepMounted
              open={Boolean(followerMenuAnchor)}
              onClose={handleFollowerMenuClose}
              PaperProps={{
                style: {
                  // maxHeight: ITEM_HEIGHT * 2.5,
                  minWidth: "20ch",
                },
              }}
            >
              {follower.length !== 0 ? (
                follower.map((element, index) => {
                  return (
                    <MenuItem key={index} selected={false}>
                      <Link
                        href={"http://localhost:3000/" + element}
                        // component="button"
                        color="textPrimary"
                        variant="button"
                        underline="none"
                      >
                        {element}
                      </Link>
                    </MenuItem>
                  );
                })
              ) : (
                <MenuItem selected={false} disabled>
                  <Link
                    disabled
                    href="#"
                    component="p"
                    color="textSecondary"
                    variant="button"
                    underline="none"
                  >
                    ♫ Lonely, I'm Mr. Lonely~ ♫
                  </Link>
                </MenuItem>
              )}
            </Menu>
            <Grid
              className={classes.gridItem}
              item
              xs={3}
              aria-haspopup="true"
              aria-controls="followingList"
              onClick={handleFollowing}
            >
              <Link
                className={classes.link}
                component="button"
                color="textPrimary"
                variant="button"
                underline="none"
              >
                Following
              </Link>
              <Typography variant="subtitle2">{following.length}</Typography>
            </Grid>
            <Menu
              id="followingList"
              anchorEl={followingMenuAnchor}
              keepMounted
              open={Boolean(followingMenuAnchor)}
              onClose={handleFollowingMenuClose}
              PaperProps={{
                style: {
                  // maxHeight: ITEM_HEIGHT * 2.5,
                  minWidth: "20ch",
                },
              }}
            >
              {following.length !== 0 ? (
                following.map((element, index) => {
                  return (
                    <MenuItem key={index} selected={false}>
                      <Link
                        href={"http://localhost:3000/" + element}
                        // component="button"
                        color="textPrimary"
                        variant="button"
                        underline="none"
                      >
                        {element}
                      </Link>
                    </MenuItem>
                  );
                })
              ) : (
                <MenuItem selected={false} disabled>
                  <Link
                    disabled
                    href="#"
                    component="p"
                    color="textSecondary"
                    variant="button"
                    underline="none"
                  >
                    ♫ I have nobody for my own~ ♫
                  </Link>
                </MenuItem>
              )}
            </Menu>
          </Grid>
          {match && token && match.params.username !== userId && (
            <Button
              style={{ marginTop: "1rem" }}
              color="secondary"
              fullWidth
              variant="outlined"
              onClick={followHandle}
            >
              {followingState}
            </Button>
          )}
        </CardContent>
      </Card>
      <Divider />
      {listOfPosts.length === 0 ? (
        <Box marginTop="2rem">
          <Typography align="center" color="textSecondary" variant="h4">
            No posts yet!
          </Typography>
        </Box>
      ) : (
        listOfPosts
      )}
    </Container>
  );
};

export default Profile;
