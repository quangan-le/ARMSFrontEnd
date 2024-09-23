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
import ProgramDetail from './pages/homepage/ProgramDetail.js';
import Blog from "./pages/homepage/Blog.js";
import BlogDetail from "./pages/homepage/BlogDetail.js";
import Information from "./pages/homepage/Infomation.js";
import Application from "./pages/homepage/Application.js";
import Advisory from "./pages/homepage/Advisory.js";
import Login from "./pages/login/Login.js";

function LayoutWrapper({ children }) {
  const location = useLocation();
  const hideHeaderFooter = location.pathname === "/dang-nhap";
  return (
    <>
      {!hideHeaderFooter && <Header />}
      {children}
      {!hideHeaderFooter && <Footer />}
    </>
  );
}

function App() {
  return (
      <LayoutWrapper>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/lich-su-thanh-lap" element={<History />} />
          <Route path="/phuong-cham-dao-tao" element={<Motto />} />
          <Route path="/thanh-tich" element={<Achievement />} />
          <Route path="/vi-sao-chon-chung-toi" element={<WhyChoose />} />
          <Route path="/tin-tuc" element={<Blog />} />
          <Route path="/tin-tuc/:id" element={<BlogDetail />} />
          <Route path="/nganh-hoc" element={<Programs />} />
          <Route path="/nganh-hoc/:majorField" element={<ProgramDetail />} />
          <Route path="/nganh-hoc/:majorField/:minorField" element={<ProgramDetail />} />
          <Route path="/tuyen-sinh" element={<Information />} />
          <Route path="/nop-ho-so" element={<Application />} />
          <Route path="/dang-ky" element={<Advisory />} />
          <Route path="/dang-nhap" element={<Login />} />
        </Routes>
      </LayoutWrapper>
  );
}

export default App;