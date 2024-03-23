import {
  Avatar,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import leaderboardConfig from "../config/leaderboard.config.json";
import { addData, openDB, readData } from "../db/methods";
const Leaderboard = () => {
  const [playersList, setPlayersList] = useState([]);

  const getPlayersList = () => {
    let db;
    openDB(
      process.env.REACT_APP_DB_NAME,
      process.env.REACT_APP_DB_VERSION,
      process.env.REACT_APP_STORE_NAME
    ).then(async (database) => {
      db = database;
      const list = await readData(db, process.env.REACT_APP_STORE_NAME);
      setPlayersList(list);
    });
  };

  React.useEffect(() => {
    getPlayersList();
  }, []);
  return (
    <div>
      <Typography variant="h3">{leaderboardConfig.title}</Typography>
      <Grid container>
        <List
          sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        >
          {playersList.map((eachPlayer) => (
            <ListItem key={eachPlayer?.userName} alignItems="flex-start">
              <ListItemAvatar>
                <Avatar
                  alt={eachPlayer?.userName}
                  src="/static/images/avatar/1.jpg"
                />
              </ListItemAvatar>
              <ListItemText primary={eachPlayer?.userName} />
              <ListItemText primary={eachPlayer?.score} />
            </ListItem>
          ))}
        </List>
      </Grid>
    </div>
  );
};

export default Leaderboard;
