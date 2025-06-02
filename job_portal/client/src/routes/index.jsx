// src/routes/index.jsx

import { createBrowserRouter } from "react-router-dom";
import App from "../App";

// Public Pages
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/Forgetpassword";
import CodeVerification from "../pages/CodeVerification";
import ResetPassword from "../pages/Resetpassword";

// Protected Pages (Role & Auth)
import ChangePassword from "../pages/profile/ChangePassword";
import JobHistory from "../pages/profile/JobHistory";
import FindTalent from "../pages/FindTalent";

// Route Guards
import ProtectedRoute from "../Components/ProtectedRoute";
import RoleProtectedRoute from "../Components/RoleProtectedRoute";
import PostJobForm from "../Components/ui/PostJobForm";
import Company from "../pages/Company";
import CompanyDetail from "../Components/ui/CompanyDetail";
import CompanyCreate from "../Components/ui/CompanyCreate";
import AddCompanyDetails from "../Components/ui/AddCompanyDetails";
import Jobs from "../pages/Jobs";
import ResumeUpload from "../Components/ui/ResumeUpload";
import Recommendation from "../Components/ui/Recommendation";
import Error from "../pages/Error";

// Fallback for route errors
// const RouteError = () => (
//   <div className="text-center mt-10 text-red-600 text-lg font-semibold">
//     ⚠️ Something went wrong while loading this page.
//   </div>
// );

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Home/>,
    children: [
      //  Public routes
      { index: true, element: <Home /> },
      { path: "jobs", element: <Jobs /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "verify-reset/:token", element: <CodeVerification /> },
      { path: "reset-password/:token", element: <ResetPassword /> },

      //  Authenticated user route (any role)
      {
        element: <ProtectedRoute />, 
        children: [
          { path: "user/change-password", element: <ChangePassword /> },
        ],
      },

      //  Recruiter-only routes
      {
        element: <RoleProtectedRoute allowedRoles={["recruiter"]} />,
        children: [
          { path: "find-talent", element: <FindTalent /> },
          { path: "post-job", element: <PostJobForm /> },
         {
  path: "company",
  children: [
    { index: true, element: <Company /> }, 
    { path: "create/:id", element: <AddCompanyDetails /> },
    { path: "create", element: <CompanyCreate /> },
    { path: ":id", element: <CompanyDetail /> },
  ]
}
        ],
      },

      //  Worker-only routes
      {
        element: <RoleProtectedRoute allowedRoles={["worker"]} />,
        children: [
          { path: "user/job-history", element: <JobHistory /> },
          { path: "user/upload-resume", element: <ResumeUpload /> },
          { path: "user/recommendation", element: <Recommendation /> },
        ],
      },

      { path: "*", element: <Error /> },
    ],
  },
]);

export default router;
