import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home"
import Error from "../pages/Error"
import CodeVerification from "../pages/CodeVerification"
import FindTalent from "../pages/FindTalent"
import Jobs from "../pages/Jobs"
import Login from "../features/auth/Login"
import Register from "../features/auth/Register"
import ForgotPassword from "../features/auth/ForgetPassword"
import ResetPassword from "../features/auth/ResetPassword"
import CompanyCreate from "../features/companies/CompanyCreate"
import CompanyDetail from "../features/companies/CompanyDetail"
import AddCompanyDetails from "../features/companies/AddCompanyDetails"
import JobDetails from "../features/jobs/JobDetails"
import Recommendation from "../features/jobs/Recommendation"
import PostJobForm from "../features/jobs/PostJobForm"
import ChangePassword from "../features/users/ChangePassword"
import JobHistory from "../features/users/JobHistory"
import UserProfile from "../features/users/ViewProfile"
import ProtectedRoute from "./ProtectedRoute";
import Profile from "../features/users/Profile";
import RoleProtectedRoute from "./RoleBasedRoute"
import Company from "../pages/Company";
import UploadResume from "../pages/UploadResume";
import PublicProfile from "../features/users/PublicProfile";
import ApplicationManagement from "../features/applications/ApplicationManagement";
import ApplicationDetails from "../features/applications/ApplicationDetails";
import Recommendations from "../pages/Recommendations";


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
      { path: "profile/:userId", element: <PublicProfile /> },

      //  Authenticated user route (any role)
      {
        element: <ProtectedRoute />, 
        children: [
          { path: "user/change-password", element: <ChangePassword /> },
          { path: "user/view-profile", element: <UserProfile /> },
          { path: "user/profile", element: <Profile /> },
        ],
      },

      //  Recruiter-only routes
      {
        element: <RoleProtectedRoute allowedRoles={["recruiter"]} />,
        children: [
          { path: "find-talent", element: <FindTalent /> },
          { path: "post-job", element: <PostJobForm /> },
          { path: "applications", element: <ApplicationManagement /> },
          { path: "applications/:applicationId", element: <ApplicationDetails /> },
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
          { path: "user/upload-resume", element: <UploadResume /> },
          { path: "recommendations", element: <Recommendations /> },
          { path: "job/:id", element: <JobDetails /> },
        ],
      },

      { path: "*", element: <Error /> },
    ],
  },
]);

export default router;
