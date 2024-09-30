import React, { useState } from "react";
import { Navbar, Dropdown, Nav, Container, NavDropdown } from "react-bootstrap";
import { Bell, PersonCircle } from "react-bootstrap-icons";

const ManagerHeader = () => {
    const [selectedBranch, setSelectedBranch] = useState("Hà Nội");
    const [selectedRole, setSelectedRole] = useState("Admin");

    return (
        <Navbar collapseOnSelect expand="lg" className="manager-header bg-body-tertiary mx-5 text-orange">
            <Navbar.Brand href="/dashboard" className="mx-5 fw-bold fs-4">ARMS</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto">
                    {/* Dropdown chọn cơ sở */}
                    <NavDropdown
                        title={selectedBranch}
                        id="branch-dropdown"
                        onSelect={(key) => setSelectedBranch(key)}
                    >
                        <NavDropdown.Item eventKey="Hà Nội">Cơ sở Hà Nội</NavDropdown.Item>
                        <NavDropdown.Item eventKey="Hồ Chí Minh">Cơ sở Hồ Chí Minh</NavDropdown.Item>
                        <NavDropdown.Item eventKey="Đà Nẵng">Cơ sở Đà Nẵng</NavDropdown.Item>
                    </NavDropdown>

                    {/* Dropdown chọn quyền */}
                    <NavDropdown
                        title={selectedRole}
                        id="role-dropdown"
                        onSelect={(key) => setSelectedRole(key)}
                        className="mx-3"
                    >
                        <NavDropdown.Item eventKey="Admin">Admin</NavDropdown.Item>
                        <NavDropdown.Item eventKey="Manager">Manager</NavDropdown.Item>
                        <NavDropdown.Item eventKey="Supervisor">Supervisor</NavDropdown.Item>
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