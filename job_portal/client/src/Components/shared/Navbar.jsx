import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { IoMdArrowDropdown } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom"
// import Button from "./button"
import { LogOut, User2 } from "lucide-react";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { notifications } from "@mantine/notifications";
import { FaCheckCircle } from "react-icons/fa";
// import {  useSelector } from "react-redux";
// import { toast } from "react-toastify";
const Navbar = () => {
  const navigate = useNavigate();
  // const user = useSelector((state)=> state?.auth?.auth)
  // const dispatch = useDispatch()
  const user = true

  const handleLogout = async ()=> {
    try {
      const res = await axios.post(`${USER_API_END_POINT}/logout`, {}, {
        withCredentials: true, 
      });

      if (res.data.success) {
        notifications.show({
                  title:"Registered Successfully",
                  message:"Redirecting to the login page...",
                  icon:<FaCheckCircle style={{width:"90%", height:'90%'}} />,
                  color:"teal",
                  withBorder:true,
                  className:"!border-green-500"
                })
     
        localStorage.removeItem("authToken"); 
        navigate("/login"); 
      } else {
        // toast.error(res.data.message || "Logout failed");
      }
    } catch (error) {
      console.error("Logout Error:", error);
      // toast.error("Something went wrong. Please try again.");
    }
}
  return (
    <nav className="flex items-center justify-between w-full h-20 padd-40">
      <div className="logo">
        <Link  to="/"  className="text-3xl">Job<span className="text-[#ff4d05]">Portal</span></Link>
      </div>
      <div className=" navlinks flex gap-7 text-2xl">
        <a href=""><Link to="/">Home</Link></a>
        <a href=""><Link to="/jobs">Jobs</Link></a>
        <a href=""><Link to="/browse">Browse</Link></a>
      </div>

      {
        !user ?
        (
          <div className="flex gap-6 text-center justify-center">
        <Link className="text-2xl py-2" to="login">Sign in</Link>
        <Link className="btn" to={"register"}> <span className="hover:text-red-50">Register for free</span> </Link>
      </div>
        )
        :
        (
          <div className="me-9">
          <Popover>
            <PopoverTrigger asChild>
              <div className="relative cursor-pointer ">
              <Avatar className="cursor-pointer">
                  <AvatarImage src="https://github.com/shadcn.png" />
                </Avatar>
                <div className=" down-arrow absolute bg-slate-300 z-10 rounded-full">  
                <IoMdArrowDropdown />
                </div>
              </div> 
            </PopoverTrigger>
            <PopoverContent className="w-80 h-52 px-3 my-2 me-5 rounded-sm  shadow-2xl outline-none">
            <div className="flex gap-4 py-5 align-center justify-center cursor-pointer w-full h-[90px] border-b-2 border-slate-200 my-2  ">
              <Avatar className="cursor-pointer my-2">
                  <AvatarImage src="https://github.com/shadcn.png" />
                </Avatar>
                <div>
                <h4 className="">Rajeshan maharjan</h4>
                <p className="text-slate-400">Lorem ipsum dolor sit amet.</p>
                </div>
              </div> 
              <div className="flex flex-col gap-3">
                <div className="flex w-full rounded items-center gap-2 cursor-pointer view_profile py-2 px-3 ">
                <User2/>
                <button  className=" text-start w-full ps-4 ">View Profile</button>
                </div>
                <Link className="logout_profile rounded flex w-full items-center gap-2 cursor-pointer py-2 px-3 " 
                onClick={handleLogout}>
                <LogOut className= "logout_icon text-red-700"/>
                <button  className="text-start w-full ps-4  text-red-700">Logout</button>
                </Link>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        )
      }
    </nav>
  )
}

export default Navbar