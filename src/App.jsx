import React from "react";
import ReactDOM from "react-dom";

import "./index.css";
import Home from "./components/home/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Lobby from "./components/lobby/Lobby";
import GameArea from "./components/gameplay/GameArea";
const App = () => (
  <div>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/lobby" element={<Lobby />}></Route>
        <Route path="/playGame" element={<GameArea />}></Route>
        <Route path="/*" element={<Home />}></Route>
      </Routes>

    </BrowserRouter>
  </div>
);
ReactDOM.render(<App />, document.getElementById("app"));
