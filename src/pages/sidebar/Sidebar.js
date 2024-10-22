import React from "react";
import { Nav } from "react-bootstrap";
import { House, Book, Bell, FileText, BarChart, InfoCircle, People } from 'react-bootstrap-icons'; // Import các icon

const Sidebar = ({ role }) => {
  return (
    <div className="sidebar">
      <div>
        <h6 className="mb-2">Hệ thống Quản lý tuyển sinh</h6>
        <h6 className="mb-3 text-orange">Trường nghề</h6>

        <Nav defaultActiveKey="/dashboard" className="flex-column">
          {role === "admin" && (
            <>
              <Nav.Link href="/dashboard" className="d-flex align-items-center">
                <House className="me-2" /> Trang chủ
              </Nav.Link>
              <Nav.Link href="/danh-sach-nguoi-dung" className="d-flex align-items-center">
                <Book className="me-2" /> Quản lý người dùng
              </Nav.Link>
              <Nav.Link href="/danh-sach-yeu-cau-phe-duyet-tai-khoan" className="d-flex align-items-center">
                <Book className="me-2" /> Danh sách yêu cầu phê duyệt tài khoản
              </Nav.Link>
              <Nav.Link href="/danh-sach-nganh-hoc" className="d-flex align-items-center">
                <Book className="me-2" /> Ngành đào tạo
              </Nav.Link>

            </>
          )}
          {role === "manager" && (
            <>
              <Nav.Link href="/reports">Báo cáo</Nav.Link>
              <Nav.Link href="/projects">Quản lý dự án</Nav.Link>
            </>
          )}
          {role === "supervisor" && (
            <>
              <Nav.Link href="/overview">Tổng quan</Nav.Link>
              <Nav.Link href="/tasks">Nhiệm vụ</Nav.Link>
            </>
          )}
        </Nav>
      </div>
      <Nav className="flex-column">
        <Nav.Link href="/notifications" className="d-flex align-items-center">
          <Bell className="me-2" /> Thông báo
        </Nav.Link>
        <Nav.Link href="/requirements" className="d-flex align-items-center">
          <FileText className="me-2" /> Yêu cầu
        </Nav.Link>
        <Nav.Link href="/reports" className="d-flex align-items-center">
          <BarChart className="me-2" /> Báo cáo
        </Nav.Link>
        <Nav.Link href="/statistics" className="d-flex align-items-center">
          <BarChart className="me-2" /> Thống kê
        </Nav.Link>
        <h6 className="text-muted mt-4">Về chúng tôi</h6>
        <Nav.Link href="/team" className="d-flex align-items-center">
          <People className="me-2" /> Đội ngũ phát triển
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;
