// src/components/Header.js
import React from 'react';
import { Navbar, Nav, Container, Button, Dropdown, DropdownButton } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useState } from '../hooks/Hooks.js';


const Header = () => {
  const [selectedCampus, setSelectedCampus] = useState("Hồ Chí Minh");
  const [data, setData] = useState(null);

  const handleSelect = (campus) => {
    setSelectedCampus(campus);
  };
  return (
    <Navbar expand="lg">
      <Container>
        <DropdownButton id="dropdown-basic-button"title={selectedCampus} onSelect={handleSelect}>
          <Dropdown.Item eventKey="Hà Nội">Hà Nội</Dropdown.Item>
          <Dropdown.Item eventKey="Hồ Chí Minh">Hồ Chí Minh</Dropdown.Item>
          <Dropdown.Item eventKey="Đà Nẵng">Đà Nẵng</Dropdown.Item>
        </DropdownButton>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link as={Link} to="/">Trang Chủ</Nav.Link>
            <Nav.Link as={Link} to="/gioi-thieu">Giới Thiệu</Nav.Link>
            <Nav.Link as={Link} to="/tin-tuc">Tin Tức</Nav.Link>
            <Nav.Link as={Link} to="/vi-sao-chon-chung-toi">Vì Sao Chọn Chúng Tôi</Nav.Link>
            <Nav.Link as={Link} to="/nganh-hoc">Ngành Học</Nav.Link>
            <Nav.Link as={Link} to="/tuyen-sinh">Tuyển Sinh</Nav.Link>
            <Nav.Link as={Link} to="/nop-ho-so">Nộp Hồ Sơ</Nav.Link>
          </Nav>
          <Button variant="light" as={Link} to="/dang-nhap" style={{ color: 'orange' }}>
            Đăng Nhập
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;