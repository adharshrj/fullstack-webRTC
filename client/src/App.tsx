import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Room from "./pages/Room";
import ChatProvider from "./context/ChatContext";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/room/:id"
        element={
          <ChatProvider>
            <Room />
          </ChatProvider>
        }
      />
    </Routes>
  );
}

export default App;
