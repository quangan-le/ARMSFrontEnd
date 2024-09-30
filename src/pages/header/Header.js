// src/components/Header.js
import React from "react";
import { Navbar, Nav, NavDropdown, Container, Button, Dropdown, DropdownButton } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useState, useEffect } from '../hooks/Hooks.js';
import api from "../../apiService.js";

const Header = () => {
  const [selectedCampus, setSelectedCampus] = useState("");
  // State để lưu dữ liệu campus từ API
  const [data, setData] = useState([]);

  // Hàm xử lý khi chọn campus từ Dropdown
  const handleSelect = (campusName) => {
    setSelectedCampus(campusName);
  };

  // Gọi API để lấy danh sách các campus 
  useEffect(() => {
    const fetchCampuses = async () => {
      try {
        const response = await api.get("/Campus/get-campuses");
        const hoChiMinhCampus = response.data.find(
          campus => campus.campusId.includes("HCM")
        );
        if (hoChiMinhCampus) {
          setSelectedCampus(hoChiMinhCampus.campusName);
        }
        setData(response.data);
      } catch (error) {
        console.error("Có lỗi xảy ra khi kết nối API:", error);
      }
    };

    fetchCampuses();
  }, []);
  return (
    <Navbar expand="lg" className="student-header">
      <Container>
        <DropdownButton id="dropdown-basic-button" title={selectedCampus} onSelect={handleSelect}>
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