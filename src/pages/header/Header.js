// src/components/Header.js
import React from "react";
import { Navbar, Nav, NavDropdown, Container, Button, Dropdown, DropdownButton } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useState, useEffect } from '../hooks/Hooks.js';
import api from "../../apiService.js";

const Header = ({ onCampusChange }) => {
   // State để lưu campus được chọn với cả ID và Name
   const [selectedCampus, setSelectedCampus] = useState({
    id: "", 
    name: ""
  });
  // State để lưu dữ liệu campus từ API
  const [data, setData] = useState([]);

  // Gọi API để lấy danh sách các campus 
  useEffect(() => {
    const fetchCampuses = async () => {
      try {
        const response = await api.get("/Campus/get-campuses");
        setData(response.data);

        if (response.data.length >= 4) {
          const fourCampus = response.data[3];
          setSelectedCampus({
            id: fourCampus.campusId,
            name: fourCampus.campusName
          });
          // Cập nhật `selectedCampus` lên StudentLayout thông qua `onCampusChange`
          onCampusChange({
            id: fourCampus.campusId,
            name: fourCampus.campusName
          });
        }

      } catch (error) {
        console.error("Có lỗi xảy ra khi kết nối API:", error);
      }
    };

    fetchCampuses();
  }, []);

  const handleSelect = (campusName) => {
    const selected = data.find((c) => c.campusName === campusName);
    if (selected) {
      setSelectedCampus({
        id: selected.campusId,
        name: selected.campusName
      });
      
      // Cập nhật `selectedCampus` lên StudentLayout thông qua `onCampusChange`
      onCampusChange({
        id: selected.campusId,
        name: selected.campusName
      });
    }
  };
  
  return (
    <Navbar expand="lg" className="student-header">
      <Container>
        <DropdownButton id="dropdown-basic-button" title={selectedCampus.name} onSelect={handleSelect}>
          {data && data.length > 0 ? (
            data.map((campus) => (
              <Dropdown.Item key={campus.campusId} eventKey={campus.campusName}>
                {campus.campusName}
              </Dropdown.Item>
            ))
          ) : (
            <Dropdown.Item disabled>Không có cơ sở nào</Dropdown.Item>
          )}
        </DropdownButton>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link as={Link} to="/">Trang chủ</Nav.Link>
            <NavDropdown title="Giới thiệu" id="basic-nav-dropdown" className="gioi-thieu-dropdown">
              <NavDropdown.Item as={Link} to="/lich-su-thanh-lap">Lịch sử thành lập</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/phuong-cham-dao-tao">Phương châm đào tạo</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/vi-sao-chon-chung-toi">Vì Sao Chọn Chúng Tôi</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/thanh-tich">Thành tích</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link as={Link} to="/tin-tuc">Tin tức</Nav.Link>
            <Nav.Link as={Link} to="/nganh-hoc">Ngành học</Nav.Link>
            <Nav.Link as={Link} to="/tuyen-sinh">Tuyển sinh</Nav.Link>
            <Nav.Link as={Link} to="/nop-ho-so">Nộp hồ sơ</Nav.Link>
            <Nav.Link as={Link} to="/tra-cuu-ho-so">Tra cứu hồ sơ</Nav.Link>
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