import React from "react";
import { Nav } from "react-bootstrap";
import {
  BarChart, Bell, Book, Calendar,
  Chat,
  FileEarmarkText,
  FileLock,
  FileText, House, People,
  Person, ShieldLock,
  ClipboardCheck, 
  Diagram3, 
  CalendarEvent, 
  CreditCard2Back
} from 'react-bootstrap-icons';

import { NavLink } from "react-router-dom";

const Sidebar = ({ role }) => {
  return (
    <div className="sidebar">
      <div>
        <h6 className="mb-2">Hệ thống Quản lý tuyển sinh</h6>
        <h6 className="mb-3 text-orange">Trường nghề</h6>

        <Nav className="flex-column">
          {role === "Admin" && (
            <>
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) =>
                  `d-flex align-items-center nav-link ${isActive ? "active-link" : ""}`}>
                <House className="me-2" /> Trang chủ
              </NavLink>
              <NavLink
                to="/admin/danh-sach-nguoi-dung"
                className={({ isActive }) =>
                  `d-flex align-items-center nav-link ${isActive ? "active-link" : ""}`
                }
              >
                <Person className="me-2" /> Quản lý người dùng
              </NavLink>
              <NavLink
                to="/admin/danh-sach-yeu-cau-phe-duyet-tai-khoan"
                className={({ isActive }) =>
                  `d-flex align-items-center nav-link ${isActive ? "active-link" : ""}`
                }
              >
                <ShieldLock className="me-2" /> Phê duyệt tài khoản
              </NavLink>
              <NavLink
                to="/admin/danh-sach-nganh-hoc"
                className={({ isActive }) =>
                  `d-flex align-items-center nav-link ${isActive ? "active-link" : ""}`
                }
              >
                <Book className="me-2" /> Ngành đào tạo
              </NavLink>
              <NavLink
                to="/user/thanh-toan-hoa-don"
                className={({ isActive }) =>
                  `d-flex align-items-center nav-link ${isActive ? "active-link" : ""}`
                }
              >
                <Calendar className="me-2" /> Thanh toán hóa đơn
              </NavLink>
            </>
          )}

          {role === "SchoolService" && (
            <>
              <NavLink
                to="/school-service/dashboard"
                className={({ isActive }) =>
                  `d-flex align-items-center nav-link ${isActive ? "active-link" : ""}`
                }
              >
                <House className="me-2" /> Trang chủ
              </NavLink>
              <NavLink
                to="/school-service/danh-sach-nganh-hoc"
                className={({ isActive }) =>
                  `d-flex align-items-center nav-link ${isActive ? "active-link" : ""}`
                }
              >
                <Diagram3 className="me-2" /> Ngành tuyển sinh
              </NavLink>
              <NavLink
                to="/school-service/danh-sach-tin-tuc"
                className={({ isActive }) =>
                  `d-flex align-items-center nav-link ${isActive ? "active-link" : ""}`
                }
              >
                <FileEarmarkText className="me-2" /> Quản lý tin tức
              </NavLink>
              <NavLink
                to="/tin-tuc"
                className={({ isActive }) =>
                  `d-flex align-items-center nav-link ${isActive ? "active-link" : ""}`
                }
              >
                <FileEarmarkText className="me-2" /> Danh sách tin tức
              </NavLink>

              <NavLink
                to="/school-service/danh-sach-yeu-cau-chuyen-nganh"
                className={({ isActive }) =>
                  `d-flex align-items-center nav-link ${isActive ? "active-link" : ""}`
                }
              >
                <FileText className="me-2" /> Yêu cầu chuyển ngành
              </NavLink>
              <NavLink
                to="/school-service/danh-sach-yeu-cau-rut-ho-so"
                className={({ isActive }) =>
                  `d-flex align-items-center nav-link ${isActive ? "active-link" : ""}`
                }
              >
                <FileLock className="me-2" /> Yêu cầu rút hồ sơ
              </NavLink>
              <NavLink
                to="/school-service/danh-sach-thong-bao"
                className={({ isActive }) =>
                  `d-flex align-items-center nav-link ${isActive ? "active-link" : ""}`
                }
              >
                <Bell className="me-2" /> Quản lý thông báo
              </NavLink>
              <NavLink
                to="/school-service/danh-sach-dang-ky-tu-van"
                className={({ isActive }) =>
                  `d-flex align-items-center nav-link ${isActive ? "active-link" : ""}`
                }
              >
                <Chat className="me-2" /> Gửi yêu cầu đăng ký tư vấn
              </NavLink>
            </>
          )}
          {role === "AdmissionOfficer" && (
            <>
              <NavLink
                to="/admissions-officer/dashboard"
                className={({ isActive }) =>
                  `d-flex align-items-center nav-link ${isActive ? "active-link" : ""}`
                }
              >
                <House className="me-2" /> Trang chủ
              </NavLink>
              <NavLink
                to="/admissions-officer/danh-sach-dang-ky-tuyen-sinh"
                className={({ isActive }) =>
                  `d-flex align-items-center nav-link ${isActive ? "active-link" : ""}`
                }
              >
                <ClipboardCheck className="me-2" /> Yêu cầu đăng ký tuyển sinh
              </NavLink>
              <NavLink
                to="/admissions-officer/danh-sach-nganh-tuyen-sinh"
                className={({ isActive }) =>
                  `d-flex align-items-center nav-link ${isActive ? "active-link" : ""}`
                }
              >
                <Diagram3 className="me-2" /> Ngành tuyển sinh
              </NavLink>
              <NavLink
                to="/admissions-officer/danh-sach-dang-ky-tu-van-tuyen-sinh"
                className={({ isActive }) =>
                  `d-flex align-items-center nav-link ${isActive ? "active-link" : ""}`
                }
              >
                <Chat className="me-2" /> Danh sách đăng ký tư vấn
              </NavLink>
              <NavLink
                to="/user/thanh-toan-hoa-don"
                className={({ isActive }) =>
                  `d-flex align-items-center nav-link ${isActive ? "active-link" : ""}`
                }
              >
                <CreditCard2Back className="me-2" /> Thanh toán hóa đơn
              </NavLink>
            </>
          )}

          {role === "AdmissionCouncil" && (
            <>
              <NavLink
                to="/admissions-council/dashboard"
                className={({ isActive }) =>
                  `d-flex align-items-center nav-link ${isActive ? "active-link" : ""}`
                }
              >
                <House className="me-2" /> Trang chủ
              </NavLink>
              <NavLink
                to="/admissions-council/danh-sach-dang-ky-tuyen-sinh"
                className={({ isActive }) =>
                  `d-flex align-items-center nav-link ${isActive ? "active-link" : ""}`
                }
              >
                <ClipboardCheck className="me-2" /> Yêu cầu đăng ký tuyển sinh
              </NavLink>
              <NavLink
                to="/admissions-council/danh-sach-nganh-tuyen-sinh"
                className={({ isActive }) =>
                  `d-flex align-items-center nav-link ${isActive ? "active-link" : ""}`
                }
              >
                <Diagram3  className="me-2" /> Ngành tuyển sinh
              </NavLink>
              <NavLink
                to="/admissions-council/ke-hoach-tuyen-sinh"
                className={({ isActive }) =>
                  `d-flex align-items-center nav-link ${isActive ? "active-link" : ""}`
                }
              >
                <CalendarEvent  className="me-2" /> Kế hoạch tuyển sinh
              </NavLink>
              <NavLink
                to="/user/thanh-toan-hoa-don"
                className={({ isActive }) =>
                  `d-flex align-items-center nav-link ${isActive ? "active-link" : ""}`
                }
              >
                <CreditCard2Back className="me-2" /> Thanh toán hóa đơn
              </NavLink>
              {/* <NavLink
                to="/admissions-council/thong-tin-tuyen-sinh"
                className={({ isActive }) =>
                  `d-flex align-items-center nav-link ${isActive ? "active-link" : ""}`
                }
              >
                <InfoCircle className="me-2" /> Thông tin tuyển sinh
              </NavLink> */}
            </>
          )}
        </Nav>
      </div>
      <Nav className="flex-column">
       
      </Nav>
    </div>
  );
};

export default Sidebar;
