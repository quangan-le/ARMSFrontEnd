import React, { useState, useEffect } from "react";
import { Dropdown, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { Bell, List, PersonCircle } from "react-bootstrap-icons";
import { useNavigate } from 'react-router-dom';
import api from "../../apiService.js";
import { doSignOut } from '../../firebase/auth';
import { useAuthStore } from "../../stores/useAuthStore.js";

const ManagerHeader = ({ onCampusChange, toggleSidebar }) => {
  const { removeUser, user } = useAuthStore();

  const [selectedRole, setSelectedRole] = useState("");

  // State để lưu campus được chọn với cả ID và Name
  const [selectedCampus, setSelectedCampus] = useState({
    id: "",
    name: ""
  });
  const navigate = useNavigate();

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
          // Cập nhật `selectedCampus` lên thông qua `onCampusChange`
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

      // Cập nhật `selectedCampus` lên thông qua `onCampusChange`
      onCampusChange({
        id: selected.campusId,
        name: selected.campusName
      });
    }
  };
  const checkPermissions = (role, allowedRoles) => {
    return allowedRoles.includes(role);
  };

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
  const handleLogout = async () => {
    removeUser()
    navigate('/dang-nhap')
    try {
      if (checkPermissions(selectedRole, ["admin", "schoolService", "admissionsOfficer", "admissionsCouncil"])) {
        await doSignOut();
        navigate("/dang-nhap");
      } else {
        console.error("Bạn không có quyền đăng xuất.");
      }
    } catch (error) {
      console.error("Có lỗi xảy ra khi đăng xuất:", error);
    }
  };

  return (
    <Navbar collapseOnSelect expand="lg" className="manager-header bg-body-tertiary px-4 py-2 header-fixed">
      <Navbar.Brand className="mx-5 fw-bold fs-3" style={{ color: 'orange' }}>
        ARMS
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <List size={24} className="text-orange" style={{ cursor: 'pointer', marginLeft: '120px' }} onClick={toggleSidebar} />
        <Nav className="me-auto">
          <Nav.Item className="mx-3" style={{ fontWeight: 'bold', color: 'orange' }}>
            {user.role}
          </Nav.Item>
          <Nav.Item className="mx-3" style={{ fontWeight: 'bold', color: 'orange' }}>
            Cơ sở: {user.campusId}
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
              <Dropdown.Item onClick={handleLogout}>Đăng xuất</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default ManagerHeader;