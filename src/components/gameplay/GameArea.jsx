import { Button, Divider, Grid, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import gameAreaConfig from "../../config/gamearea.config.json";
import { openDB, readData, updateData } from "../../db/methods";
import WinnerModal from "../modal/WinnerModal";
const GameArea = () => {
  const [playerAction, setPlayerAction] = useState("");
  const [winner, setWinner] = useState("");
  const [openWinnerModal, setOpenWinnerModal] = useState(false);
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

      let data = await readData(
        db,
        process.env.REACT_APP_STORE_NAME,
        sessionStorage.getItem("opponent")
      );
      if (data.move !== "") {
        calculateScore(data.move, move);
      }
      setPlayerAction(move);
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
        roomId: "",
        requestedBy: "",
      });
      setPlayerAction("");
      window.close();
    });
  };

  const updateScore = (player) => {
    let db;
    openDB(
      process.env.REACT_APP_DB_NAME,
      process.env.REACT_APP_DB_VERSION,
      process.env.REACT_APP_STORE_NAME
    ).then(async (database) => {
      db = database;
      let existingScore = await readData(
        db,
        process.env.REACT_APP_STORE_NAME,
        player
      );
      await updateData(db, process.env.REACT_APP_STORE_NAME, {
        userName: player,
        isPlaying: false,
        move: "",
        roomId: "",
        score: existingScore?.score + 1,
        requestedBy: "",
      });
      setPlayerAction("");
    });
  };

  const calculateScore = (opponentPlayerAction, currentPlayerAction) => {
    if (currentPlayerAction && opponentPlayerAction) {
      if (currentPlayerAction === opponentPlayerAction) {
        setWinner("It is Tie");
        setOpenWinnerModal(true);
      } else if (
        (currentPlayerAction === "Rock" &&
          opponentPlayerAction === "Scissors") ||
        (currentPlayerAction === "Paper" && opponentPlayerAction === "Rock") ||
        (currentPlayerAction === "Scissors" && opponentPlayerAction === "Paper")
      ) {
        updateScore(sessionStorage.getItem("activeUser"));
        setOpenWinnerModal(true);
      } else {
        updateScore(sessionStorage.getItem("opponent"));
        setWinner(sessionStorage.getItem("opponent"));
        setOpenWinnerModal(true);
      }
    }
  };

  useEffect(() => {
    return () => {
      exitGame();
    };
  }, []);
  return (
    <>
      <Grid container spacing={1} padding={2}>
        <Grid item xs={12} md={12}>
          <Stack spacing={2} direction={"row"}>
            <Button fullWidth variant="outlined">
              {gameAreaConfig.playAgain}
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                exitGame();
              }}
            >
              {gameAreaConfig.exitGame}
            </Button>
          </Stack>
        </Grid>
      </Grid>
      <Grid container spacing={1}>
        <Grid item xs={12} md={12}>
          <Stack direction={"column"} spacing={5}>
            <Button
              variant="outlined"
              color="info"
              disabled={playerAction !== ""}
              onClick={() => {
                action(gameAreaConfig.moves[0]);
              }}
            >
              {gameAreaConfig.moves[0]}
            </Button>
            <Button
              variant="outlined"
              color="primary"
              disabled={playerAction !== ""}
              onClick={() => {
                action(gameAreaConfig.moves[1]);
              }}
            >
              {gameAreaConfig.moves[1]}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              disabled={playerAction !== ""}
              onClick={() => {
                action(gameAreaConfig.moves[2]);
              }}
            >
              {gameAreaConfig.moves[2]}
            </Button>
          </Stack>
        </Grid>
        <Grid item xs={12} md={12} textAlign={"center"}>
          <Divider />
          {playerAction !== "" && (
            <Typography variant="h5">Waiting for Opponent Response</Typography>
          )}
        </Grid>
      </Grid>
      <WinnerModal
        winner={winner}
        open={openWinnerModal}
        setOpen={setOpenWinnerModal}
      />
    </>
  );
};

export default GameArea;
