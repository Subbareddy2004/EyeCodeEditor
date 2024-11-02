import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import StudentHeader from "./pages/student/Header";
import FacultyHeader from "./pages/faculty/Header";
import Header from './components/Header'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import StudentDashboard from './pages/student/Dashboard'
import StudentProblemSolving from './pages/student/ProblemSolving'
import StudentProfile from './pages/student/Profile'
import FacultyDashboard from './pages/faculty/Dashboard'
import FacultyProblemCreation from './pages/faculty/ProblemCreation'
import FacultyContestManagement from './pages/faculty/ContestManagement'
import FacultyProfile from './pages/faculty/Profile'
import { getUserProfile } from './services/auth'
import './App.css'
import StudentProblems from './pages/student/Problems'
import StudentContests from './pages/student/Contests'
import StudentLeaderboard from './pages/student/Leaderboard'
import StudentSettings from './pages/student/Settings'
import StudentSkillTests from './pages/student/SkillTests'
import StudentAssignments from './pages/student/Assignments'
import ContestDetails from './pages/student/ContestDetails';
import ProblemSolving from './pages/student/ProblemSolving'
import ProblemList from './pages/faculty/ProblemList'
import ProblemEdit from './pages/faculty/ProblemEdit'
import StudentManagement from './pages/faculty/StudentManagement'
import Leaderboard from './pages/faculty/Leaderboard'
import AssignmentManagement from './pages/faculty/AssignmentManagement'
import AssignmentSubmissions from './pages/faculty/AssignmentSubmissions'
import ContestLeaderboard from './pages/faculty/ContestLeaderboard'
import ContestSubmissions from './pages/faculty/ContestSubmissions'
import Profile from './pages/faculty/Profile'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Toaster } from 'react-hot-toast';
import CreateContest from './pages/faculty/CreateContest';
import EditContest from './pages/faculty/EditContest';
import { useAuth } from './contexts/AuthContext';
import AdminHeader from "./pages/admin/Header";
import AdminDashboard from './pages/admin/Dashboard';
import FacultyManagement from './pages/admin/FacultyManagement';
import AssignmentForm from './pages/faculty/AssignmentForm';
import Students from './pages/admin/Students';
import { useTheme } from './contexts/ThemeContext';

function App() {
  const { user, login, logout } = useAuth();
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen ${
      darkMode 
        ? 'bg-[#1a1f2c] text-white border-[#2d3548]' 
        : 'bg-gradient-to-br from-indigo-100 via-blue-100 to-purple-100 text-gray-800'
    }`}>
      {user ? (
        user.role === 'admin' ? (
          <div className={`${darkMode ? 'border-[#2d3548]' : 'border-gray-200'}`}>
            <AdminHeader user={user} onLogout={logout} />
          </div>
        ) : user.role === 'student' ? (
          <div className={`${darkMode ? 'border-[#2d3548]' : 'border-gray-200'}`}>
            <StudentHeader user={user} onLogout={logout} />
          </div>
        ) : (
          <div className={`${darkMode ? 'border-[#2d3548]' : 'border-gray-200'}`}>
            <FacultyHeader user={user} onLogout={logout} />
          </div>
        )
      ) : (
        <div className={`${darkMode ? 'border-[#2d3548]' : 'border-gray-200'}`}>
          <Header />
        </div>
      )}
      
      <ToastContainer />
      <Toaster position="top-right" />
      <main className={`container mx-auto p-6 ${
        darkMode 
          ? 'bg-[#1a1f2c] border-[#2d3548]' 
          : 'bg-white border-gray-200'
      }`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login onLogin={login} />} />
          <Route path="/register" element={<Register />} />
          
          {/* Admin Routes */}
          <Route 
            path="/admin/*" 
            element={user && user.role === 'admin' ? <AdminRoutes user={user} /> : <Navigate to="/login" />} 
          />
          
          {/* Existing Routes */}
          <Route 
            path="/student/*" 
            element={user && user.role === 'student' ? <StudentRoutes user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/faculty/*" 
            element={user && user.role === 'faculty' ? <FacultyRoutes user={user} /> : <Navigate to="/login" />} 
          />
          <Route path="/problems/:id" element={<ProblemSolving user={user} />} />
          <Route path="/faculty/problems" element={<ProblemList user={user} onLogout={logout} />} />
          <Route path="/faculty/contests/create" element={<CreateContest />} />
          <Route path="/faculty/contests/:id/edit" element={<EditContest />} />
        </Routes>
      </main>
    </div>
  )
}

const AdminRoutes = ({ user }) => (
  <Routes>
    <Route path="dashboard" element={<AdminDashboard user={user} />} />
    <Route path="faculty" element={<FacultyManagement user={user} />} />
    <Route path="students" element={<Students user={user} />} />
  </Routes>
);

const StudentRoutes = ({ user }) => (
  <Routes>
    <Route path="dashboard" element={<StudentDashboard user={user} />} />
    <Route path="problems" element={<StudentProblems user={user} />} />
    <Route path="problems/:id" element={<ProblemSolving user={user} />} />
    <Route path="assignments" element={<StudentAssignments user={user} />} />
    <Route path="contests" element={<StudentContests user={user} />} />
    <Route path="contests/:id" element={<ContestDetails />} />
    <Route path="leaderboard" element={<StudentLeaderboard user={user} />} />
    <Route path="profile" element={<StudentProfile user={user} />} />
    <Route path="settings" element={<StudentSettings user={user} />} />
    <Route path="skill-tests" element={<StudentSkillTests user={user} />} />
  </Routes>
)

const FacultyRoutes = ({ user }) => (
  <Routes>
    <Route path="dashboard" element={<FacultyDashboard user={user} />} />
    <Route path="profile" element={<FacultyProfile user={user} />} />
    <Route path="problems/create" element={<FacultyProblemCreation user={user} />} />
    <Route path="problems/edit/:id" element={<ProblemEdit user={user} />} />
    <Route path="problems" element={<ProblemList user={user} />} />
    <Route path="contests" element={<FacultyContestManagement user={user} />} />
    <Route path="students" element={<StudentManagement />} />
    <Route path="leaderboard" element={<Leaderboard />} />
    <Route path="assignments" element={<AssignmentManagement user={user} />} />
    <Route path="assignments/:id/submissions" element={<AssignmentSubmissions user={user} />} />
    <Route path="contests/:id/details" element={<ContestDetails />} />
    <Route path="contests/:id/leaderboard" element={<ContestLeaderboard />} />
    <Route path="contests/:id/submissions/:studentId" element={<ContestSubmissions />} />
    <Route path="assignments/create" element={<AssignmentForm user={user} />} />
    <Route path="assignments/:id/edit" element={<AssignmentForm user={user} />} />
  </Routes>
);

export default App
