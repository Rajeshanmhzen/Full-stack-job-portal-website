import { IoSettingsSharp } from "react-icons/io5";
import { Popover } from "@mantine/core";
import { FaArrowRight, FaBell } from "react-icons/fa";
import { Avatar,Indicator } from '@mantine/core';
import { Link, NavLink } from "react-router-dom";
import { Group, Button } from '@mantine/core';

const Header = () => {
  const user = true
  return (
    <>
      <div className="flex items-center justify-between  px-6 w-full h-20 text-white">
        <div className="font-semibold text-2xl">
          Job<span className=" text-[#6A38C2]">Hunt</span>
        </div>
        <div className="flex gap-3">
          <NavLink to={"/"} className={({ isActive }) =>
          isActive
            ? "text-purple-heart-700 font-bold"
            : "text-gray-700 hover:bg-gray-200 px-3 py-1 rounded"}>Home</NavLink>
            <NavLink to={"/"} className={({ isActive }) =>
          isActive
            ? "text-purple-heart-700 font-bold"
            : "text-gray-700 hover:bg-gray-200 px-3 py-1 rounded"}>Find Talent</NavLink>
            <NavLink to={"/"} className={({ isActive }) =>
          isActive
            ? "text-purple-heart-700 font-bold"
            : "text-gray-700 hover:bg-gray-200 px-3 py-1 rounded"}>upload jobs</NavLink>
            <NavLink to={"/"} className={({ isActive }) =>
          isActive
            ? "text-purple-heart-700 font-bold"
            : "text-gray-700 hover:bg-gray-200 px-3 py-1 rounded"}>About us</NavLink>
          
        </div>
        {
          !user ? 
          (
            <>
              <div >
                <Group justify="center">
                  <Link  to={"/login"}>
                  <Button  variant="default">
        Login
      </Button></Link>
                  <Link  to={"/register"}>
                  <Button rightSection={<FaArrowRight size={14} />}>Register for free</Button>
                  </Link>
      

      

    </Group>
              </div>
            </>
          )
          :
          (
        <>
        <div className="flex items-center gap-5 ">
          <div>
            <Popover
              width={300}
              trapFocus
              position="bottom"
              withArrow
              shadow="md"
            >
              <Popover.Target>
                <div className="flex gap-2 items-center cursor-pointer ">
                    <Avatar variant="filled" 
                    src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-9.png"
                     width={100} 
                     height={100} className="w-10 h-10 rounded-full" />
                    Rajeshan
                </div>
              </Popover.Target>
              <Popover.Dropdown>
                Something come over here
              </Popover.Dropdown>
            </Popover>
          </div>
          <div className="p-1.5 rounded-full bg-gray-800 cursor-pointer">
            <IoSettingsSharp stroke={1.5} />
          </div >
          <div className="p-1.5 rounded-full bg-gray-800 cursor-pointer">
             <Indicator color="atlantis.5" size={8} position="top-end" offset={2} processing>
                 <Popover
              width={300}
              trapFocus
              position="bottom"
              withArrow
              shadow="md"
            >
              <Popover.Target>
                <FaBell stroke={1.5}/>
              </Popover.Target>
              <Popover.Dropdown>
                Something come over here
              </Popover.Dropdown>
            </Popover>
             </Indicator>
          </div>
        </div>
        </>
          )
        }
        
      </div>
    </>
  );
};
export default Header;
