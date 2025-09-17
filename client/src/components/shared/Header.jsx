import { IoSettingsSharp } from "react-icons/io5";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { Accordion, Popover, Switch } from "@mantine/core";
import {
  FaArrowRight,
  FaBell,
  FaCheckCircle,
  FaBriefcase,
  FaHeart,
  FaUser,
  FaFileAlt,
  FaSignOutAlt,
  FaSun,
} from "react-icons/fa";
import { BsFillMoonStarsFill } from "react-icons/bs";
import { Avatar, Indicator } from "@mantine/core";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Group, Button } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "../../utils/constant";
import { setUser } from "../../store/userSlice";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { ClearRecommendations, clearResume } from "../../store/resumeSlice";
import { markAllRead, clearNotifications } from "../../store/notificationSlice";
import { NOTIFICATION_API_END_POINT } from "../../utils/constant";
import { useTheme } from "../../contexts/ThemeContext";
import GlobalSearch from "./GlobalSearch";
const Header = () => {
  const { isDark, toggleTheme } = useTheme();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { unreadCount, items } = useSelector((state) => state.notification);

  const handleMarkAllRead = async () => {
    try {
      await axios.patch(`${NOTIFICATION_API_END_POINT}/mark-read`, {}, { withCredentials: true });
      dispatch(markAllRead());
    } catch (err) {
      console.error('Failed to mark notifications as read', err);
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      try {
        await axios.patch(`${NOTIFICATION_API_END_POINT}/mark-single-read/${notification._id}`, {}, { withCredentials: true });
      } catch (err) {
        console.error('Failed to mark notification as read', err);
      }
    }
    if (notification.message.includes('job') || notification.message.includes('recommendation')) {
      navigate('/jobs');
    } else if (notification.message.includes('password')) {
    } else if (notification.message.includes('profile')) {
      navigate('/user/view-profile');
    }
  };
  const handleLogout = async () => {
    const res = await axios.get(`${USER_API_END_POINT}/user/logout`);
    if (res.data.success) {
      dispatch(clearResume());
      dispatch(ClearRecommendations())
      dispatch(clearNotifications());
      dispatch(setUser(null));
      notifications.show({
        title: "Logout Successfully",
        message: "Redirecting to the Home page...",
        icon: <FaCheckCircle />,
        color: "teal",
        withBorder: true,
        className: "!border-green-500",
      });
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } else {
      notifications.show({
        title: "Login Failed",
        message:
          res.data.message || "Invalid credentials or something went wrong.",
        color: "red",
        withBorder: true,
        className: "!border-red-500",
      });
    }
  };
  const publicTabs = [
    { name: "Home", key: "/", path: "/" },
    { name: "Jobs", key: "jobs", path: "/jobs" },
    { name: "Find People", key: "search-users", path: "/search-users" },
  ];
  const workerTabs = [
    ...publicTabs,
    { name: "Recommendations", key: "recommendations", path: "/recommendations" },
  ];
  const recruiterTabs = [
    ...publicTabs,
    { name: "Find Talent", key: "find-talent", path: "/find-talent" },
    { name: "Upload Jobs", key: "upload-jobs", path: "/post-job" },
    { name: "Applications", key: "applications", path: "/applications" },
    { name: "Company", key: "company", path: "/company" },
  ];
  const getTabsForRole = () => {
    if (!user) return publicTabs;
    if (user.role === "worker") return workerTabs;
    if (user.role === "recruiter") return recruiterTabs;
    return publicTabs;
  };
  const tabs = getTabsForRole();
  return (
    <>
      <div className="flex items-center justify-between px-6 w-full h-20 theme-header">
        <div className="font-semibold text-2xl">
          Job<span className=" text-[#6A38C2]">Hunt</span>
        </div>
        
        {user && <GlobalSearch />}
        
        <div className="flex gap-3">
          {tabs.map((tab) => (
            <NavLink
              key={tab.key}
              to={tab.path}
              className={({ isActive }) =>
                isActive
                  ? "text-purple-heart-600 font-bold underline underline-offset-4"
                  : "text-mine-shaft-300 dark:text-mine-shaft-700 hover:text-purple-heart-500 px-3 py-1 rounded transition-colors"
              }
            >
              {tab.name}
            </NavLink>
          ))}
        </div>
        {!user ? (
          <>
            <div>
              <Group justify="center">
                <Link to={"/login"}>
                  <Button variant="default">Login</Button>
                </Link>
                <Link to={"/register"} >
                  <Button variant="filled" rightSection={<FaArrowRight size={14} />} color="purple-heart.7">
                    Register for free
                  </Button>
                </Link>
              </Group>
            </div>
          </>
        ) : (
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
                      <Avatar
                        variant="filled"
                        src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-9.png"
                        width={100}
                        height={100}
                        className="w-10 h-10 rounded-full"
                      />
                      <p className="capitalize">{user.fullname}</p>
                    </div>
                  </Popover.Target>
                  <Popover.Dropdown className="text-center theme-card">
                    <div>
                      <div className="flex gap-2 items-center cursor-pointer border-b pb-2 ">
                        <Avatar
                          variant="filled"
                          src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-9.png"
                          width={100}
                          height={100}
                          className="w-10 h-10 rounded-full"
                        />
                        <p className="capitalize">{user.fullname}</p>
                      </div>
                      <div>
                        <Accordion
                          transitionDuration={500}
                          mt={"md"}
                          chevron={false}
                          chevronPosition="left"
                          styles={{
                            control: {
                              backgroundColor: 'var(--mantine-color-mine-shaft-6)',
                              color: 'white',
                              borderRadius: 'var(--mantine-radius-default)',
                              '&:hover': {
                                backgroundColor: 'var(--mantine-color-mine-shaft-7)',
                              },
                              '&[dataActive]': {
                                backgroundColor: 'var(--mantine-color-mine-shaft-7)',
                              }
                            },
                            panel: {
                              padding: 0,
                              backgroundColor: 'transparent',
                            },
                            content: {
                              padding: 0,
                            }
                          }}
                        >
                          <Accordion.Item value="profile">
                            <Accordion.Control icon={<FaUser size={21} />}>
                              Profile Settings
                            </Accordion.Control>
                            <Accordion.Panel>
                              <Button
                                color="mine-shaft.6"
                                justify="space-between"
                                mt="xs"
                                fullWidth
                                rightSection={<FaFileAlt size={21} />}
                                onClick={() => navigate("/user/view-profile")}
                              >
                                View Profile
                              </Button>
                              <Button
                                color="mine-shaft.6"
                                justify="space-between"
                                mt="xs"
                                fullWidth
                                rightSection={<FaFileAlt size={21} />}
                                onClick={() => navigate("/user/edit-profile")}
                              >
                                Edit Profile
                              </Button>
                              <Button
                                color="mine-shaft.6"
                                justify="space-between"
                                mt="xs"
                                fullWidth
                                rightSection={<FaFileAlt size={21} />}
                                onClick={() => navigate("/user/change-password")}
                              >
                                Change Password
                              </Button>
                            </Accordion.Panel>
                          </Accordion.Item>
                        </Accordion>

                        <div>
                          {
                            user.role === 'worker' ? (
                              <>
                                <Button
                                  color="mine-shaft.6"
                                  justify="space-between"
                                  mt={"md"}
                                  fullWidth
                                  onClick={() => navigate("user/upload-resume")}
                                  rightSection={<FaFileAlt size={21} />}
                                >
                                  My Resume
                                </Button>
                                <Button
                                  color="mine-shaft.6"
                                  justify="space-between"
                                  mt={"md"}
                                  fullWidth
                                  rightSection={<FaBriefcase size={21} />}
                                  onClick={() => navigate("user/job-history")}
                                >
                                  Job History
                                </Button>
                                <Button
                                  color="mine-shaft.6"
                                  justify="space-between"
                                  mt={"md"}
                                  fullWidth
                                  rightSection={<FaHeart size={21} />}
                                >
                                  Saved Jobs
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  color="mine-shaft.6"
                                  justify="space-between"
                                  mt={"md"}
                                  fullWidth
                                  rightSection={<FaHeart size={21} />}
                                >
                                  Posted jobs
                                </Button>
                              </>
                            )
                          }
                        </div>

                        <Button
                          color="mine-shaft.6"
                          justify="space-between"
                          mt={"md"}
                          fullWidth
                          rightSection={
                            <Switch
                              checked={isDark}
                              onChange={toggleTheme}
                              size="md"
                              color="dark.4"
                              onLabel={<FaSun size={16} stroke={2.5} color="var(--mantine-color-yellow-4)" />}
                              offLabel={<BsFillMoonStarsFill size={16} stroke={2.5} color="var(--mantine-color-blue-6)" />}
                            />
                          }
                        >
                          Dark Mode
                        </Button>
                        <hr className="mt-5" />
                        <Button
                          color="pomegranate.6"
                          justify="space-between"
                          fullWidth
                          rightSection={<FaSignOutAlt size={21} />}
                          mt="md"
                          onClick={handleLogout}
                        >
                          Logout
                        </Button>

                      </div>
                    </div>
                  </Popover.Dropdown>
                </Popover>
              </div>
              <div className="p-1.5 rounded-full cursor-pointer transition-colors" style={{'--hover-bg-light': 'var(--color-mine-shaft-200)', '--hover-bg-dark': 'var(--color-mine-shaft-700)'}} onMouseEnter={(e) => e.target.style.backgroundColor = isDark ? 'var(--color-mine-shaft-700)' : 'var(--color-mine-shaft-200)'} onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
                <IoSettingsSharp stroke={1.5} />
              </div>
              <div className="p-1.5 rounded-full cursor-pointer transition-colors" onMouseEnter={(e) => e.target.style.backgroundColor = isDark ? 'var(--color-mine-shaft-700)' : 'var(--color-mine-shaft-200)'} onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
                <Indicator
                  color="atlantis.5"
                  size={9}
                  position="top-end"
                  offset={0}
                  processing
                  disabled={unreadCount === 0}
                >
                  <Popover width={300} trapFocus position="bottom" withArrow shadow="md">
                    <Popover.Target>
                        <FaBell className="cursor-pointer" />
                    </Popover.Target>
                    <Popover.Dropdown className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg">
                      <div className="space-y-2 max-h-64 overflow-y-auto p-2">
                        <div className="flex justify-between items-center mb-2">
                          <p className="font-bold text-mine-shaft-100 dark:text-purple-heart-600 ">Notifications</p>
                          <button
                            onClick={handleMarkAllRead}
                            className="text-xs text-purple-heart-500 hover:text-purple-heart-600 cursor-pointer"
                          >
                            Mark all read
                          </button>
                        </div>
                        {items.length === 0 ? (
                          <p className="text-gray-500 text-sm">No notifications</p>
                        ) : (
                          items.map((n, i) => (
                            <div 
                              key={i} 
                              onClick={() => handleNotificationClick(n)}
                              className={`text-sm p-3 rounded-lg border transition-all cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                                n.isRead 
                                  ? 'bg-transparent border-gray-200 dark:border-gray-700 opacity-70' 
                                  : 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 shadow-sm'
                              }`}>
                              <div className="flex items-start gap-2">
                                {!n.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 flex-shrink-0"></div>}
                                <div className="flex-1">
                                  <p className={`${n.isRead ? 'text-mine-shaft-300 dark:text-mine-shaft-100' : 'text-gray-900 dark:text-gray-100 font-medium'}`}>
                                    {n.message}
                                  </p>
                                  <p className="text-xs text-mine-shaft-300 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </Popover.Dropdown>
                  </Popover>
                </Indicator>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Header;