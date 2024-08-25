import React, { useState, useEffect } from "react";
import { Drawer, Button, Form, Input, Row, Col, Select, Space } from "antd";
import axios from "axios";
import image1 from "../../assets/finger-print-12.png";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
// import "../Projects/Projects.css";
import { createStyles } from "antd-style";
import { IoIosArrowDown } from "react-icons/io";
import { FaFilter, FaListUl } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";

const { Option } = Select;
const useStyle = createStyles(({ token }) => ({
  "my-drawer-mask": {
    boxShadow: `inset 0 0 15px #fff`,
  },
  "my-drawer-content": {
    borderLeft: "2px dotted #333",
  },
}));

const UserProfileDrawer = ({ open, onClose }) => {
  const { styles } = useStyle();
  const [form] = Form.useForm();
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate()
  
  const [name, setName] = useState("");
  const [aliceName, setAliceName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("Day");
  const [isProfileToggle, setIsProfileToggle] = useState(false);
  const [activeButton, setActiveButton] = useState(0);

  const [EmployeeData, setEmployeeData] = useState([]);
  const [EmployeeTasks, setEmployeeTasks] = useState([]);

  console.log("user", user);
  console.log("employeData", EmployeeData);
  const handleSubmit = async () => {
    console.log("Backend API URL:", import.meta.env.VITE_BACKEND_API);
    try {

      await form.validateFields();
      const payload = {
        name,
        aliceName,
        email,
        phone,
        password,
        type,
      };
      console.log("payload", payload);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/registeruser`,
        payload
      );

      console.log("res", res);
      toast.success(res.data, {});
      setName("");
      setAliceName("");
      setEmail("");
      setPhone("");
      setPassword("");
      onClose();
    } catch (error) {
      if (error.response) {
        toast.warning(error.response.data, {});
      } else {
        console.log("Validation failed:", error);
      }
    }
  };

  const handleLogout = async() => {
    localStorage.removeItem("user");
    Cookies.remove("token");
    onClose()
    // await new Promise((resolve) => setTimeout(resolve, 100));
    navigate("/Login");
    window.location.reload()
  };

  // antd Styling
  const classNames = {
    body: styles["my-drawer-body"],
    mask: styles["my-drawer-mask"],
    header: styles["my-drawer-header"],
    footer: styles["my-drawer-footer"],
    content: styles["my-drawer-content"],
  };
  const drawerStyles = {};

  const emailValidator = (_, value) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value || emailPattern.test(value)) {
      return Promise.resolve();
    }
    toast.error("Please enter a valid email address.");
    return Promise.reject(new Error("Please enter a valid email address."));
  };

  const minLengthValidator = (minLength) => (_, value) => {
    if (!value || value.length >= minLength) {
      return Promise.resolve();
    }
    toast.error(`Minimum length should be ${minLength} characters.`);
    return Promise.reject(
      new Error(`Minimum length should be ${minLength} characters.`)
    );
  };

  const data = {
    name: "Kajal Gupta",
    image: image1,
  };

  const getEmployeeTaskData = async () => {
    console.log("user._id");
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_API}/tasks/${user._id}`
      );
      setEmployeeData(response.data);
      const assignedTasks = response.data.reduce((tasks, project) => {
        const userTasks = project.tasks.filter(
          (task) => task.assigneeId === user._id
        );
        return tasks.concat(userTasks);
      }, []);
      console.log("assignedTasks", assignedTasks);
      setEmployeeTasks(assignedTasks);
    } catch (err) {
      console.log("catch error ", err);
    }
  };

  console.log("employeData", EmployeeData);
  const handleProfileToggle = () => {
    setIsProfileToggle(!isProfileToggle);
  };

  useEffect(() => {
    getEmployeeTaskData();
  }, []);

  return (
    <div className="drawerPage">
      <Drawer
        title={
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ display: "flex" }}>
              <div
                className="profileBtn d-flex"
                style={{
                  background: "#efe9e9",
                  padding: "7px",
                  width: "42px",
                  height: "42px",
                  borderRadius: "20px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <button
                  className="rounded-circle1"
                  style={{
                    width: "35px !important",
                    padding: "10px",
                    height: "30px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#bba399",
                    color: "#fff",
                    border: "none",
                  }}
                  onClick={handleProfileToggle}
                >
                  {user?.name && user.name.charAt(0).toUpperCase()}
                </button>
              </div>
              <div
                className="d-flex align-items-center gap-1"
                style={{ height: "50px" }}
              >
                <h6
                  style={{
                    fontSize: "1rem",
                    opacity: "0.99",
                    paddingLeft: "5px",
                  }}
                  className="mt-2 mx-auto"
                >
                  {user?.name && user?.name.toUpperCase()}
                </h6>
              </div>
            </div>
            <div
              className="logout-btn "
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Button
               
              className="custom-btn btn-5"
              
              onClick={() =>  handleLogout()}
              >Logout</Button>
            </div>
          </div>
        }
        width={650}
        onClose={onClose}
        open={open}
        classNames={classNames}
        styles={drawerStyles}
        bodyStyle={{
          paddingBottom: 80,
        }}
      >
        <div className="projectDrawer">
          <Form form={form} layout="vertical">
            <ul
              class="nav nav-pills nav-underline"
              id="pills-tab1"
              role="tablist"
            >
              <li class="nav-item " role="presentation">
                <button
                  class="nav-link active nav-underline px-3"
                  id="pills-activity"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-activity-home"
                  type="button"
                  role="tab"
                  aria-controls="pills-home"
                  aria-selected="true"
                >
                  Activity
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button
                  class="nav-link px-3"
                  id="pills-mywork"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-mywork-home"
                  type="button"
                  role="tab"
                  aria-controls="pills-contact"
                  aria-selected="false"
                >
                  My Work
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button
                  class="nav-link px-3"
                  id="pills-assignedwork"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-assignedwork-home"
                  type="button"
                  role="tab"
                  aria-controls="pills-contact"
                  aria-selected="false"
                >
                  {" "}
                  Newly Assigned Task
                </button>
              </li>
            </ul>
            <div
              style={{ borderBottom: "1px solid #ddd9d9", paddingTop: "3px " }}
            ></div>

            <div className="tab-content all-projects" id="pills-tabContent">
              <div
                className="tab-pane fade show active table-responsive"
                id="pills-activity-home"
                role="tabpanel"
                aria-labelledby="pills-activity-home"
                tabindex="0"
              >
                <div>
                  <div
                    className="d-flex justify-content-start gap-4 mx-5 mt-4"
                    style={{ flexDirection: "column" }}
                  >
                    {EmployeeData?.map((itemData, i) => {
                      return (
                        <>
                          <div>
                            <p
                              style={{
                                fontSize: "0.9rem",
                                letterSpacing: "0.6px",
                                color: "#2b2828",
                              }}
                            >
                              Project Name : {itemData.projectName}
                            </p>
                          </div>
                          {EmployeeTasks.map((itemTask) => {
                            return (
                              <div
                                className="all-project-list"
                                style={{
                                  border: "1px solid #ccc",
                                  padding: "10px",
                                  lineHeight: "20px",
                                  color: "gray",
                                  fontSize: "0.8rem",
                                  height: "auto",
                                  borderRadius: "6px",
                                  boxShadow: "0 0 7px #b4b2b2",
                                }}
                              >
                                <p>
                                  {" "}
                                  <span style={{ paddingRight: "5px" }}>
                                    <svg
                                      width="12px"
                                      height="12px"
                                      viewBox="0 0 16 16"
                                      version="1.1"
                                      xmlns="http://www.w3.org/2000/svg"
                                      xmlns:xlink="http://www.w3.org/1999/xlink"
                                      fill="#000000"
                                    >
                                      <g
                                        id="SVGRepo_bgCarrier"
                                        stroke-width="0"
                                      ></g>
                                      <g
                                        id="SVGRepo_tracerCarrier"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      ></g>
                                      <g id="SVGRepo_iconCarrier">
                                        {" "}
                                        <path
                                          fill="#87909E"
                                          d="M8 4c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4z"
                                        ></path>{" "}
                                        <path
                                          fill="#87909E"
                                          d="M8 1c3.9 0 7 3.1 7 7s-3.1 7-7 7-7-3.1-7-7 3.1-7 7-7zM8 0c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8v0z"
                                        ></path>{" "}
                                      </g>
                                    </svg>{" "}
                                  </span>{" "}
                                  {itemTask.taskname || "Task Name"}
                                </p>

                                <p>
                                  {" "}
                                  <span style={{ paddingRight: "5px" }}>
                                    <svg
                                      fill="#000000"
                                      height="12px"
                                      width="12px"
                                      version="1.1"
                                      id="Layer_1"
                                      xmlns="http://www.w3.org/2000/svg"
                                      xmlns:xlink="http://www.w3.org/1999/xlink"
                                      viewBox="0 0 456.368 456.368"
                                      xml:space="preserve"
                                    >
                                      <g
                                        id="SVGRepo_bgCarrier"
                                        stroke-width="0"
                                      ></g>
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
                                            <g>
                                              {" "}
                                              <path d="M324.194,220.526c-6.172,7.772-13.106,14.947-21.07,21.423c45.459,26.076,76.149,75.1,76.149,131.158 c0,30.29-66.367,54.018-151.09,54.018s-151.09-23.728-151.09-54.018c0-56.058,30.69-105.082,76.149-131.158 c-7.963-6.476-14.897-13.65-21.07-21.423c-50.624,31.969-84.322,88.41-84.322,152.581c0,19.439,10.644,46.53,61.355,65.201 c31.632,11.647,73.886,18.06,118.979,18.06c45.093,0,87.347-6.413,118.979-18.06c50.71-18.671,61.355-45.762,61.355-65.201 C408.516,308.936,374.818,252.495,324.194,220.526z"></path>{" "}
                                              <path d="M228.182,239.795c56.833,0,100.597-54.936,100.597-119.897C328.779,54.907,284.993,0,228.182,0 c-56.833,0-100.597,54.936-100.597,119.897C127.585,184.888,171.372,239.795,228.182,239.795z M228.182,29.243 c39.344,0,71.354,40.667,71.354,90.654s-32.01,90.654-71.354,90.654s-71.354-40.667-71.354-90.654S188.838,29.243,228.182,29.243 z"></path>{" "}
                                            </g>{" "}
                                          </g>{" "}
                                        </g>{" "}
                                      </g>
                                    </svg>
                                  </span>
                                  {itemTask.assigneeName || "Assignee"}
                                </p>
                                <p>
                                  {" "}
                                  <span style={{ paddingRight: "5px" }}>
                                    <svg
                                      height="12px"
                                      width="12px"
                                      fill="#000000"
                                      viewBox="0 0 24 24"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <g
                                        id="SVGRepo_bgCarrier"
                                        stroke-width="0"
                                      ></g>
                                      <g
                                        id="SVGRepo_tracerCarrier"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      ></g>
                                      <g id="SVGRepo_iconCarrier">
                                        <path
                                          d="M6,22H18a3,3,0,0,0,3-3V7a2,2,0,0,0-2-2H17V3a1,1,0,0,0-2,0V5H9V3A1,1,0,0,0,7,3V5H5A2,2,0,0,0,3,7V19A3,3,0,0,0,6,22ZM5,12.5a.5.5,0,0,1,.5-.5h13a.5.5,0,0,1,.5.5V19a1,1,0,0,1-1,1H6a1,1,0,0,1-1-1Z"
                                          fill="#5b5757"
                                        ></path>
                                      </g>
                                    </svg>
                                  </span>
                                  Deadline: {itemTask.deadline}
                                </p>

                                <p>
                                  {" "}
                                  <span style={{ paddingRight: "5px" }}>
                                    <svg
                                      height="12px"
                                      width="12px"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <g
                                        id="SVGRepo_bgCarrier"
                                        stroke-width="0"
                                      ></g>
                                      <g
                                        id="SVGRepo_tracerCarrier"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      ></g>
                                      <g id="SVGRepo_iconCarrier">
                                        {" "}
                                        <path
                                          fill-rule="evenodd"
                                          clip-rule="evenodd"
                                          d="M5 1C4.44772 1 4 1.44772 4 2V22C4 22.5523 4.44772 23 5 23C5.55228 23 6 22.5523 6 22V14H19C19.3603 14 19.6927 13.8062 19.8702 13.4927C20.0477 13.1792 20.0429 12.7944 19.8575 12.4855L17.1662 8L19.8575 3.5145C20.0429 3.20556 20.0477 2.82081 19.8702 2.5073C19.6927 2.19379 19.3603 2 19 2L6 2C6 1.44772 5.55228 1 5 1ZM6 4V12H17.2338L15.1425 8.5145C14.9525 8.19781 14.9525 7.80219 15.1425 7.4855L17.2338 4H6Z"
                                          fill="#5b5757"
                                        ></path>{" "}
                                      </g>
                                    </svg>
                                  </span>
                                  Priority: {itemTask.priority}
                                </p>

                                <p>
                                  {" "}
                                  <span style={{ paddingRight: "5px" }}>
                                    <svg
                                      height="12px"
                                      width="12px"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <g
                                        id="SVGRepo_bgCarrier"
                                        stroke-width="0"
                                      ></g>
                                      <g
                                        id="SVGRepo_tracerCarrier"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      ></g>
                                      <g id="SVGRepo_iconCarrier">
                                        {" "}
                                        <path
                                          fill-rule="evenodd"
                                          clip-rule="evenodd"
                                          d="M5 1C4.44772 1 4 1.44772 4 2V22C4 22.5523 4.44772 23 5 23C5.55228 23 6 22.5523 6 22V14H19C19.3603 14 19.6927 13.8062 19.8702 13.4927C20.0477 13.1792 20.0429 12.7944 19.8575 12.4855L17.1662 8L19.8575 3.5145C20.0429 3.20556 20.0477 2.82081 19.8702 2.5073C19.6927 2.19379 19.3603 2 19 2L6 2C6 1.44772 5.55228 1 5 1ZM6 4V12H17.2338L15.1425 8.5145C14.9525 8.19781 14.9525 7.80219 15.1425 7.4855L17.2338 4H6Z"
                                          fill="#5b5757"
                                        ></path>{" "}
                                      </g>
                                    </svg>
                                  </span>
                                  Status: {itemTask.status}
                                </p>
                              </div>
                            );
                          })}
                        </>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div
                className="tab-pane fade"
                id="pills-mywork-home"
                role="tabpanel"
                aria-labelledby="pills-mywork-tab"
              >
                <div className="my-5">
                  <div className="d-flex justify-content-start gap-4 mx-5 mt-4">
                    <ul
                      class="nav nav-pills mb-3"
                      id="pills-tab"
                      role="tablist"
                    >
                      <li class="nav-item" role="presentation">
                        <button
                          class="nav-link active"
                          id="pills-home-tab"
                          data-bs-toggle="pill"
                          data-bs-target="#pills-home"
                          type="button"
                          role="tab"
                          aria-controls="pills-home"
                          aria-selected="true"
                        >
                          Todays Work
                        </button>
                      </li>
                      <li class="nav-item" role="presentation">
                        <button
                          class="nav-link"
                          id="pills-profile-tab"
                          data-bs-toggle="pill"
                          data-bs-target="#pills-profile"
                          type="button"
                          role="tab"
                          aria-controls="pills-profile"
                          aria-selected="false"
                        >
                          Due Work
                        </button>
                      </li>
                      <li class="nav-item" role="presentation">
                        <button
                          class="nav-link"
                          id="pills-contact-tab"
                          data-bs-toggle="pill"
                          data-bs-target="#pills-contact"
                          type="button"
                          role="tab"
                          aria-controls="pills-contact"
                          aria-selected="false"
                        >
                          Next
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div
                className="tab-pane fade"
                id="pills-assignedwork-home"
                role="tabpanel"
                aria-labelledby="pills-assignedwork-tab"
              >
                <div className="my-5">
                  <div className="d-flex justify-content-start gap-4 mx-3 mt-4">
                    <ul
                      class="nav nav-pills mb-3"
                      id="pills-tab"
                      role="tablist"
                    >
                      <li class="nav-item" role="presentation">
                        <button
                          class="nav-link active"
                          id="pills-home-tab"
                          data-bs-toggle="pill"
                          data-bs-target="#pills-home"
                          type="button"
                          role="tab"
                          aria-controls="pills-home"
                          aria-selected="true"
                        >
                          All New Projects
                        </button>
                      </li>
                      {/* <li class="nav-item" role="presentation">
    <button class="nav-link" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">Due Work</button>
  </li>
  <li class="nav-item" role="presentation">
    <button class="nav-link" id="pills-contact-tab" data-bs-toggle="pill" data-bs-target="#pills-contact" type="button" role="tab" aria-controls="pills-contact" aria-selected="false">Next</button>
  </li> */}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="fixed-bottom d-flex justify-content-end mx-5">
              <Space className="text-center d-flex  my-4 gap-4">
                <Button
                  onClick={handleSubmit}
                  className="buttonFilled"
                  type="primary"
                >
                  Submit
                </Button>
                <Button className="buttonLine" type="button" onClick={onClose}>
                  Cancel
                </Button>
              </Space>
            </div>
          </Form>
        </div>
      </Drawer>
    </div>
  );
};

export default UserProfileDrawer;
