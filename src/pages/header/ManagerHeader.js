import React, { useState, useEffect } from "react";
import { Dropdown, Nav, Navbar, NavDropdown, Modal, Button } from 'react-bootstrap';
import { Bell, List, PersonCircle } from "react-bootstrap-icons";
import { useNavigate } from 'react-router-dom';
import api from "../../apiService.js";
import { useAuthStore } from "../../stores/useAuthStore.js";

const ManagerHeader = ({ toggleSidebar, role, campusId}) => {
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
  useEffect(() => {
    const mockNotifications = [
      { id: 1, message: "Thông báo 1" },
      { id: 2, message: "Thông báo 1" },
      { id: 3, message: "Thông báo 1" },
      { id: 4, message: "Thông báo 1" }
    ];
    setNotifications(mockNotifications);
  }, []);

  const handleNotificationToggle = () => {
    setShowNotification(!showNotification);
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
  return (
    <>
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
            <Bell size={24} className="mx-3 text-orange" />
            <Dropdown>
              <Dropdown.Toggle as="span" style={{ cursor: "pointer" }}>
                <PersonCircle size={30} className="text-orange" />
              </Dropdown.Toggle>
              <Dropdown.Menu align="end">
                <Dropdown.Item>Đổi mật khẩu</Dropdown.Item>
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