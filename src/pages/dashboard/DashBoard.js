import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from './Sidebar';  // Sidebar bên trái
import Header from './Header';    // Header của dashboard
import Footer from './Footer';    // Footer của dashboard

const Dashboard = ({ children }) => {
  return (
    <div className="dashboard-layout">
      <Header />
      <Container fluid>
        <Row>
          <Col md={3} className="dashboard-sidebar">
            <Sidebar />
          </Col>
          
          <Col md={9} className="dashboard-content">
            {children}
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
};

export default Dashboard;