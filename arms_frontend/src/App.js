import logo from "./logo.svg";
import "./App.css";
import Header from "./pages/header/Header";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import HomePage from "./pages/homepage/Homepage";

function App() {
  return (
    <Routes>
      <Route path="/homepage" element={<HomePage />} />
    </Routes>
  );
}

export default App;
