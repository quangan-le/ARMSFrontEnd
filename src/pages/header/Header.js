// src/components/Header.js
import React from "react";
import { Navbar, Nav, NavDropdown, Container, Button, Dropdown, DropdownButton, Badge, Modal, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from '../hooks/Hooks.js';
import api from "../../apiService.js";
import { Bell, PersonCircle, ArrowRepeat, CashCoin, BoxArrowRight, CheckCircle } from "react-bootstrap-icons";
import { useAuth } from '../../contexts/authContext'
import { doSignOut } from '../../firebase/auth'
import { useAuthStore } from "../../stores/useAuthStore.js";
import { ToastContainer, toast } from 'react-toastify';

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
  const fetchNotifications = async () => {
    try {
      const response = await api.get(`/user/Notification/get-notifications`);
      setNotifications(response.data);
    } catch (error) {
      console.error("Có lỗi xảy ra! vui lòng thử lại sau!", error);
    }
  };
  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleNotificationToggle = () => {
    setShowNotification(!showNotification);
  };
  // Modal xác nhận đăng xuất
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const handleLogoutClick = () => {
    setShowConfirmModal(true);
  };

  // Đăng xuất
  const handleLogout = async () => {
    try {
      await removeUser();
      await doSignOut();
      navigate('/dang-nhap');
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    }
    setShowConfirmModal(false);
  };

  const handleCancelLogout = () => {
    setShowConfirmModal(false); // Đóng modal nếu người dùng chọn hủy
  };

  const [loadingId, setLoadingId] = useState(null);
  const markAsRead = async (id) => {
    setLoadingId(id);
    try {
      // Gọi API cập nhật trạng thái thông báo
      const response = await api.put(`/user/Notification/update-notification?NotificationId=` + id);

      if (response.data.status === true) {
        // Cập nhật state khi API thành công
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) =>
            notification.notificationId === id
              ? { ...notification, isRead: true }
              : notification
          )
        );

      } else {
        toast.error("Cập nhật thông báo thất bại!");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra! Vui lòng thử lại sau!");
    } finally {
      setLoadingId(null); // Tắt trạng thái loading
    }
  };
  const allNotificationsRead = notifications.every((notification) => notification.isRead);
  const markAllAsRead = async () => {
    // Lọc những thông báo chưa đọc
    const unreadNotifications = notifications.filter((notification) => !notification.isRead);

    try {
      for (const notification of unreadNotifications) {
        await markAsRead(notification.notificationId);
      }
      fetchNotifications();
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
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
                <Dropdown
                  className="notification-dropdown me-4"
                  show={showNotification}
                  onToggle={handleNotificationToggle}
                >
                  {/* Nút chuông */}
                  <Dropdown.Toggle
                    as="span"
                    className="notification-icon"
                    onClick={() => setShowNotification(!showNotification)}
                    style={{ cursor: "pointer" }}
                  >
                    <Bell size={24} />
                    <Badge pill bg="danger" className="notification-badge">
                      {notifications.filter((n) => !n.isRead).length}
                    </Badge>
                  </Dropdown.Toggle>

                  {/* Danh sách thông báo */}
                  <Dropdown.Menu align="end" style={{ maxHeight: "300px", overflowY: "auto" }}>
                    {notifications.length > 0 ? (
                      <>
                        <Dropdown.Item
                          className="d-flex justify-content-between align-items-center"
                          style={{
                            color: allNotificationsRead ? "#6c757d" : "green",
                            pointerEvents: allNotificationsRead ? "none" : "auto",
                          }}
                          onClick={allNotificationsRead ? null : () => markAllAsRead()}
                        >
                          <span style={{ color: allNotificationsRead ? "#6c757d" : "green" }}>
                            Đánh dấu đã đọc tất cả
                          </span>
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        {notifications.map((notification) => (
                          <Dropdown.Item
                            key={notification.notificationId}
                            className="d-flex justify-content-between align-items-center"
                            style={{
                              backgroundColor: notification.isRead ? "#f8f9fa" : "white",
                              color: notification.isRead ? "#6c757d" : "black",
                            }}
                          >
                            <span>{notification.content}</span>
                            {!notification.isRead && (
                              <Button
                                variant="link"
                                onClick={() => markAsRead(notification.notificationId)}
                                style={{ color: "green" }}
                              >
                                {loadingId === notification.notificationId ? (
                                  <Spinner animation="border" size="sm" />
                                ) : (
                                  <CheckCircle size={20} />
                                )}
                              </Button>
                            )}
                          </Dropdown.Item>
                        ))}
                      </>
                    ) : (
                      <Dropdown.Item>Không có thông báo</Dropdown.Item>
                    )}
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
                    <Dropdown.Item onClick={handleLogoutClick}><BoxArrowRight className="me-2" style={{ color: 'orange' }} />Đăng xuất</Dropdown.Item>
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
        <Modal
          show={showConfirmModal}
          onHide={handleCancelLogout}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title className="text-center w-100 text-orange">Xác nhận đăng xuất</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center">
            Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-center gap-2">
            <Button
              variant="secondary"
              onClick={handleCancelLogout}
              style={{ flex: 1 }}
            >
              Hủy
            </Button>
            <Button
              variant="warning"
              onClick={handleLogout}
              style={{ flex: 1 }}
            >
              Đăng xuất
            </Button>
          </Modal.Footer>
        </Modal>
      </Navbar>
    </>
  );
};

export default Header;