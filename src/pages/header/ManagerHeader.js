import React, { useState } from "react";
import { Navbar, Dropdown, Nav, Container, NavDropdown } from "react-bootstrap";
import { Bell, PersonCircle, List  } from "react-bootstrap-icons";

const ManagerHeader = ({ toggleSidebar }) => { 
    const [selectedBranch, setSelectedBranch] = useState("Hà Nội");
    const [selectedRole, setSelectedRole] = useState("Admin");

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
                        <NavDropdown.Item eventKey="Admin">Admin</NavDropdown.Item>
                        <NavDropdown.Item eventKey="Manager">Manager</NavDropdown.Item>
                        <NavDropdown.Item eventKey="Supervisor">Supervisor</NavDropdown.Item>
                    </NavDropdown>
                    <NavDropdown
                        title={selectedBranch}
                        id="branch-dropdown"
                        onSelect={(key) => setSelectedBranch(key)}
                        style={{ fontWeight: 'bold', color: 'orange' }}
                    >
                        <NavDropdown.Item eventKey="Hà Nội">Cơ sở Hà Nội</NavDropdown.Item>
                        <NavDropdown.Item eventKey="Hồ Chí Minh">Cơ sở Hồ Chí Minh</NavDropdown.Item>
                        <NavDropdown.Item eventKey="Đà Nẵng">Cơ sở Đà Nẵng</NavDropdown.Item>
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