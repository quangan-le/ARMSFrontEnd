import React from "react";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import { Outlet, useLocation } from "react-router-dom";

const StudentLayout = () => {
    const location = useLocation();
    const hideHeaderFooter = location.pathname === "/dang-nhap";
    return (
        <div>
          {!hideHeaderFooter && <Header />}
          <Outlet />
          {!hideHeaderFooter && <Footer />}
        </div>
      );
  };
  
  export default StudentLayout;