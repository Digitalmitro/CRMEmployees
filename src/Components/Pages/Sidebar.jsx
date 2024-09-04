// Sidebar.jsx
import React, { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { CiHome } from "react-icons/ci";
import { GoInbox } from "react-icons/go";
import { IoDocumentTextOutline } from "react-icons/io5";
import { MdOutlineDashboard } from "react-icons/md";
import { MyContext } from "../../App";
import { NavLink, useNavigate } from "react-router-dom";
import homeicon from "../../assets/home-icon.png";
import { Badge, Modal } from "antd";
import Tooltip from "@mui/material/Tooltip";
// -------------
import {
  Form,
  Input,
  Row,
  Col,
  Select,
  DatePicker,
  Space,
  Checkbox,
} from "antd";
import axios from "axios";
// ----------

const Sidebar = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [isSidebarModalOpen, setIsSidebarModalOpen] = useState(false);
  const [projectsName, setProjectsName] = useState("");
  const [projects, setProjects] = useState([]);

  const [activeProject, setActiveProject] = useState(null);
  const [projectsData, setProjectsData] = useState([]);

  const [isProjectsMenuOpen, setIsProjectsMenuOpen] = useState(true);
  const [chatSeen, setChatSeen] = useState(0);
  const [length, setLength] = useState(0);


  const showSidebarModal = () => {
    setIsSidebarModalOpen(true);
  };

  const handleSidebarOk = async () => {
    let payload = {
      projectName: projectsName,
    };
    try {
      // Post the project name to the backend API
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/projects`,
        payload
      );
      // Update the local state with the new project data from the backend
      message.success("Project created");
    } catch (error) {
      console.error("Error adding project:", error);
    }

    setProjects([...projects, projectsName]);

    // Close the modal and reset the project name input
    setIsSidebarModalOpen(false);
    setProjectsName("");
  };

  const handleSidebarCancel = () => {
    setIsSidebarModalOpen(false);
  };

  const getProjectsData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_API}/projects`
      );
      setProjectsData(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleProjectClick = (projectid, name) => {
    setActiveProject(projectid);
    context.setBreadcrumbs([
      { label: "Projects", path: "/" },
      { label: name, path: `/projects/${projectid}` },
    ]);
    navigate(`/projects/${projectid}`);
  };

  const handleProjectsToggle = () => {
    setIsProjectsMenuOpen(!isProjectsMenuOpen);
  };

  const handleClick = (index, path, label) => {
    context.setActiveButton(index);
    context.setBreadcrumbs([
      { label: index === 0 ? "" : "Dashboard", path: "/" },
      { label, path },
    ]);
    navigate(path);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        context.setToggleSidebar(true);
      }
    };

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const getChatNotification = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_API}/notifymessage`
        );
        const hasReceivedMsg = res.data.data.filter(
          (rec) => rec.receiverId === user._id
        );
           
        setChatSeen(hasReceivedMsg[0]);
        setLength(hasReceivedMsg[0]?.message?.length)
       
      } catch (err) {
        console.log(err);
      }
    };
    getChatNotification();
  }, []);

  const handleMsgSeen = async() =>{
    console.log("chatcSen",chatSeen.receiverId)

    try{
     const res = await axios.delete(`${import.meta.env.VITE_BACKEND_API}/notifymessage`,{
      params:{
        id:chatSeen.receiverId,
        type:"receiver"
      }
     })
setLength(0)
    }catch(err){
      console.log(err)
    }
  }

  useEffect(() => {
    getProjectsData();
  }, []);

  return (
    <div className="sidebar ">
      <div
        className="hide-ham"
        style={{ height: "30px", display: "flex", justifyContent: "right" }}
      >
        <Button
          className="rounded-circle1"
          onClick={() => {
            context.setToggleSidebar(!context.toggleSidebar);
          }}
        >
          {/* */}
          <div
            style={{
              fontSize: "45px",
              paddingLeft: "25px",
              marginBottom: "10px",
            }}
          >
            {" "}
            <svg
              viewBox="0 0 24 24"
              width="25px"
              height="30px"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                  d="M11 5V19M6 8H8M6 11H8M6 14H8M6.2 19H17.8C18.9201 19 19.4802 19 19.908 18.782C20.2843 18.5903 20.5903 18.2843 20.782 17.908C21 17.4802 21 16.9201 21 15.8V8.2C21 7.0799 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V15.8C3 16.9201 3 17.4802 3.21799 17.908C3.40973 18.2843 3.71569 18.5903 4.09202 18.782C4.51984 19 5.07989 19 6.2 19Z"
                  stroke="#000000"
                  stroke-width="1.08"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  color="#4e4c4c"
                ></path>{" "}
              </g>
            </svg>
          </div>
        </Button>
      </div>
      <ul>
        {context.toggleSidebar ? (
          <Tooltip title="Home">
            <li>
              <Button
                style={{ color: "#555151" }}
                className={`custom-button  ${
                  context.activeButton === 0 ? "active" : ""
                }`}
                onClick={() => handleClick(0, "/", "Dashboard")}
              >
                <span className="icon ">
                  <svg
                    viewBox="0 0 32 32"
                    height="15px"
                    width="15"
                    enable-background="new 0 0 32 32"
                    id="Stock_cut"
                    version="1.1"
                    xml:space="preserve"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    fill="#000000"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <desc></desc>{" "}
                      <g>
                        {" "}
                        <polygon
                          fill="none"
                          points="27,12 16,1 5,12 5,31 27,31 "
                          stroke="#000000"
                          stroke-linejoin="round"
                          stroke-miterlimit="10"
                          stroke-width="2"
                        ></polygon>{" "}
                        <rect
                          fill="none"
                          height="12"
                          stroke="#000000"
                          stroke-linejoin="round"
                          stroke-miterlimit="10"
                          stroke-width="2"
                          width="10"
                          x="11"
                          y="19"
                        ></rect>{" "}
                        <polyline
                          fill="none"
                          points="1,16 16,1 31,16 "
                          stroke="#000000"
                          stroke-linejoin="round"
                          stroke-miterlimit="10"
                          stroke-width="2"
                        ></polyline>{" "}
                      </g>{" "}
                    </g>
                  </svg>
                </span>
                Home
              </Button>
            </li>
          </Tooltip>
        ) : (
          <li>
            <Button
              style={{ color: "#555151" }}
              className={`custom-button  ${
                context.activeButton === 0 ? "active" : ""
              }`}
              onClick={() => handleClick(0, "/", "Dashboard")}
            >
              <span className="icon ">
                <svg
                  viewBox="0 0 32 32"
                  height="15px"
                  width="15"
                  enable-background="new 0 0 32 32"
                  id="Stock_cut"
                  version="1.1"
                  xml:space="preserve"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  fill="#000000"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <desc></desc>{" "}
                    <g>
                      {" "}
                      <polygon
                        fill="none"
                        points="27,12 16,1 5,12 5,31 27,31 "
                        stroke="#000000"
                        stroke-linejoin="round"
                        stroke-miterlimit="10"
                        stroke-width="2"
                      ></polygon>{" "}
                      <rect
                        fill="none"
                        height="12"
                        stroke="#000000"
                        stroke-linejoin="round"
                        stroke-miterlimit="10"
                        stroke-width="2"
                        width="10"
                        x="11"
                        y="19"
                      ></rect>{" "}
                      <polyline
                        fill="none"
                        points="1,16 16,1 31,16 "
                        stroke="#000000"
                        stroke-linejoin="round"
                        stroke-miterlimit="10"
                        stroke-width="2"
                      ></polyline>{" "}
                    </g>{" "}
                  </g>
                </svg>
              </span>
              Home
            </Button>
          </li>
        )}

        {context.toggleSidebar ? (
          <Tooltip title="Attendence">
            <li>
              <Button
                style={{ color: "#555151" }}
                className={`custom-button ${
                  context.activeButton === 1 ? "active" : ""
                }`}
                onClick={() => handleClick(1, "/attendance", "Attendance")}
              >
                <span className="icon">
                  <svg
                    viewBox="0 0 24 24"
                    height="20px"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    stroke="#000000"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <path
                        d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                        stroke="#000000"
                        stroke-width="1.08"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>{" "}
                      <path
                        d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z"
                        stroke="#000000"
                        stroke-width="1.08"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>{" "}
                    </g>
                  </svg>
                </span>
                Attendance
              </Button>
            </li>
          </Tooltip>
        ) : (
          <li>
            <Button
              style={{ color: "#555151" }}
              className={`custom-button ${
                context.activeButton === 1 ? "active" : ""
              }`}
              onClick={() => handleClick(1, "/attendance", "Attendance")}
            >
              <span className="icon">
                <svg
                  viewBox="0 0 24 24"
                  height="20px"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="#000000"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path
                      d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                      stroke="#000000"
                      stroke-width="1.08"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>{" "}
                    <path
                      d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z"
                      stroke="#000000"
                      stroke-width="1.08"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>{" "}
                  </g>
                </svg>
              </span>
              Attendance
            </Button>
          </li>
        )}

        {context.toggleSidebar ? (
          <Tooltip title="Projects">
            <li>
              <Button
                style={{ color: "#555151" }}
                className={`custom-button ${
                  context.activeButton === 2 ? "active" : ""
                }`}
                onClick={() => handleClick(2, "/project-lists", "Projects")}
              >
                <span className="icon">
                  {/* <svg width="20px" height="20px" viewBox="0 0 24.00 24.00" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>Stats</title> <g id="Stats" stroke-width="1.104" fill="none" fill-rule="evenodd"> <rect id="Container" x="0" y="0" width="24" height="24"> </rect> <path d="M6,4 L18,4 C19.1045695,4 20,4.8954305 20,6 L20,18 C20,19.1045695 19.1045695,20 18,20 L6,20 C4.8954305,20 4,19.1045695 4,18 L4,6 C4,4.8954305 4.8954305,4 6,4 Z" id="shape-1" stroke="#030819" stroke-width="1.104" stroke-linecap="round" stroke-dasharray="0,0"> </path> <line x1="7.99991122" y1="17" x2="8" y2="11" id="shape-2" stroke="#030819" stroke-width="1.104" stroke-linecap="round" stroke-dasharray="0,0"> </line> <line x1="11.9999112" y1="17" x2="12" y2="8" id="shape-3" stroke="#030819" stroke-width="1.104" stroke-linecap="round" stroke-dasharray="0,0"> </line> <line x1="15.9999112" y1="17" x2="16" y2="14" id="shape-4" stroke="#030819" stroke-width="1.104" stroke-linecap="round" stroke-dasharray="0,0"> </line> </g> </g></svg> */}
                  {isProjectsMenuOpen ? (
                    <span onClick={handleProjectsToggle}>
                      <svg
                        fill="#616161"
                        width="20px"
                        height="20px"
                        viewBox="0 0 24.00 24.00"
                        xmlns="http://www.w3.org/2000/svg"
                        stroke="#000000"
                        stroke-width="0.00024000000000000003"
                      >
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          {" "}
                          <g data-name="Layer 2">
                            {" "}
                            <g data-name="arrow-downward">
                              {" "}
                              <rect
                                width="24"
                                height="24"
                                transform="rotate(-90 12 12)"
                                opacity="0"
                              ></rect>{" "}
                              <path d="M12 17a1.72 1.72 0 0 1-1.33-.64l-4.21-5.1a2.1 2.1 0 0 1-.26-2.21A1.76 1.76 0 0 1 7.79 8h8.42a1.76 1.76 0 0 1 1.59 1.05 2.1 2.1 0 0 1-.26 2.21l-4.21 5.1A1.72 1.72 0 0 1 12 17z"></path>{" "}
                            </g>{" "}
                          </g>{" "}
                        </g>
                      </svg>
                    </span>
                  ) : (
                    <span
                      className="collapsed-submenu"
                      onClick={handleProjectsToggle}
                    >
                      <svg
                        fill="#616161"
                        width="20px"
                        height="20px"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          {" "}
                          <g data-name="Layer 2">
                            {" "}
                            <g data-name="arrow-right">
                              {" "}
                              <rect
                                width="24"
                                height="24"
                                transform="rotate(180 12 12)"
                                opacity="0"
                              ></rect>{" "}
                              <path d="M10.46 18a2.23 2.23 0 0 1-.91-.2 1.76 1.76 0 0 1-1.05-1.59V7.79A1.76 1.76 0 0 1 9.55 6.2a2.1 2.1 0 0 1 2.21.26l5.1 4.21a1.7 1.7 0 0 1 0 2.66l-5.1 4.21a2.06 2.06 0 0 1-1.3.46z"></path>{" "}
                            </g>{" "}
                          </g>{" "}
                        </g>
                      </svg>
                    </span>
                  )}
                </span>
                Projects{" "}
                <span
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginLeftLeft: "12rem",
                    fontSize: "1.1rem",
                    width: "8vw",
                  }}
                  onClick={showSidebarModal}
                >
                  {" "}
                </span>
              </Button>
            </li>
          </Tooltip>
        ) : (
          <li>
            <Button
              style={{ color: "#555151" }}
              className={`custom-button ${
                context.activeButton === 2 ? "active" : ""
              }`}
              onClick={() => handleClick(2, "/project-lists", "Projects")}
            >
              <span className="icon">
                {/* <svg width="20px" height="20px" viewBox="0 0 24.00 24.00" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>Stats</title> <g id="Stats" stroke-width="1.104" fill="none" fill-rule="evenodd"> <rect id="Container" x="0" y="0" width="24" height="24"> </rect> <path d="M6,4 L18,4 C19.1045695,4 20,4.8954305 20,6 L20,18 C20,19.1045695 19.1045695,20 18,20 L6,20 C4.8954305,20 4,19.1045695 4,18 L4,6 C4,4.8954305 4.8954305,4 6,4 Z" id="shape-1" stroke="#030819" stroke-width="1.104" stroke-linecap="round" stroke-dasharray="0,0"> </path> <line x1="7.99991122" y1="17" x2="8" y2="11" id="shape-2" stroke="#030819" stroke-width="1.104" stroke-linecap="round" stroke-dasharray="0,0"> </line> <line x1="11.9999112" y1="17" x2="12" y2="8" id="shape-3" stroke="#030819" stroke-width="1.104" stroke-linecap="round" stroke-dasharray="0,0"> </line> <line x1="15.9999112" y1="17" x2="16" y2="14" id="shape-4" stroke="#030819" stroke-width="1.104" stroke-linecap="round" stroke-dasharray="0,0"> </line> </g> </g></svg> */}
                {isProjectsMenuOpen ? (
                  <span onClick={handleProjectsToggle}>
                    <svg
                      fill="#616161"
                      width="20px"
                      height="20px"
                      viewBox="0 0 24.00 24.00"
                      xmlns="http://www.w3.org/2000/svg"
                      stroke="#000000"
                      stroke-width="0.00024000000000000003"
                    >
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <g data-name="Layer 2">
                          {" "}
                          <g data-name="arrow-downward">
                            {" "}
                            <rect
                              width="24"
                              height="24"
                              transform="rotate(-90 12 12)"
                              opacity="0"
                            ></rect>{" "}
                            <path d="M12 17a1.72 1.72 0 0 1-1.33-.64l-4.21-5.1a2.1 2.1 0 0 1-.26-2.21A1.76 1.76 0 0 1 7.79 8h8.42a1.76 1.76 0 0 1 1.59 1.05 2.1 2.1 0 0 1-.26 2.21l-4.21 5.1A1.72 1.72 0 0 1 12 17z"></path>{" "}
                          </g>{" "}
                        </g>{" "}
                      </g>
                    </svg>
                  </span>
                ) : (
                  <span
                    className="collapsed-submenu"
                    onClick={handleProjectsToggle}
                  >
                    <svg
                      fill="#616161"
                      width="20px"
                      height="20px"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <g data-name="Layer 2">
                          {" "}
                          <g data-name="arrow-right">
                            {" "}
                            <rect
                              width="24"
                              height="24"
                              transform="rotate(180 12 12)"
                              opacity="0"
                            ></rect>{" "}
                            <path d="M10.46 18a2.23 2.23 0 0 1-.91-.2 1.76 1.76 0 0 1-1.05-1.59V7.79A1.76 1.76 0 0 1 9.55 6.2a2.1 2.1 0 0 1 2.21.26l5.1 4.21a1.7 1.7 0 0 1 0 2.66l-5.1 4.21a2.06 2.06 0 0 1-1.3.46z"></path>{" "}
                          </g>{" "}
                        </g>{" "}
                      </g>
                    </svg>
                  </span>
                )}
              </span>
              Projects{" "}
              <span
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginLeftLeft: "12rem",
                  fontSize: "1.1rem",
                  width: "8vw",
                }}
                onClick={showSidebarModal}
              >
                {" "}
              </span>
            </Button>
          </li>
        )}
        <li>
          {isProjectsMenuOpen &&
            projectsData.map((project, index) => (
              <li
                key={index}
                style={{ display: "flex", gap: "10px", marginTop: " 3px" }}
              >
                {context.toggleSidebar ? (
                  <Tooltip title={project.projectName}>
                    <NavLink
                      style={{
                        display: "flex",
                        gap: "10px",
                        width: "16vw",
                        padding: "4px",
                        paddingLeft: "15px",
                        fontSize: "0.9rem",
                        color: "#2a2e34",
                      }}
                      to={`/projects/${project._id}`}
                      className={
                        context.activeButton === 2
                          ? activeProject === project
                          : "submenu-active"
                          ? "remove"
                          : ""
                      } //final
                      onClick={() =>
                        handleProjectClick(project._id, project.projectName)
                      }
                    >
                      <span>
                        <svg
                          fill="#4e4c4c"
                          height="14px"
                          width="13px"
                          version="1.1"
                          id="Capa_1"
                          xmlns="http://www.w3.org/2000/svg"
                          xmlns:xlink="http://www.w3.org/1999/xlink"
                          viewBox="0 0 487.30 487.30"
                          xml:space="preserve"
                        >
                          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                          <g
                            id="SVGRepo_tracerCarrier"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></g>
                          <g id="SVGRepo_iconCarrier">
                            {" "}
                            <g>
                              {" "}
                              <g>
                                {" "}
                                <path d="M487.2,69.7c0,12.9-10.5,23.4-23.4,23.4h-322c-12.9,0-23.4-10.5-23.4-23.4s10.5-23.4,23.4-23.4h322.1 C476.8,46.4,487.2,56.8,487.2,69.7z M463.9,162.3H141.8c-12.9,0-23.4,10.5-23.4,23.4s10.5,23.4,23.4,23.4h322.1 c12.9,0,23.4-10.5,23.4-23.4C487.2,172.8,476.8,162.3,463.9,162.3z M463.9,278.3H141.8c-12.9,0-23.4,10.5-23.4,23.4 s10.5,23.4,23.4,23.4h322.1c12.9,0,23.4-10.5,23.4-23.4C487.2,288.8,476.8,278.3,463.9,278.3z M463.9,394.3H141.8 c-12.9,0-23.4,10.5-23.4,23.4s10.5,23.4,23.4,23.4h322.1c12.9,0,23.4-10.5,23.4-23.4C487.2,404.8,476.8,394.3,463.9,394.3z M38.9,30.8C17.4,30.8,0,48.2,0,69.7s17.4,39,38.9,39s38.9-17.5,38.9-39S60.4,30.8,38.9,30.8z M38.9,146.8 C17.4,146.8,0,164.2,0,185.7s17.4,38.9,38.9,38.9s38.9-17.4,38.9-38.9S60.4,146.8,38.9,146.8z M38.9,262.8 C17.4,262.8,0,280.2,0,301.7s17.4,38.9,38.9,38.9s38.9-17.4,38.9-38.9S60.4,262.8,38.9,262.8z M38.9,378.7 C17.4,378.7,0,396.1,0,417.6s17.4,38.9,38.9,38.9s38.9-17.4,38.9-38.9C77.8,396.2,60.4,378.7,38.9,378.7z"></path>{" "}
                              </g>{" "}
                            </g>{" "}
                          </g>
                        </svg>
                      </span>
                      {project.projectName}
                    </NavLink>
                  </Tooltip>
                ) : (
                  <NavLink
                    style={{
                      display: "flex",
                      gap: "10px",
                      width: "16vw",
                      padding: "4px",
                      paddingLeft: "15px",
                      fontSize: "0.9rem",
                      color: "#2a2e34",
                    }}
                    to={`/projects/${project._id}`}
                    className={
                      context.activeButton === 2
                        ? activeProject === project
                        : "submenu-active"
                        ? "remove"
                        : ""
                    } //final
                    onClick={() =>
                      handleProjectClick(project._id, project.projectName)
                    }
                  >
                    <span>
                      <svg
                        fill="#4e4c4c"
                        height="14px"
                        width="13px"
                        version="1.1"
                        id="Capa_1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink"
                        viewBox="0 0 487.30 487.30"
                        xml:space="preserve"
                      >
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          {" "}
                          <g>
                            {" "}
                            <g>
                              {" "}
                              <path d="M487.2,69.7c0,12.9-10.5,23.4-23.4,23.4h-322c-12.9,0-23.4-10.5-23.4-23.4s10.5-23.4,23.4-23.4h322.1 C476.8,46.4,487.2,56.8,487.2,69.7z M463.9,162.3H141.8c-12.9,0-23.4,10.5-23.4,23.4s10.5,23.4,23.4,23.4h322.1 c12.9,0,23.4-10.5,23.4-23.4C487.2,172.8,476.8,162.3,463.9,162.3z M463.9,278.3H141.8c-12.9,0-23.4,10.5-23.4,23.4 s10.5,23.4,23.4,23.4h322.1c12.9,0,23.4-10.5,23.4-23.4C487.2,288.8,476.8,278.3,463.9,278.3z M463.9,394.3H141.8 c-12.9,0-23.4,10.5-23.4,23.4s10.5,23.4,23.4,23.4h322.1c12.9,0,23.4-10.5,23.4-23.4C487.2,404.8,476.8,394.3,463.9,394.3z M38.9,30.8C17.4,30.8,0,48.2,0,69.7s17.4,39,38.9,39s38.9-17.5,38.9-39S60.4,30.8,38.9,30.8z M38.9,146.8 C17.4,146.8,0,164.2,0,185.7s17.4,38.9,38.9,38.9s38.9-17.4,38.9-38.9S60.4,146.8,38.9,146.8z M38.9,262.8 C17.4,262.8,0,280.2,0,301.7s17.4,38.9,38.9,38.9s38.9-17.4,38.9-38.9S60.4,262.8,38.9,262.8z M38.9,378.7 C17.4,378.7,0,396.1,0,417.6s17.4,38.9,38.9,38.9s38.9-17.4,38.9-38.9C77.8,396.2,60.4,378.7,38.9,378.7z"></path>{" "}
                            </g>{" "}
                          </g>{" "}
                        </g>
                      </svg>
                    </span>
                    {project.projectName}
                  </NavLink>
                )}
              </li>
            ))}
        </li>

        <Modal
          title="Add Project"
          visible={isSidebarModalOpen}
          onOk={handleSidebarOk}
          onCancel={handleSidebarCancel}
        >
          <Form layout="vertical">
            <Form.Item label="Project Name" required>
              <Input
                value={projectsName}
                onChange={(e) => setProjectsName(e.target.value)}
              />
            </Form.Item>
          </Form>
        </Modal>

        {context.toggleSidebar ? (
          <Tooltip title="Callbacks">
            <li>
              <Button
                style={{ color: "#555151" }}
                className={`custom-button ${
                  context.activeButton === 3 ? "active" : ""
                }`}
                onClick={() => handleClick(3, "/callbacks", "Callbacks")}
              >
                <span className="icon">
                  <svg
                    width="16px"
                    height="16px"
                    viewBox="0 0 36 36"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21.1972 26.4267C21.1972 26.4267 24.9821 23.9627 25.7391 23.5837C26.4961 23.2046 27.3477 23.0151 27.8208 23.3941C28.5778 23.868 34.9176 28.0378 35.4853 28.4169C36.0531 28.796 36.2423 29.8384 35.58 30.8809C34.823 31.9233 31.5112 36.0932 30.0918 35.9984C28.6724 35.9984 22.1434 36.3775 10.8832 25.1947C-0.376992 13.9172 0.00150186 7.37818 0.00150186 5.95665C0.00150186 4.53511 4.07032 1.12343 5.11118 0.460046C6.15203 -0.298106 7.19289 -0.0137991 7.57139 0.554815C7.94988 1.12343 12.1133 7.47295 12.5864 8.2311C12.8703 8.70495 12.7757 9.55787 12.3972 10.316C12.0187 11.0742 9.55848 14.8649 9.55848 14.8649C9.55848 14.8649 10.2208 17.5185 14.2897 21.6883C18.4531 25.7634 21.1972 26.4267 21.1972 26.4267Z"
                      fill="#4e4c4c"
                    />
                    <path
                      d="M29.3344 2.83875H19.8721V6.62369H29.3344C30.3753 6.62369 31.2269 7.4753 31.2269 8.51616V17.9785H35.0118V8.51616C35.0118 5.39358 32.457 2.83875 29.3344 2.83875Z"
                      fill="#4e4c4c"
                    />
                    <path
                      d="M22.7109 9.46236L16.3711 4.73118L22.7109 0V9.46236Z"
                      fill="#4e4c4c"
                    />
                  </svg>
                </span>
                Callbacks
              </Button>
            </li>
          </Tooltip>
        ) : (
          <li>
            <Button
              style={{ color: "#555151" }}
              className={`custom-button ${
                context.activeButton === 3 ? "active" : ""
              }`}
              onClick={() => handleClick(3, "/callbacks", "Callbacks")}
            >
              <span className="icon">
                <svg
                  width="16px"
                  height="16px"
                  viewBox="0 0 36 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21.1972 26.4267C21.1972 26.4267 24.9821 23.9627 25.7391 23.5837C26.4961 23.2046 27.3477 23.0151 27.8208 23.3941C28.5778 23.868 34.9176 28.0378 35.4853 28.4169C36.0531 28.796 36.2423 29.8384 35.58 30.8809C34.823 31.9233 31.5112 36.0932 30.0918 35.9984C28.6724 35.9984 22.1434 36.3775 10.8832 25.1947C-0.376992 13.9172 0.00150186 7.37818 0.00150186 5.95665C0.00150186 4.53511 4.07032 1.12343 5.11118 0.460046C6.15203 -0.298106 7.19289 -0.0137991 7.57139 0.554815C7.94988 1.12343 12.1133 7.47295 12.5864 8.2311C12.8703 8.70495 12.7757 9.55787 12.3972 10.316C12.0187 11.0742 9.55848 14.8649 9.55848 14.8649C9.55848 14.8649 10.2208 17.5185 14.2897 21.6883C18.4531 25.7634 21.1972 26.4267 21.1972 26.4267Z"
                    fill="#4e4c4c"
                  />
                  <path
                    d="M29.3344 2.83875H19.8721V6.62369H29.3344C30.3753 6.62369 31.2269 7.4753 31.2269 8.51616V17.9785H35.0118V8.51616C35.0118 5.39358 32.457 2.83875 29.3344 2.83875Z"
                    fill="#4e4c4c"
                  />
                  <path
                    d="M22.7109 9.46236L16.3711 4.73118L22.7109 0V9.46236Z"
                    fill="#4e4c4c"
                  />
                </svg>
              </span>
              Callbacks
            </Button>
          </li>
        )}

        {context.toggleSidebar ? (
          <Tooltip title="Transfers">
            <li>
              <Button
                style={{ color: "#555151" }}
                className={`custom-button ${
                  context.activeButton === 4 ? "active" : ""
                }`}
                onClick={() => handleClick(4, "/transfers", "Transfers")}
              >
                <span className="icon">
                  <svg
                    height="19px"
                    width="20px"
                    viewBox="0 0 43 36"
                    fill="#4e4c4c"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21.1972 26.4267C21.1972 26.4267 24.9821 23.9627 25.7391 23.5837C26.4961 23.2046 27.3477 23.0151 27.8208 23.3941C28.5778 23.868 34.9176 28.0378 35.4853 28.4169C36.0531 28.796 36.2423 29.8384 35.58 30.8809C34.823 31.9233 31.5112 36.0932 30.0918 35.9984C28.6724 35.9984 22.1434 36.3775 10.8832 25.1947C-0.376992 13.9172 0.00150186 7.37818 0.00150186 5.95665C0.00150186 4.53511 4.07032 1.12343 5.11118 0.460046C6.15203 -0.298106 7.19289 -0.0137991 7.57139 0.554815C7.94988 1.12343 12.1133 7.47295 12.5864 8.2311C12.8703 8.70495 12.7757 9.55787 12.3972 10.316C12.0187 11.0742 9.55848 14.8649 9.55848 14.8649C9.55848 14.8649 10.2208 17.5185 14.2897 21.6883C18.4531 25.7634 21.1972 26.4267 21.1972 26.4267Z"
                      fill="#4e4c4c"
                    />
                    <path
                      d="M29.0484 2.83875H38.5107V6.62369H29.0484C28.0075 6.62369 27.1559 7.4753 27.1559 8.51616V17.9785H23.371V8.51616C23.371 5.39358 25.9258 2.83875 29.0484 2.83875Z"
                      fill="#4e4c4c"
                    />
                    <path
                      d="M35.6719 9.46236L42.0117 4.73118L35.6719 0V9.46236Z"
                      fill="#4e4c4c"
                    />
                  </svg>
                </span>
                Transfers
              </Button>
            </li>
          </Tooltip>
        ) : (
          <li>
            <Button
              style={{ color: "#555151" }}
              className={`custom-button ${
                context.activeButton === 4 ? "active" : ""
              }`}
              onClick={() => handleClick(4, "/transfers", "Transfers")}
            >
              <span className="icon">
                <svg
                  height="19px"
                  width="20px"
                  viewBox="0 0 43 36"
                  fill="#4e4c4c"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21.1972 26.4267C21.1972 26.4267 24.9821 23.9627 25.7391 23.5837C26.4961 23.2046 27.3477 23.0151 27.8208 23.3941C28.5778 23.868 34.9176 28.0378 35.4853 28.4169C36.0531 28.796 36.2423 29.8384 35.58 30.8809C34.823 31.9233 31.5112 36.0932 30.0918 35.9984C28.6724 35.9984 22.1434 36.3775 10.8832 25.1947C-0.376992 13.9172 0.00150186 7.37818 0.00150186 5.95665C0.00150186 4.53511 4.07032 1.12343 5.11118 0.460046C6.15203 -0.298106 7.19289 -0.0137991 7.57139 0.554815C7.94988 1.12343 12.1133 7.47295 12.5864 8.2311C12.8703 8.70495 12.7757 9.55787 12.3972 10.316C12.0187 11.0742 9.55848 14.8649 9.55848 14.8649C9.55848 14.8649 10.2208 17.5185 14.2897 21.6883C18.4531 25.7634 21.1972 26.4267 21.1972 26.4267Z"
                    fill="#4e4c4c"
                  />
                  <path
                    d="M29.0484 2.83875H38.5107V6.62369H29.0484C28.0075 6.62369 27.1559 7.4753 27.1559 8.51616V17.9785H23.371V8.51616C23.371 5.39358 25.9258 2.83875 29.0484 2.83875Z"
                    fill="#4e4c4c"
                  />
                  <path
                    d="M35.6719 9.46236L42.0117 4.73118L35.6719 0V9.46236Z"
                    fill="#4e4c4c"
                  />
                </svg>
              </span>
              Transfers
            </Button>
          </li>
        )}

        {context.toggleSidebar ? (
          <Tooltip title="Sales">
            <li>
              <Button
                style={{ color: "#555151" }}
                className={`custom-button ${
                  context.activeButton === 5 ? "active" : ""
                }`}
                onClick={() => handleClick(5, "/employee-sales", "Sales")}
              >
                <span className="icon">
                  <svg
                    width="25px"
                    height="25px"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M41 14L24 4L7 14V34L24 44L41 34V14Z"
                      stroke="white"
                      stroke-width="4"
                      stroke-linejoin="round"
                      fill="#4e4c4c"
                    />
                    <path
                      d="M24 22V30M32 18V30M16 26V30"
                      stroke="white"
                      stroke-width="4"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      fill="#4e4c4c"
                    />
                  </svg>
                </span>
                Sales
              </Button>
            </li>
          </Tooltip>
        ) : (
          <li>
            <Button
              style={{ color: "#555151" }}
              className={`custom-button ${
                context.activeButton === 5 ? "active" : ""
              }`}
              onClick={() => handleClick(5, "/employee-sales", "Sales")}
            >
              <span className="icon">
                <svg
                  width="25px"
                  height="25px"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M41 14L24 4L7 14V34L24 44L41 34V14Z"
                    stroke="white"
                    stroke-width="4"
                    stroke-linejoin="round"
                    fill="#4e4c4c"
                  />
                  <path
                    d="M24 22V30M32 18V30M16 26V30"
                    stroke="white"
                    stroke-width="4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    fill="#4e4c4c"
                  />
                </svg>
              </span>
              Sales
            </Button>
          </li>
        )}

        {context.toggleSidebar ? (
          <Tooltip title="Notes">
            <li>
              <Button
                style={{ color: "#555151" }}
                className={`custom-button ${
                  context.activeButton === 6 ? "active" : ""
                }`}
                onClick={() => handleClick(6, "/employee-notes", "Notes")}
              >
                <span className="icon">
                  <svg
                    width="20px"
                    height="20px"
                    fill="#4e4c4c"
                    viewBox="0 0 1920 1920"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <g fill-rule="evenodd">
                        {" "}
                        <path d="M106.667 267H320v213.333h853.33V267h213.34v160h106.66V160.333h-329.1C1142.26 98.19 1083 53.667 1013.33 53.667H480c-69.665 0-128.931 44.523-150.896 106.666H0V1867h1493.33v-320h-106.66v213.33H106.667V267Zm320 106.667v-160c0-29.456 23.878-53.334 53.333-53.334h533.33c29.46 0 53.34 23.878 53.34 53.334v160H426.667Z"></path>{" "}
                        <path d="m1677.57 528.309 225.88 225.883c22.02 22.023 22.02 57.713 0 79.849L1225.8 1511.69c-10.62 10.5-24.96 16.49-39.98 16.49H959.937c-31.171 0-56.47-25.3-56.47-56.47v-225.89c0-15.02 5.986-29.36 16.489-39.86L1597.6 528.309c22.14-22.136 57.83-22.136 79.97 0Zm-155.41 235.144 146.03 146.033 115.43-115.426-146.04-146.033-115.42 115.426Zm-505.75 651.787h146.03l425.9-425.9-146.03-146.038-425.9 425.898v146.04Z"></path>{" "}
                      </g>{" "}
                    </g>
                  </svg>
                </span>
                Notes
              </Button>
            </li>
          </Tooltip>
        ) : (
          <li>
            <Button
              style={{ color: "#555151" }}
              className={`custom-button ${
                context.activeButton === 6 ? "active" : ""
              }`}
              onClick={() => handleClick(6, "/employee-notes", "Notes")}
            >
              <span className="icon">
                <svg
                  width="20px"
                  height="20px"
                  fill="#4e4c4c"
                  viewBox="0 0 1920 1920"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <g fill-rule="evenodd">
                      {" "}
                      <path d="M106.667 267H320v213.333h853.33V267h213.34v160h106.66V160.333h-329.1C1142.26 98.19 1083 53.667 1013.33 53.667H480c-69.665 0-128.931 44.523-150.896 106.666H0V1867h1493.33v-320h-106.66v213.33H106.667V267Zm320 106.667v-160c0-29.456 23.878-53.334 53.333-53.334h533.33c29.46 0 53.34 23.878 53.34 53.334v160H426.667Z"></path>{" "}
                      <path d="m1677.57 528.309 225.88 225.883c22.02 22.023 22.02 57.713 0 79.849L1225.8 1511.69c-10.62 10.5-24.96 16.49-39.98 16.49H959.937c-31.171 0-56.47-25.3-56.47-56.47v-225.89c0-15.02 5.986-29.36 16.489-39.86L1597.6 528.309c22.14-22.136 57.83-22.136 79.97 0Zm-155.41 235.144 146.03 146.033 115.43-115.426-146.04-146.033-115.42 115.426Zm-505.75 651.787h146.03l425.9-425.9-146.03-146.038-425.9 425.898v146.04Z"></path>{" "}
                    </g>{" "}
                  </g>
                </svg>
              </span>
              Notes
            </Button>
          </li>
        )}

        {context.toggleSidebar ? (
          <Tooltip title="Send Messages">
            <li>
              <Button
                style={{ color: "#555151" }}
                className={`custom-button ${
                  context.activeButton === 7 ? "active" : ""
                }`}
                onClick={() => handleClick(7, "/employee-msg", "Messages")}
              >
                <span className="icon">
                  <svg
                    width="24px"
                    height="24px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <path
                        d="M10 9H17M10 13H17M7 9H7.01M7 13H7.01M21 20L17.6757 18.3378C17.4237 18.2118 17.2977 18.1488 17.1656 18.1044C17.0484 18.065 16.9277 18.0365 16.8052 18.0193C16.6672 18 16.5263 18 16.2446 18H6.2C5.07989 18 4.51984 18 4.09202 17.782C3.71569 17.5903 3.40973 17.2843 3.21799 16.908C3 16.4802 3 15.9201 3 14.8V7.2C3 6.07989 3 5.51984 3.21799 5.09202C3.40973 4.71569 3.71569 4.40973 4.09202 4.21799C4.51984 4 5.0799 4 6.2 4H17.8C18.9201 4 19.4802 4 19.908 4.21799C20.2843 4.40973 20.5903 4.71569 20.782 5.09202C21 5.51984 21 6.0799 21 7.2V20Z"
                        stroke="#4d4c4c"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>{" "}
                    </g>
                  </svg>
                </span>
                Send Messages
              </Button>
            </li>
          </Tooltip>
        ) : (
          <li>
            <Button
              style={{ color: "#555151" }}
              className={`custom-button ${
                context.activeButton === 7 ? "active" : ""
              }`}
              onClick={() =>{ handleClick(7, "/employee-msg", "Messages")
                handleMsgSeen()
              }}
            >
              <span className="icon">
                <Badge
                  count={length}
                  overflowCount={99}
                  style={{ left: "-1px", width: "12px", paddingLeft: "10px" }}
                >
                  <svg
                    width="24px"
                    height="24px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <path
                        d="M10 9H17M10 13H17M7 9H7.01M7 13H7.01M21 20L17.6757 18.3378C17.4237 18.2118 17.2977 18.1488 17.1656 18.1044C17.0484 18.065 16.9277 18.0365 16.8052 18.0193C16.6672 18 16.5263 18 16.2446 18H6.2C5.07989 18 4.51984 18 4.09202 17.782C3.71569 17.5903 3.40973 17.2843 3.21799 16.908C3 16.4802 3 15.9201 3 14.8V7.2C3 6.07989 3 5.51984 3.21799 5.09202C3.40973 4.71569 3.71569 4.40973 4.09202 4.21799C4.51984 4 5.0799 4 6.2 4H17.8C18.9201 4 19.4802 4 19.908 4.21799C20.2843 4.40973 20.5903 4.71569 20.782 5.09202C21 5.51984 21 6.0799 21 7.2V20Z"
                        stroke="#4d4c4c"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>{" "}
                    </g>
                  </svg>
                </Badge>
              </span>
              Send Messages
            </Button>
          </li>
        )}
        {/* Add other buttons similarly */}
      </ul>
    </div>
  );
};

export default Sidebar;
