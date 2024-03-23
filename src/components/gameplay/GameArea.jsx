import { Button, Divider, Grid, Stack } from "@mui/material";
import React, { useEffect } from "react";
import gameAreaConfig from "../../config/gamearea.config.json";
import { openDB, updateData } from "../../db/methods";
const GameArea = () => {
  const action = (move) => {
    let db;
    openDB(
      process.env.REACT_APP_DB_NAME,
      process.env.REACT_APP_DB_VERSION,
      process.env.REACT_APP_STORE_NAME
    ).then(async (database) => {
      db = database;
      await updateData(db, process.env.REACT_APP_STORE_NAME, {
        userName: sessionStorage.getItem("activeUser"),
        isPlaying: true,
        move: move,
      });
    });
  };
  const exitGame = () => {
    let db;
    openDB(
      process.env.REACT_APP_DB_NAME,
      process.env.REACT_APP_DB_VERSION,
      process.env.REACT_APP_STORE_NAME
    ).then(async (database) => {
      db = database;
      await updateData(db, process.env.REACT_APP_STORE_NAME, {
        userName: sessionStorage.getItem("activeUser"),
        isPlaying: false,
        move: "",
      });
    });
  };
  useEffect(() => {
    return () => {
      exitGame();
    };
  }, []);
  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={12} md={6}>
          <Stack direction={"column"} spacing={5}>
            <Button
              variant="outlined"
              color="info"
              onClick={() => {
                action(gameAreaConfig.moves[0]);
              }}
            >
              {gameAreaConfig.moves[0]}
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                action(gameAreaConfig.moves[1]);
              }}
            >
              {gameAreaConfig.moves[1]}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => {
                action(gameAreaConfig.moves[2]);
              }}
            >
              {gameAreaConfig.moves[2]}
            </Button>
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          B
        </Grid>
      </Grid>
    </>
  );
};

export default GameArea;
