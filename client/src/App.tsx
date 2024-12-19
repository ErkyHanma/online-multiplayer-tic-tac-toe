import { Route, Routes } from "react-router";
import OnlinePage from "./pages/OnlinePage";
import GamePage from "./pages/GamePage";
import Homepage from "./pages/HomePage";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Homepage />}></Route>
        <Route path="/online" element={<OnlinePage />}></Route>
        <Route path="/game" element={<GamePage />}></Route>
      </Routes>
    </div>
  );
};

export default App;
