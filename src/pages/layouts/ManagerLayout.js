import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import ManagerHeader from "../header/ManagerHeader";
import Sidebar from "../sidebar/Sidebar";
import { Outlet } from "react-router-dom";

const ManagerLayout = ({ role }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <div>
      <ManagerHeader toggleSidebar={toggleSidebar} />
      <Container fluid>
        <Row>
          {isSidebarOpen && (
            <Col md={2} className="sidebar-container">
              <Sidebar role={role} />
            </Col>
          )}
          <Col md={isSidebarOpen ? 10 : 12} className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
          <div>
              <Outlet />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ManagerLayout;