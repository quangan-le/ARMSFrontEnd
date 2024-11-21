import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import "./App.css";
import { useAuth } from "./contexts/authContext/index.js";
import { useAuthStore } from "./stores/useAuthStore.js";

import AccountList from "./pages/admin/AccountList.js";
import MajorDetail from "./pages/admin/MajorDetail.js";
import MajorsList from "./pages/admin/MajorsList.js";
import UserList from "./pages/admin/UserList.js";
import Blog from "./pages/blog/Blog.js";
import BlogDetail from "./pages/blog/BlogDetail.js";
import Dashboard from "./pages/dashboard/DashBoard.js";
import Achievement from "./pages/homepage/Achievement.js";
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
import PlanAdmissionDetail from "./pages/admissionCouncil/PlanAdmissionDetail.js";
import UnauthorizedPage from "./pages/login/UnauthorizedPage.js";
import MajorsListViewAC from "./pages/admissionCouncil/MajorsListViewAC.js";
import MajorsListViewAO from "./pages/admissionsOfficer/MajorsListViewAO.js";


function App() {
  const { userLoggedIn, currentUser } = useAuth();
  const { user: customLoginUser } = useAuthStore();

  const checkRole = (role) => {
    if (customLoginUser && !userLoggedIn) {
      return customLoginUser.role === role;
    }
    return currentUser && currentUser.role === role;
  };

  if (customLoginUser && checkRole("Admin")) {
    return <Routes>
      <Route element={<ManagerLayout role="Admin" />}>
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/danh-sach-nguoi-dung" element={<UserList />} />
        <Route path="/admin/danh-sach-nganh-hoc" element={<MajorsList />} />
        <Route path="/admin/chi-tiet-nganh-hoc/:majorID" element={<MajorDetail />} />
        <Route path="/admin/danh-sach-yeu-cau-phe-duyet-tai-khoan" element={<AccountList />} />
      </Route>
    </Routes>
  }

  if (customLoginUser && checkRole("SchoolService")) {
    return <Routes>
      <Route element={<ManagerLayout role="SchoolService" />}>
        <Route path="/school-service/dashboard" element={<Dashboard />} />
        <Route path="/school-service/danh-sach-nganh-hoc" element={<MajorsListView />} />
        <Route path="/school-service/chi-tiet-nganh-hoc/:majorID" element={<MajorDetail />} />
        <Route path="/school-service/danh-sach-tin-tuc" element={<NewsList />} />
        <Route path="/school-service/danh-sach-dang-ky-tuyen-sinh" element={<AdmissionRegistrationList />} />
        <Route path="/school-service/danh-sach-yeu-cau-chuyen-nganh" element={<RequestChangeMajorList />} />
        <Route path="/school-service/danh-sach-yeu-cau-rut-ho-so" element={<RequestsForWithdrawalList />} />
        <Route path="/school-service/danh-sach-thong-bao" element={<SendNotification />} />
      </Route>
    </Routes>
  }

  if (customLoginUser && checkRole("AdmissionOfficer")) {
    return <Routes>
      <Route element={<ManagerLayout role="AdmissionOfficer" />}>
        <Route path="/admissions-officer/dashboard" element={<Dashboard />} />
        <Route path="/admissions-officer/danh-sach-nganh-tuyen-sinh" element={<MajorsListViewAO />} />
        <Route path="/admissions-officer/danh-sach-dang-ky-tu-van-tuyen-sinh" element={<StudentConsultationList />} />
      </Route>
    </Routes>
  }
  if (customLoginUser && checkRole("AdmissionCouncil")) {
    return <Routes>
      <Route element={<ManagerLayout role="AdmissionCouncil" />}>
        <Route path="/admissions-council/dashboard" element={<Dashboard />} />
        <Route path="/admissions-council/danh-sach-nganh-tuyen-sinh" element={<MajorsListViewAC />} />
        <Route path="/admissions-council/ke-hoach-tuyen-sinh" element={<PlanAdmission />} />
        <Route path="/admissions-council/chi-tiet-ke-hoach-tuyen-sinh" element={<PlanAdmissionDetail />} />
      </Route>
    </Routes>
  }

  return (
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
        <Route path="/tra-cuu-ho-so" element={<ApplicationSearch />} />
        <Route path="/cap-nhat-ho-so" element={<ApplicationUpdate />} />
      </Route>
      {userLoggedIn && (
        <Route element={<StudentLayout />}>
          <Route path="/yeu-cau-chuyen-nganh" element={<RequestForTransfer />} />
          <Route path="/yeu-cau-rut-ho-so" element={<RequestForWithdraw />} />
          <Route path="/thong-tin-ca-nhan" element={<StudentProfile />} />
        </Route>
      )}

      {/* Redirect nếu không có quyền */}
      {/* <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="*" element={<Navigate to="/unauthorized" />} /> */}
    </Routes>
  );
}

export default App;