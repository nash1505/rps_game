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
import { openDB, readData, updateData } from "../../db/methods";
const Lobby = () => {
  let navigate = useNavigate();
  const [activeUser, setActiveUser] = React.useState("");
  const [availablePlayers, setAvailablePlayers] = React.useState([]);
  const [isRequesting, setIsRequesting] = React.useState(false);

  const playWith = (opponentPlayer) => {
    let db;
    openDB(
      process.env.REACT_APP_DB_NAME,
      process.env.REACT_APP_DB_VERSION,
      process.env.REACT_APP_STORE_NAME
    ).then(async (database) => {
      db = database;
      const list = await updateData(db, process.env.REACT_APP_STORE_NAME, {
        userName: activeUser,
        isPlaying: true,
        roomId: activeUser + " " + opponentPlayer,
      });
      const opponent = await updateData(db, process.env.REACT_APP_STORE_NAME, {
        userName: opponentPlayer,
        requestedBy: activeUser,
      });
    });
    window.open(
      "http://localhost:8000/playgame",
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
      setAvailablePlayers(
        list.filter(
          (eachPlayer) =>
            eachPlayer.userName !== sessionStorage.getItem("activeUser")
        )
      );
    });
  };
  useEffect(() => {
    if(sessionStorage.getItem("activeUser")){
      setActiveUser(sessionStorage.getItem("activeUser"));
      getPlayersList();
    }else{
      navigate("/")
    }
  }, []);
  // constantly poll mode to check whether it is requesting or not
  return (
    <Grid container spacing={1}>
      <Grid item xs={12} md={8}>
        <Typography variant="h5">{`Hi, ${activeUser} click on play button to start a game.`}</Typography>
        <List
          dense
          sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        >
          {availablePlayers.map((value) => {
            const labelId = `checkbox-list-secondary-label-${value.userName}`;
            return (
              <ListItem
                key={value.userName}
                secondaryAction={
                  <Button
                    variant="contained"
                    color="info"
                    onClick={(e) => {
                      playWith(value.userName);
                    }}
                  >
                    Play
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
    </Grid>
  );
};

export default Lobby;
