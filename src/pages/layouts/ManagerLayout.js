import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import ManagerHeader from "../header/ManagerHeader";
import Sidebar from "../sidebar/Sidebar";
import { useAuthStore } from "../../stores/useAuthStore.js";

const ManagerLayout = ({ role }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const { user } = useAuthStore();
  const campusId = user.campusId;

  return (
    <div>
      <ManagerHeader
        toggleSidebar={toggleSidebar}
        role={role}
        campusId={campusId}
      />

      <Container fluid>
        <Row>
          {isSidebarOpen && (
            <Col md={2} className="sidebar-container">
              <Sidebar role={role} />
            </Col>
          )}

          <Col
            md={isSidebarOpen ? 10 : 12}
            className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}
          >
            {/* Render nested routes with context */}
            <Outlet context={{ campusId }} />
          </Col>
        </Row>
      </Container>
    </div>

  );
};

export default ManagerLayout;
