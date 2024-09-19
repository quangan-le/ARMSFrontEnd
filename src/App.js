import logo from "./logo.svg";
import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Header from "./pages/header/Header.js";
import Footer from "./pages/footer/Footer.js";
import HomePage from "./pages/homepage/Homepage";
import History from "./pages/homepage/History";
import Motto from "./pages/homepage/Motto.js";
import Achievement from "./pages/homepage/Achievement.js";
import WhyChoose from "./pages/homepage/WhyChoose.js";
import Programs from "./pages/homepage/Programs.js";
import Blog from "./pages/homepage/Blog.js";

function App() {
  return (
    <>
    <Header />
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/lich-su-thanh-lap" element={<History />} />
      <Route path="/phuong-cham-dao-tao" element={<Motto />} />
      <Route path="/thanh-tich" element={<Achievement />} />
      <Route path="/vi-sao-chon-chung-toi" element={<WhyChoose />} />
      <Route path="/nganh-hoc" element={<Programs />} />
      <Route path="/tin-tuc" element={<Blog />} />


    </Routes>
    <Footer />
    </>
  );
}

export default App;
