import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Grid
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
      if(list.length !== playersList.length){
        setPlayersList(list);
      }
    });
  };
  let pollLeaderBoardData = setInterval(()=>{
    getPlayersList()
  },2000)
  React.useEffect(() => {
    return()=>{
      clearInterval(pollLeaderBoardData)
    }
  }, []);
  return (
    <div>
      <Typography variant="h3" color="grey" marginBottom="10px">
        {leaderboardConfig.title}
      </Typography>
      <Grid container>
        {playersList?.length > 0 ? (
          <TableContainer
            component={Paper}
            style={{ maxHeight: "250px", overflow: "auto" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    {leaderboardConfig.tableColums.player}
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    {leaderboardConfig.tableColums.score}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {playersList.map((eachPlayer) => (
                  <TableRow key={eachPlayer?.userName}>
                    <TableCell component="th" scope="row">
                      {eachPlayer?.userName}
                    </TableCell>
                    <TableCell>
                      {eachPlayer?.score !== undefined
                        ? eachPlayer?.score
                        : leaderboardConfig.notavailable}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="h6" color="grey" marginBottom="10px">
            {leaderboardConfig.noPlayers}
          </Typography>
        )}
      </Grid>
    </div>
  );
};

export default Leaderboard;
