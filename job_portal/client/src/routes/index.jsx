import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home"
import Register from "../pages/Register";
import Login from "../pages/Login";
import ForgotPassword from "../pages/Forgetpassword";
import CodeVerification from "../pages/CodeVerification";
import ResetPassword from "../pages/Resetpassword";
import Error from "../pages/Error";

const router = createBrowserRouter ([
    {
        path:"/",
        element:<App />,
        children:[
            {
                path:"",
                element: <Home />
            },
           
            {
                path:"login",
                element:<Login />
            }, 
            {
                path:"register",
                element:<Register />
            },
            {
                path: "forgot-password",
                element: <ForgotPassword />,
              },
              {
                path: "verify-reset/:token",
                element: <CodeVerification />,
              },
              
              {
                path: "reset-password/:token",
                element: <ResetPassword />,
              },
            {
                path: "*",
                element: <Error/>
            },
        ]
    }
])
export default router