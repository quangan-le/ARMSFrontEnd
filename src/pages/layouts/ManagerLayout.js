import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ManagerHeader from "../header/ManagerHeader";
import Sidebar from "../sidebar/Sidebar";
import { Outlet } from "react-router-dom";

const ManagerLayout = ({ role }) => {
    return (
      <div>
        <ManagerHeader />
        <Container fluid>
          <Row>
            <Col md={2}>
              <Sidebar role={role} /> 
            </Col>
            <Col md={10}>
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