import { createBrowserRouter } from "react-router-dom";
import App from "../App";

import Error from "../pages/Error";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Jobs from "../pages/jobs";
import Browse from "../pages/Browse";
import Forget_password from "@/pages/Forget_password";
import ResetPassword from "@/pages/ResetPassword";




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
                path:"jobs",
                element: <Jobs />
            },
            {
                path:"browse",
                element: <Browse />
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
                element: <Forget_password />,
              },
              
              {
                path: "verify-reset-password",
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