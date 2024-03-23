import React, { useState } from "react";
import { Button, Divider, Grid, Input, Stack, Typography } from "@mui/material";
import Leaderboard from "../Leaderboard";
import homeConfig from "../../config/home.config.json";
import { useNavigate } from "react-router-dom";
import { addData, openDB, readData } from "../../db/methods";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
const Home = () => {
  const [value, setValue] = React.useState(0);

  let navigate = useNavigate();
  const [playerName, setPlayerName] = useState("");
  const playNow = (e) => {
    e.stopPropagation();
    const playerDetails = {
      userName: playerName,
      score: 0,
    };
    let db;
    openDB(
      process.env.REACT_APP_DB_NAME,
      process.env.REACT_APP_DB_VERSION,
      process.env.REACT_APP_STORE_NAME
    )
      .then(async (database) => {
        db = database;
        const status = await readData(
          db,
          process.env.REACT_APP_STORE_NAME,
          playerDetails.userName
        );
        if (status && status.length > 0) {
          throw new Error("duplicate Username");
        }
      })
      .then(async (database) => {
        if (value > 0) {
          const status = await addData(
            db,
            process.env.REACT_APP_STORE_NAME,
            playerDetails
          );
        }
        sessionStorage.setItem("activeUser",playerName)
        navigate("/lobby");
      })
      .catch((err) => {
        console.log(err, "err");
        alert(err);
      });
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Grid container spacing={1} justifyContent={"center"}>
        <Grid item xs={12}>
          <Typography variant="h2" align="center">
            {homeConfig.gameTitle}
          </Typography>
        </Grid>
      </Grid>
      <Grid container spacing={1} justifyContent={"center"}>
        <Grid item xs={12} md={2}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="disabled tabs example"
          >
            <Tab label="Login" />
            <Tab label="Register" />
          </Tabs>
        </Grid>
      </Grid>
      <Grid container spacing={1} justifyContent={"center"}>
        <Grid item xs={12} md={4}>
          <Stack direction={"column"}>
            <Input
              type="text"
              placeholder="Enter Username"
              onChange={(e) => {
                setPlayerName(e.target.value);
              }}
            ></Input>
            <Button variant="contained" color="primary" onClick={playNow}>
              Play Now
            </Button>
          </Stack>
        </Grid>
        <Divider />
      </Grid>

      <Grid container spacing={1} justifyContent={"center"}>
        <Grid item xs={12} md={4}>
          <Leaderboard />
        </Grid>
      </Grid>
    </>
  );
};

export default Home;
