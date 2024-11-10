import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import ManageHeader from "../header/ManageHeader";
import Sidebar from "../sidebar/Sidebar";

const ManagerLayout = ({ role }) => {
  const [selectedCampus, setSelectedCampus] = useState({
    id: "",
    name: ""
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  // Hàm thay đổi campus
  const handleCampusChange = (campus) => {
    setSelectedCampus(campus);
  };
  return (
    <div>
      {/* Header */}
      <ManageHeader onCampusChange={handleCampusChange} toggleSidebar={toggleSidebar} />

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
            <Outlet context={{ selectedCampus }} />
          </Col>
        </Row>
      </Container>
    </div>

  );
};

export default ManagerLayout;
