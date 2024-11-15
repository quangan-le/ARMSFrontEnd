import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./contexts/authContext";
import AccountList from "./pages/admin/AccountList.js";
import MajorDetail from "./pages/admin/MajorDetail.js";
import MajorsList from "./pages/admin/MajorsList.js";
import UserList from "./pages/admin/UserList.js";
import Blog from "./pages/blog/Blog.js";
import BlogDetail from "./pages/blog/BlogDetail.js";
import Dashboard from "./pages/dashboard/DashBoard.js";
import Achievement from "./pages/homepage/Achievement.js";
import Advisory from "./pages/homepage/Advisory.js";
import History from "./pages/homepage/History";
import HomePage from "./pages/homepage/Homepage";
import Information from "./pages/homepage/Infomation.js";
import Motto from "./pages/homepage/Motto.js";
import ProgramDetail from './pages/homepage/ProgramDetail.js';
import Programs from "./pages/homepage/Programs.js";
import WhyChoose from "./pages/homepage/WhyChoose.js";
import ManagerLayout from "./pages/layouts/ManagerLayout.js";
import StudentLayout from "./pages/layouts/StudentLayout";
import Login from "./pages/login/Login.js";
import Application from "./pages/records/Application.js";
import ApplicationSearch from "./pages/records/ApplicationSearch.js";
import ApplicationUpdate from "./pages/records/ApplicationUpdate.js";
import IntermediateApplication from "./pages/records/IntermediateApplication.js";

import PlanAdmission from "./pages/admissionCouncil/PlanAdmission.js";
import AdmissionRegistrationList from "./pages/admissionsOfficer/AdmissionRegistrationList.js";
import MajorsListView from "./pages/schoolService/MajorsListView.js";
import NewsList from "./pages/schoolService/NewsList.js";
import RequestChangeMajorList from "./pages/schoolService/RequestChangeMajorList.js";
import RequestsForWithdrawalList from "./pages/schoolService/RequestsForWithdrawalList.js";
import RequestForTransfer from "./pages/student/RequestForTransfer.js";
import RequestForWithdraw from "./pages/student/RequestForWithdraw.js";
import StudentProfile from "./pages/student/StudentProfile.js";
import AdmissionRegistrationList from "./pages/admissionsOfficer/AdmissionRegistrationList.js";
import StudentConsultationList from "./pages/admissionsOfficer/StudentConsultationList.js";
import SendNotification from "./pages/schoolService/SendNotification.js";


function App() {
  //const user = { role: "admin" };
  return (
    <AuthProvider>
      <Routes>
        <Route element={<StudentLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/dang-nhap" element={<Login />} />
          <Route path="/lich-su-thanh-lap" element={<History />} />
          <Route path="/phuong-cham-dao-tao" element={<Motto />} />
          <Route path="/thanh-tich" element={<Achievement />} />
          <Route path="/vi-sao-chon-chung-toi" element={<WhyChoose />} />
          <Route path="/tin-tuc" element={<Blog />} />
          <Route path="/tin-tuc/:blogId" element={<BlogDetail />} />
          <Route path="/nganh-hoc" element={<Programs />} />
          <Route path="/nganh-hoc/:majorID/:admissionInformationID" element={<ProgramDetail />} />
          <Route path="/tuyen-sinh" element={<Information />} />
          <Route path="/nop-ho-so" element={<Application />} />
          <Route path="/nop-ho-so-lien-thong" element={<IntermediateApplication />} />
          <Route path="/dang-ky" element={<Advisory />} />
          <Route path="/tra-cuu-ho-so" element={<ApplicationSearch />} />
          <Route path="/cap-nhat-ho-so" element={<ApplicationUpdate />} />
          <Route path="/yeu-cau-chuyen-nganh" element={<RequestForTransfer />} />
          <Route path="/yeu-cau-rut-ho-so" element={<RequestForWithdraw />} />
          <Route path="/thong-tin-ca-nhan" element={<StudentProfile />} />

        </Route>
        {/* {user && user.role && (
          <Route element={<ManagerLayout role={user.role} />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        )} */}

        <Route element={<ManagerLayout role="admin" />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/danh-sach-nguoi-dung" element={<UserList />} />
          <Route path="/admin/danh-sach-nganh-hoc" element={<MajorsList />} />
          <Route path="/admin/chi-tiet-nganh-hoc/:majorID" element={<MajorDetail />} />
          <Route path="/admin/danh-sach-yeu-cau-phe-duyet-tai-khoan" element={<AccountList />} />
        </Route>
        <Route element={<ManagerLayout role="schoolService" />}>
          <Route path="/school-service/dashboard" element={<Dashboard />} />
          <Route path="/school-service/danh-sach-nganh-hoc" element={<MajorsListView />} />
          <Route path="/school-service/chi-tiet-nganh-hoc/:majorID" element={<MajorDetail />} />
          <Route path="/school-service/danh-sach-tin-tuc" element={<NewsList />} />
          <Route path="/school-service/danh-sach-dang-ky-tuyen-sinh" element={<AdmissionRegistrationList />} />
          <Route path="/school-service/danh-sach-yeu-cau-chuyen-nganh" element={<RequestChangeMajorList />} />
          <Route path="/school-service/danh-sach-yeu-cau-rut-ho-so" element={<RequestsForWithdrawalList />} />
          <Route path="/school-service/danh-sach-thong-bao" element={<SendNotification />} />

        </Route>
{/* 
        <Route element={<ManagerLayout role="admissionsOfficer" />}>
          <Route path="/admissions-officer/dashboard" element={<Dashboard />} />
          <Route path="/admissions-officer/danh-sach-nganh-hoc" element={<MajorsListView />} />
          <Route path="/admissions-officer/chi-tiet-nganh-hoc/:majorID" element={<MajorDetail />} />
          <Route path="/admissions-officer/danh-sach-dang-ky-tu-van-tuyen-sinh" element={< StudentConsultationList/>} />
        </Route> */}

        {/* <Route element={<ManagerLayout role="admissionCouncil" />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/danh-sach-nganh-hoc" element={<MajorsListView />} />
          <Route path="/chi-tiet-nganh-hoc/:majorID" element={<MajorDetail />} />
          <Route path="/ke-hoach-tuyen-sinh" element={<EnrollmentPlanList />} />
          <Route path="/chinh-sua-ke-hoach-tuyen-sinh" element={<EnrollmentPlanEdit />} />
          <Route path="/thong-tin-tuyen-sinh" element={<ThresholdScoreList />} />
        </Route> */}
        <Route element={<ManagerLayout role="admissionCouncil" />}>
          <Route path="/admissions-council/dashboard" element={<Dashboard />} />
          <Route path="/admissions-council/ke-hoach-tuyen-sinh" element={<PlanAdmission />} />
        </Route>

        {/* Redirect nếu không có quyền */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;