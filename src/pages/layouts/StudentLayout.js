import React from "react";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import { Outlet, useLocation } from "react-router-dom";
import { useState } from '../hooks/Hooks.js';

const StudentLayout = () => {
  // Quản lý state campus
  const [selectedCampus, setSelectedCampus] = useState({
    id: "",
    name: ""
  });

  const location = useLocation();
  const hideHeaderFooter = location.pathname === "/dang-nhap";

  // Hàm thay đổi campus
  const handleCampusChange = (campus) => {
    setSelectedCampus(campus);
  };
  return (
    <div>
      {!hideHeaderFooter && (
         <Header onCampusChange={handleCampusChange} />
      )}

      <Outlet context={{ selectedCampus }} />

      {!hideHeaderFooter && <Footer />}
    </div>
  );
};

export default StudentLayout;