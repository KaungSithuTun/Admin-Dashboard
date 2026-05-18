import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import StudentList from './pages/students/StudentList';
import StudentDetail from './pages/students/StudentDetail';
import TeacherList from './pages/teachers/TeacherList';
import TeacherDetail from './pages/teachers/TeacherDetail';
import Analytics from './pages/analytics/Analytics';
import Categories from './pages/categories/Categories';
import CommissionPricing from './pages/commission/CommissionPricing';
import ChatMonitoring from './pages/chat/ChatMonitoring';
import BookingManagement from './pages/bookings/BookingManagement';
import ComplaintsDisputes from './pages/complaints/ComplaintsDisputes';
import SuspensionBanning from './pages/suspension/SuspensionBanning';
import Notifications from './pages/notifications/Notifications';
import SystemControls from './pages/settings/SystemControls';
import Overview from './pages/overview/Overview';
import VerificationBadges from './pages/verification/VerificationBadges';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Overview />} />
          <Route path="students" element={<StudentList />} />
          <Route path="students/:id" element={<StudentDetail />} />
          <Route path="teachers" element={<TeacherList />} />
          <Route path="teachers/:id" element={<TeacherDetail />} />
          <Route path="verification" element={<VerificationBadges />} />
          <Route path="categories" element={<Categories />} />
          <Route path="commission" element={<CommissionPricing />} />
          <Route path="chat" element={<ChatMonitoring />} />
          <Route path="bookings" element={<BookingManagement />} />
          <Route path="complaints" element={<ComplaintsDisputes />} />
          <Route path="suspension" element={<SuspensionBanning />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="settings" element={<SystemControls />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
