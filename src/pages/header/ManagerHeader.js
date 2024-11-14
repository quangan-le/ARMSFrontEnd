// src/components/Header.js
import React, { useState, useEffect } from "react";
import { Dropdown, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { Bell, List, PersonCircle } from "react-bootstrap-icons";
import { useNavigate } from 'react-router-dom';
import api from "../../apiService.js";
import { doSignOut } from '../../firebase/auth';

const ManagerHeader = ({ onCampusChange, toggleSidebar }) => {
    const [selectedBranch, setSelectedBranch] = useState("Hà Nội");
    const [selectedRole, setSelectedRole] = useState("schoolService");
  
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
    try {
      await doSignOut();
      navigate('/dang-nhap');
    } catch (error) {
      console.error("Có lỗi xảy ra khi đăng xuất:", error);
    }
  };

  return (
    <Navbar collapseOnSelect expand="lg" className="manager-header bg-body-tertiary px-4 py-2 header-fixed">
            <Navbar.Brand href="/dashboard" className="mx-5 fw-bold fs-3" style={{ color: 'orange' }}>
                ARMS
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <List size={24} className="text-orange" style={{ cursor: 'pointer', marginLeft: '120px' }} onClick={toggleSidebar} />
                <Nav className="me-auto">
                    <NavDropdown
                        title={selectedRole}
                        id="role-dropdown"
                        onSelect={(key) => setSelectedRole(key)}
                        className="mx-3"
                        style={{ fontWeight: 'bold', color: 'orange' }}
                    >
                        <NavDropdown.Item eventKey="admin">Admin</NavDropdown.Item>
                        <NavDropdown.Item eventKey="schoolService">School Service</NavDropdown.Item>
                        <NavDropdown.Item eventKey="admissionsOfficer">Admissions Officer</NavDropdown.Item>
                    </NavDropdown>
                    <NavDropdown
                        title={selectedCampus.name}
                        id="role-dropdown"
                        //onSelect={(key) => setSelectedRole(key)}
                        className="mx-3"
                        style={{ fontWeight: 'bold', color: 'orange' }}
                    >
                            {data && data.length > 0 ? (
                            data.map((campus) => (
                            <Dropdown.Item
                                key={campus.campusId}
                                onClick={() => handleSelect(campus.campusName)}
                            >
                                {campus.campusName}
                            </Dropdown.Item>
                            ))
                        ) : (
                            <Dropdown.Item disabled>Không có cơ sở nào</Dropdown.Item>
                        )}
                    </NavDropdown>
                </Nav>
                <Nav>
                    <Bell size={24} className="mx-3 text-orange" />
                    <Dropdown>
                        <Dropdown.Toggle as="span" style={{ cursor: "pointer" }}>
                            <PersonCircle size={30} className="text-orange" />
                        </Dropdown.Toggle>
                        <Dropdown.Menu align="end">
                            <Dropdown.Item>Đổi mật khẩu</Dropdown.Item>
                            <Dropdown.Item>Đăng xuất</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
  );
};

export default ManagerHeader;