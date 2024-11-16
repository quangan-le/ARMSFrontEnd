import React, { useEffect } from "react";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState } from '../hooks/Hooks.js';
import { useAuth } from '../../contexts/authContext'

const StudentLayout = () => {
  const { currentUser, userLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const hideHeaderFooter = location.pathname === "/dang-nhap";

  // Quản lý state campus
  const [selectedCampus, setSelectedCampus] = useState({
    id: "",
    name: ""
  });

  // Hàm thay đổi campus
  const handleCampusChange = (campus) => {
    setSelectedCampus(campus);
  };

  return (
    <div className="layout-container">
      {!hideHeaderFooter && (
        <Header onCampusChange={handleCampusChange} />
      )}

      <div className="content">
        <Outlet context={{ selectedCampus }} />
      </div>

      {!hideHeaderFooter && <Footer />}
    </div>
  );
};

export default StudentLayout;