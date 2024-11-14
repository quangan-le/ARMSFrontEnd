import React from "react";
import { Nav } from "react-bootstrap";
import { BarChart, Bell, Book, FileEarmarkText, FileText, House, People } from 'react-bootstrap-icons'; // Import các icon

const Sidebar = ({ role }) => {
  return (
    <div className="sidebar">
      <div>
        <h6 className="mb-2">Hệ thống Quản lý tuyển sinh</h6>
        <h6 className="mb-3 text-orange">Trường nghề</h6>

        <Nav defaultActiveKey="/dashboard" className="flex-column">
          {role === "admin" && (
            <>
              <Nav.Link href="/admin/dashboard" className="d-flex align-items-center">
                <House className="me-2" /> Trang chủ
              </Nav.Link>
              <Nav.Link href="/admin/danh-sach-nguoi-dung" className="d-flex align-items-center">
                <Book className="me-2" /> Quản lý người dùng
              </Nav.Link>
              <Nav.Link href="/admin/danh-sach-yeu-cau-phe-duyet-tai-khoan" className="d-flex align-items-center">
                <Book className="me-2" /> Danh sách yêu cầu phê duyệt tài khoản
              </Nav.Link>
              <Nav.Link href="/admin/danh-sach-nganh-hoc" className="d-flex align-items-center">
                <Book className="me-2" /> Ngành đào tạo
              </Nav.Link>

              {/* <Nav className="flex-column ms-3">
                <Nav.Link href="/ke-hoach-tuyen-sinh" className="d-flex align-items-center">
                  <FileEarmarkText className="me-2" /> Kế hoạch tuyển sinh
                </Nav.Link>
                <Nav.Link href="/chi-tieu-tuyen-sinh" className="d-flex align-items-center">
                  <FileEarmarkText className="me-2" /> Chỉ tiêu tuyển sinh
                </Nav.Link>
              </Nav> */}

            </>
          )}
          {role === "schoolService" && (
            <>
              <Nav.Link href="/school-service/dashboard" className="d-flex align-items-center">
                <House className="me-2" /> Trang chủ
              </Nav.Link>
              <Nav.Link href="/school-service/danh-sach-nganh-hoc" className="d-flex align-items-center">
                <Book className="me-2" /> Ngành đào tạo
              </Nav.Link>
              <Nav.Link href="/school-service/danh-sach-tin-tuc" className="d-flex align-items-center">
                <Book className="me-2" /> Danh sách tin tức
              </Nav.Link>
              <Nav.Link href="/school-service/danh-sach-dang-ky-tuyen-sinh" className="d-flex align-items-center">
                <Book className="me-2" /> Yêu cầu đăng ký tuyển sinh
              </Nav.Link>
              <Nav.Link href="/school-service/danh-sach-yeu-cau-chuyen-nganh" className="d-flex align-items-center">
                <Book className="me-2" /> Yêu cầu chuyển ngành
              </Nav.Link>
              <Nav.Link href="/school-service/danh-sach-yeu-cau-rut-ho-so" className="d-flex align-items-center">
                <Book className="me-2" /> Yêu cầu rút hồ sơ
              </Nav.Link>
              <Nav.Link href="/school-service/danh-sach-thong-bao" className="d-flex align-items-center">
                <Book className="me-2" /> Quản lý thông báo
              </Nav.Link>
            </>
          )}
          {role === "admissionsOfficer" && (
            <>
              <Nav.Link href="/admissions-officer/dashboard" className="d-flex align-items-center">
                <House className="me-2" /> Trang chủ
              </Nav.Link>
              <Nav.Link href="/admissions-officer/danh-sach-nganh-hoc" className="d-flex align-items-center">
                <Book className="me-2" /> Ngành đào tạo
              </Nav.Link>
              <Nav.Link href="/admissions-officer/danh-sach-dang-ky-tu-van-tuyen-sinh" className="d-flex align-items-center">
                <Book className="me-2" /> Danh sách đăng ký tư vấn tuyển sinh
              </Nav.Link>
            </>
          )}
          {role === "admissionCouncil" && (
            <>
              <Nav.Link href="/admissions-council/dashboard" className="d-flex align-items-center">
                <House className="me-2" /> Trang chủ
              </Nav.Link>
              <Nav.Link href="/admissions-council/danh-sach-nganh-hoc" className="d-flex align-items-center">
                <Book className="me-2" /> Ngành đào tạo
              </Nav.Link>
              <Nav.Link href="/admissions-council/ke-hoach-tuyen-sinh" className="d-flex align-items-center">
                <FileEarmarkText className="me-2" /> Kế hoạch tuyển sinh
              </Nav.Link>
              <Nav.Link href="/admissions-council/thong-tin-tuyen-sinh" className="d-flex align-items-center">
                <FileEarmarkText className="me-2" /> Thông tin tuyển sinh
              </Nav.Link>
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
        <Nav.Link href="/team" className="d-flex align-items-center mb-2">
          <People className="me-2" /> Đội ngũ phát triển
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;
