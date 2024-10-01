import logo from "./logo.svg";
import "./App.css";
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import StudentLayout from "./pages/layouts/StudentLayout";
import ManagerLayout from "./pages/layouts/ManagerLayout.js";

import HomePage from "./pages/homepage/Homepage";
import History from "./pages/homepage/History";
import Motto from "./pages/homepage/Motto.js";
import Achievement from "./pages/homepage/Achievement.js";
import WhyChoose from "./pages/homepage/WhyChoose.js";
import Programs from "./pages/homepage/Programs.js";
import ProgramDetail from './pages/homepage/ProgramDetail.js';
import Blog from "./pages/blog/Blog.js";
import BlogDetail from "./pages/blog/BlogDetail.js";
import Information from "./pages/homepage/Infomation.js";
import Application from "./pages/records/Application.js";
import Advisory from "./pages/homepage/Advisory.js";
import Login from "./pages/login/Login.js";
import ApplicationSearch from "./pages/records/ApplicationSearch.js";
import ApplicationUpdate from "./pages/records/ApplicationUpdate.js";
import Dashboard from "./pages/dashboard/DashBoard.js";

function App() {
  //const user = { role: "admin" };
  return (
    <Routes>
      <Route element={<StudentLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/dang-nhap" element={<Login />} />
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
        <Route path="/tra-cuu-ho-so" element={<ApplicationSearch />} />
        <Route path="/cap-nhat-ho-so" element={<ApplicationUpdate />} />
      </Route>

      {/* {user && user.role && (
          <Route element={<ManagerLayout role={user.role} />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        )} */}

      <Route element={<ManagerLayout role="admin" />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
      
      {/* Redirect nếu không có quyền */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;