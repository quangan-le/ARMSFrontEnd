// src/components/Header.js
import React from "react";
import { Navbar, Nav, NavDropdown, Container, Button, Dropdown, DropdownButton, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from '../hooks/Hooks.js';
import api from "../../apiService.js";
import { Bell, PersonCircle, ArrowRepeat, CashCoin, BoxArrowRight } from "react-bootstrap-icons";
import { useAuth } from '../../contexts/authContext'
import { doSignOut } from '../../firebase/auth'
import { useAuthStore } from "../../stores/useAuthStore.js";

const Header = ({ onCampusChange }) => {
  const { currentUser, userLoggedIn } = useAuth();
  if (currentUser) {
    console.log("currentUser:", currentUser);
  }
  const { removeUser } = useAuthStore()
  const navigate = useNavigate();

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
          const fourCampus = response.data[2];
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

  // Thông báo
  const [notifications, setNotifications] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  useEffect(() => {
    const mockNotifications = [
      { id: 1, message: "Hồ sơ của bạn đã được duyệt" },
      { id: 2, message: "Lịch học kỳ mới đã được cập nhật" },
      { id: 3, message: "Hạn nộp học phí sắp tới" },
      { id: 4, message: "Yêu cầu chuyển ngành đã được phê duyệt" }
    ];
    setNotifications(mockNotifications);
  }, []);

  const handleNotificationToggle = () => {
    setShowNotification(!showNotification);
  };

  // Đăng xuất
  const handleLogout = async () => {
    try {
      removeUser()
      await doSignOut();
      navigate('/dang-nhap');
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    }
  };

  return (
    <Navbar expand="lg" className="student-header">
      <Container>
        <DropdownButton className="campus-dropdown" id="dropdown-basic-button" title={selectedCampus.name} onSelect={handleSelect}>
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
            <NavDropdown title="Nộp hồ sơ" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/nop-ho-so">Nộp hồ sơ</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/nop-ho-so-lien-thong">Nộp hồ sơ liên thông</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link as={Link} to="/tra-cuu-ho-so">Tra cứu hồ sơ</Nav.Link>
          </Nav>
          {userLoggedIn ? (
            <Nav>
              <Dropdown className="notification-dropdown me-4" show={showNotification}
                onToggle={handleNotificationToggle}
                onMouseEnter={() => setShowNotification(true)}
                onMouseLeave={() => setShowNotification(false)}>
                <Dropdown.Toggle as="span" className="notification-icon" style={{ background: "orange" }}>
                  <Bell size={24} />
                  <Badge pill bg="danger" className="notification-badge">
                    {notifications.length}
                  </Badge>
                </Dropdown.Toggle>
                <Dropdown.Menu align="end" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {notifications.map((notification) => (
                    <Dropdown.Item key={notification.id}>
                      {notification.message}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
              <Dropdown
                onMouseEnter={() => setShowAvatarMenu(true)}
                onMouseLeave={() => setShowAvatarMenu(false)}
                show={showAvatarMenu}
              >
                <Dropdown.Toggle as="span" style={{ cursor: "pointer", background: "orange" }}>
                  <img src={currentUser.photoURL} alt="avatar" className="user-avatar rounded-circle me-2" style={{ width: "30px", height: "30px" }} />
                  {currentUser.displayName}
                </Dropdown.Toggle>
                <Dropdown.Menu align="end">
                  <Dropdown.Item as={Link} to="/thong-tin-ca-nhan"><PersonCircle className="me-2" style={{ color: 'orange' }} />Thông tin cá nhân</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/yeu-cau-chuyen-nganh"><ArrowRepeat className="me-2" style={{ color: 'orange' }} />Yêu cầu chuyển ngành</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/yeu-cau-rut-ho-so"><CashCoin className="me-2" style={{ color: 'orange' }} />Yêu cầu rút hồ sơ và hoàn học phí</Dropdown.Item>
                  <Dropdown.Item onClick={handleLogout}><BoxArrowRight className="me-2" style={{ color: 'orange' }} />Đăng xuất</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          ) : (
            <Button variant="light" as={Link} to="/dang-nhap" style={{ color: 'orange' }}>
              Đăng Nhập
            </Button>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;