import React, { useEffect } from "react";
import { Button, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import lobbyConfig from "../../config/lobby.config.json";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import gameImage from "../assets/images/RockPaperScissors.gif";
import { openDB, readData, updateData } from "../../db/methods";
const Lobby = () => {
  let navigate = useNavigate();
  const [activeUser, setActiveUser] = React.useState("");
  const [availablePlayers, setAvailablePlayers] = React.useState([]);
  const [isRequesting, setIsRequesting] = React.useState({
    requestedBy: "",
    isRequesting: false,
  });
  const playWith = (opponentPlayer) => {
    sessionStorage.setItem("opponent", opponentPlayer);

    let db;
    openDB(
      process.env.REACT_APP_DB_NAME,
      process.env.REACT_APP_DB_VERSION,
      process.env.REACT_APP_STORE_NAME
    ).then(async (database) => {
      db = database;

      if (!isRequesting.isRequesting) {
        const list = await updateData(db, process.env.REACT_APP_STORE_NAME, {
          userName: activeUser,
          isPlaying: true,
          roomId: activeUser + " " + opponentPlayer,
        });
        const opponent = await updateData(
          db,
          process.env.REACT_APP_STORE_NAME,
          {
            userName: opponentPlayer,
            requestedBy: activeUser,
          }
        );
      } else {
        const list = await updateData(db, process.env.REACT_APP_STORE_NAME, {
          userName: activeUser,
          isPlaying: true,
          roomId: opponentPlayer + " " + activeUser,
          requestedBy: "",
        });
      }
    });
    window.open(
      "/playgame",
      "game",
      "height=900,width=900"
    );
  };
  const getPlayersList = () => {
    let db;
    openDB(
      process.env.REACT_APP_DB_NAME,
      process.env.REACT_APP_DB_VERSION,
      process.env.REACT_APP_STORE_NAME
    ).then(async (database) => {
      db = database;
      const list = await readData(db, process.env.REACT_APP_STORE_NAME);
      if (list !== availablePlayers) {
        setAvailablePlayers(
          list.filter(
            (eachPlayer) =>
              eachPlayer.userName !== sessionStorage.getItem("activeUser")
          )
        );
      }
    });
  };

  const opponentRequesting = () => {
    let db;
    openDB(
      process.env.REACT_APP_DB_NAME,
      process.env.REACT_APP_DB_VERSION,
      process.env.REACT_APP_STORE_NAME
    ).then(async (database) => {
      db = database;
      const list = await readData(
        db,
        process.env.REACT_APP_STORE_NAME,
        sessionStorage.getItem("activeUser")
      );
      if (list?.requestedBy && !isRequesting.isRequesting) {
        setIsRequesting({
          requestedBy: list?.requestedBy,
          isRequesting: true,
        });
      }
    });
  };

  // let pollLeaderboardData = setInterval(() => {
  //   getPlayersList();
  //   opponentRequesting();
  // }, 2000);
  useEffect(() => {
    if (sessionStorage.getItem("activeUser")) {
      setActiveUser(sessionStorage.getItem("activeUser"));
      getPlayersList();
      opponentRequesting();
    } else {
      navigate("/");
    }
    // return () => {
    //   clearInterval(pollLeaderboardData);
    // };
  }, []);

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} md={6}>
        <Typography variant="h5">{`Hi, ${activeUser} click on play button to start a game.`}</Typography>
        {isRequesting.isRequesting && (
          <>
            <Typography variant="h6">{`Hi, ${isRequesting.requestedBy} Requesting to play.`}</Typography>
            <Button
              variant="outlined"
              onClick={() => {
                playWith(isRequesting.requestedBy);
              }}
            >
              Play
            </Button>
          </>
        )}
        <List
          dense
          sx={{ width: "95%", bgcolor: "background.paper", margin: "20px" }}
        >
          <Typography
            variant="h5"
            margin="0px 0px 10px 10px"
          >{`Online Players List`}</Typography>
          {availablePlayers.map((value) => {
            const labelId = `checkbox-list-secondary-label-${value.userName}`;
            return (
              <ListItem
                key={value.userName}
                secondaryAction={
                  <Button
                    variant="contained"
                    color="info"
                    disabled={value.isPlaying}
                    onClick={(e) => {
                      playWith(value.userName);
                    }}
                  >
                    {value.isPlaying ? "In game" : "Play"}
                  </Button>
                }
                disablePadding
              >
                <ListItemButton>
                  <ListItemAvatar>
                    <Avatar alt={`Avatar n°${value.userName}`} src={""} />
                  </ListItemAvatar>
                  <ListItemText id={labelId} primary={`${value.userName}`} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Grid>
      <Grid item xs={12} md={6}>
        <img
          src={gameImage}
          alt="Game Image"
          style={{ maxWidth: "100%", height: "100vh" }}
        />
      </Grid>
    </Grid>
  );
};

export default Lobby;
