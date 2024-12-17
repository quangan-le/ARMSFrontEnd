import React, { useEffect, useState } from "react";
import { Badge, Button, Dropdown, Modal, Nav, Navbar, Spinner } from 'react-bootstrap';
import { Bell, CheckCircle, List, PersonCircle } from "react-bootstrap-icons";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import api from "../../apiService.js";
import { useAuthStore } from "../../stores/useAuthStore.js";
const ManagerHeader = ({ toggleSidebar, role, campusId }) => {
  const { removeUser } = useAuthStore();
  const navigate = useNavigate();

  // State để lưu dữ liệu campus từ API
  const [campusList, setCampusList] = useState([]);

  useEffect(() => {
    const fetchCampuses = async () => {
      try {
        const response = await api.get("/Campus/get-campuses");
        setCampusList(response.data);
      } catch (error) {
        console.error("Có lỗi xảy ra khi kết nối API:", error);
      }
    };
    fetchCampuses();
  }, []);

  // Lấy tên campus từ ID
  const campusName = campusList.find(campus => campus.campusId === campusId)?.campusName || "Cơ sở chưa xác định";

  // Map role ID 
  const roleNames = {
    Admin: "Quản trị viên",
    AdmissionOfficer: "Cán bộ tuyển sinh",
    SchoolService: "Dịch vụ sinh viên",
    AdmissionCouncil: "Hội đồng tuyển sinh",
  };
  const roleName = roleNames[role] || "Vai trò chưa xác định";

  // Thông báo
  const [notifications, setNotifications] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const fetchNotifications = async () => {
    try {
      if (campusId) {
        const response = await api.get(`/user/Notification/get-notifications`);
        setNotifications(response.data);
      }
    } catch (error) {
      console.error("Có lỗi xảy ra! vui lòng thử lại sau!", error);
    }
  };
  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleNotificationToggle = (isOpen) => {
    setShowNotification(isOpen);
  };
  // Đăng xuất
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const handleLogout = async () => {
    try {
      removeUser();
      navigate('/dang-nhap');
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    }
    setShowConfirmModal(false);
  };

  const handleCancelLogout = () => {
    setShowConfirmModal(false);
  };

  const handleShowLogoutModal = () => {
    setShowConfirmModal(true);
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
      <Navbar collapseOnSelect expand="lg" className="manager-header bg-body-tertiary px-4 py-2 header-fixed">
        <Navbar.Brand className="mx-5 fw-bold fs-3" style={{ color: 'orange' }}>
          ARMS
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <List size={24} className="text-orange" style={{ cursor: 'pointer', marginLeft: '120px' }} onClick={toggleSidebar} />
          <Nav className="me-auto">
            <Nav.Item className="mx-3" style={{ fontWeight: 'bold', color: 'orange' }}>
              {roleName}
            </Nav.Item>
            <Nav.Item className="mx-3" style={{ fontWeight: 'bold', color: 'orange' }}>
              Cơ sở: {campusName}
            </Nav.Item>
          </Nav>

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
            <Dropdown>
              <Dropdown.Toggle as="span" style={{ cursor: "pointer" }}>
                <PersonCircle size={30} className="text-orange" />
              </Dropdown.Toggle>
              <Dropdown.Menu align="end">
                <Dropdown.Item onClick={() => navigate("/doi-mat-khau")}>
                  Đổi mật khẩu
                </Dropdown.Item>
                <Dropdown.Item onClick={handleShowLogoutModal}>Đăng xuất</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      {/* Modal Xác nhận Đăng xuất */}
      <Modal show={showConfirmModal} onHide={handleCancelLogout} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-center w-100 text-orange">Xác nhận đăng xuất</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center gap-2">
          <Button variant="secondary" onClick={handleCancelLogout} style={{ flex: 1 }}>
            Hủy
          </Button>
          <Button variant="warning" onClick={handleLogout} style={{ flex: 1 }}>
            Đăng xuất
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ManagerHeader;