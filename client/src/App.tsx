import { Route, Routes } from "react-router";
import OnlinePage from "./pages/OnlinePage";
import GamePage from "./pages/GamePage";
import Homepage from "./pages/HomePage";
import RoomLobby from "./pages/RoomLobby";
import OnlineGamePage from "./pages/OnlineGamePage";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Homepage />}></Route>
        <Route path="/online" element={<OnlinePage />}></Route>
        <Route path="/game" element={<GamePage />}></Route>
        <Route
          path="/onlineGame/:roomCode"
          element={<OnlineGamePage />}
        ></Route>
        <Route path="/roomgame" element={<RoomLobby />}></Route>
      </Routes>
    </div>
  );
};

export default App;
