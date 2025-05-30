import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import { login } from "./features/authslice";
import { store } from "./store/store.js";
import { DSettings, HomePage, AboutPage, ContactPage } from "./pages/index.js";
import { RegisterPage, DUsers, DTemplates } from "./pages/index.js";
import AssessmentDataGrid from "./pages/AssessmentDataGrid.jsx";
import NewTemplateEditPage from "./pages/NewTemplateEditPage.jsx";
import TestLandingPage from "./pages/TestLandingPage.jsx";
import TestWindowWrapper from "./components/TestWindowWrapper.jsx";
import AuthWatcher from "./components/AuthWatcher.jsx";
import TestSummaryPage from "./pages/TestSummaryPage.jsx";
import PasswordRestLandingPage from "./pages/PasswordRestLandingPage.jsx";

// import AssessmentPage from "./pages/AssessmentPage.jsx";
import {
  LoginPage,
  DHelp,
  ProfilePage,
  TemplateDetail,
  TestPage,
  TemplateEditPage,
  InvitedUserPage,
  PricePage,
  DPayments,
  AssessmentDetailPage,
} from "./pages/index.js";
import ConfirmEmail from "./components/ConfirmEmail.jsx";

function App() {
  // Check localStorage for persisted auth state
  const access_token = localStorage.getItem("access_token");
  const refresh_token = localStorage.getItem("refresh_token");
  const user_name = localStorage.getItem("user_name");
  const email = localStorage.getItem("email");
  const company = localStorage.getItem("company");
  const role = localStorage.getItem("role");

  // If tokens are available, update the Redux store
  if (access_token && refresh_token) {
    store.dispatch(
      login({
        access_token,
        refresh_token,
        user_name,
        email,
        company,
        role,
      })
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} /> {/*  */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/price" element={<PricePage />} />
        <Route path="/users/invited/:token" element={<InvitedUserPage />} />
        <Route
          path="/user/reset_password/:token"
          element={<PasswordRestLandingPage />}
        />
        <Route
          path="/tempate/edit-template/:id"
          element={<TemplateEditPage />}
        />
        <Route
          path="/tests/landing/:test_instance_id"
          element={<TestLandingPage />}
        />
        <Route
          path="/tests/take_test/:test_instance_id"
          element={
            <TestWindowWrapper>
              <TestPage />
            </TestWindowWrapper>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/users/confirm-email/:token" element={<ConfirmEmail />} />
        <Route
          path="/dashboard"
          element={
            <AuthWatcher>
              <DashboardLayout />
            </AuthWatcher>
          }
        >
          <Route path="assesments" element={<AssessmentDataGrid />} /> {/*  */}
          <Route path="summary" element={<TestSummaryPage />} />
          <Route path="templates" element={<DTemplates />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="template/:id" element={<TemplateDetail />} />
          <Route path="price" element={<DPayments />} />
          <Route
            path="assesments/detail/:id"
            element={<AssessmentDetailPage />}
          />
          <Route path="users" element={<DUsers />} />
          <Route path="settings" element={<DSettings />} />
          <Route path="help" element={<DHelp />} />
        </Route>
        <Route
          path="/*"
          element={
            <h1 className="m-5 text-center text-5xl">Page Not Found 404</h1>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
