import React from "react";
import { Nav } from "react-bootstrap";

const Sidebar = ({ role }) => {
  return (
    <div style={{ backgroundColor: "#f8f9fa", height: "100vh", padding: "20px" }}>
      <Nav defaultActiveKey="/dashboard" className="flex-column">
        {role === "admin" && (
          <>
            <Nav.Link href="/dashboard">Quản lý người dùng</Nav.Link>
            <Nav.Link href="/settings">Cấu hình hệ thống</Nav.Link>
          </>
        )}
        {role === "manager" && (
          <>
            <Nav.Link href="/reports">Báo cáo</Nav.Link>
            <Nav.Link href="/projects">Quản lý dự án</Nav.Link>
          </>
        )}
        {role === "supervisor" && (
          <>
            <Nav.Link href="/overview">Tổng quan</Nav.Link>
            <Nav.Link href="/tasks">Nhiệm vụ</Nav.Link>
          </>
        )}
      </Nav>
    </div>
  );
};

export default Sidebar;
