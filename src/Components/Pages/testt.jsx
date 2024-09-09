import React, { useEffect, useState } from 'react';
import { Modal, Button, Input, Form, Row, Col, Select } from "antd";
import axios from "axios";

// Import your SVG icons
import PdfIcon from '../../assets/icons/pdf-icons.svg';
import JpgIcon from '../../assets/icons/jpg-icon.svg';
import DocxIcon from '../../assets/icons/docx-icon.svg';
import XlsxIcon from '../../assets/icons/xlsx-icon.svg';
import GifIcon from '../../assets/icons/gif-icon.svg';
import JpegIcon from '../../assets/icons/jpeg-icon.svg';
import { useNavigate, useParams } from 'react-router-dom';

const Doccs = () => {
  const adminToken = localStorage.getItem('token')
  const [modalOpened, setModalOpened] = useState(false);
  const [docss, setdocss] = useState([]);
  const [documents,setDocuments]=useState([])
  const [projectsData, setProjectsData] = useState([])
  const [docsDatas, setDocsDatas] = useState("");
  const [uploadedDocs, setUploadedDocs] = useState();

  // set data for project
  const [userdata, setUserData] = useState([]);

  console.log("all document",documents)
  const getUsersData = async () => {
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_API}/alluser`, {
      headers: { token: adminToken },
    });

    setUserData(res.data);
  };

const navigate = useNavigate(); // Initialize useNavigate
const { id } = useParams();

  const [newSubList, setNewSubList] = useState({
    TaskName: "",
    AsigneeName: "",
    AsigneeId: "",
    DeadLine: "",
    priority: "",
    Status: "Pending",
  });

  // Map file extensions to SVG icons
  const extensionToIconMap = {
    '.pdf': PdfIcon,
    '.jpg': JpgIcon,
    '.jpeg': JpegIcon,
    '.docs': DocxIcon,
    '.xlsx': XlsxIcon,
    '.gif': GifIcon,
  };

  const getFileExtension = (filename) => {
    return filename.slice(filename.lastIndexOf('.'));
  };

  const showModals = () => {
    setModalOpened(true);
  };
  const handleOk = () => {
    setModalOpened(false);
  };
  const handleCancel = () => {
    setModalOpened(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSubList({ ...newSubList, [name]: value });
  };

  const handleSelectPriority = (value) => {
    console.log("hello");
    setNewSubList((prev) => ({ ...prev, priority: value }));
    console.log("newSubList", newSubList);
  };


  const handleBack = () => {
    navigate(`/projects/${id}`); // Navigate back to ProjectList with the correct projectId
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    docsDatas.trim() !== "" && formData.append("docsName", docsDatas);
    if (docss) {
      formData.append("docs", docss);
    }
    console.log("docs", docsDatas, docss);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/docs`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("response", response); // Log the response from the server
      // message.success("docs uploaded successfully");
      
    } catch (err) {
      console.log(err);
    }
  };

  const getAllDocs= async()=>{
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_API}/docs`,

      );
      setDocuments(response.data)
      
    } catch (error) {
      
    }
  }

  const getProjectsData = async() => {
    try{
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/projects`);
       console.log("respo", response)
       setProjectsData(response.data)
    }catch(err){
        console.log(err)
    }
  }

  useEffect(()=>{
    getProjectsData()
    getUsersData()
    getAllDocs()
  },[])


  return (
    <div className="doccs-container my-5">
     
      <div className="total-docs my-2">
      <div className=" total-no">
         <span style={{paddingRight:"15px"}} onClick={handleBack}><svg width="30px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 12H20M4 12L8 8M4 12L8 16" stroke="#616161" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg></span>

        <p style={{ fontSize: "0.9rem", color: "#616161",paddingTop:"3px" }}>{documents.length} Documents</p>
      </div>
      <div className="addtask mb-2">
        <button onClick={showModals}>Add Task</button>
      </div>
      </div>
     

      <table className="table table-bordered filter-doccument">
        <thead>
          <tr>
            <th scope="col">Document Name</th>
            <th scope="col">Assignee Name</th>
            <th scope="col">Task Name</th>
          </tr>
        </thead>
        <tbody>
          {/* {documents?.map((doc, index) => {
            const fileExtension = getFileExtension(doc);
            const IconComponent = extensionToIconMap[fileExtension];

            return (
              <tr key={index}>
                <td>
                  <span>
                    {IconComponent && <img src={IconComponent} alt={fileExtension} width="18" height="18" />}
                  </span>
                  <span style={{ marginLeft: "8px" }}>{doc}</span>
                </td>
                <td>Assignee {index + 1}</td>
                <td>Task {index + 1}</td>
              </tr>
            );
          })} */}
          {documents?.map((doc, index) => {
    // Ensure `doc` is a string (i.e., the filename) before proceeding
    const fileExtension = getFileExtension(doc.filename || doc.name || '');

    // Check if a valid icon exists for the file extension
    const IconComponent = extensionToIconMap[fileExtension];

    return (
        <tr key={index}>
            <td>
                <span>
                    {IconComponent && (
                        <img
                            src={IconComponent}
                            alt={fileExtension}
                            width="18"
                            height="18"
                        />
                    )}
                </span>
                <span style={{ marginLeft: "8px" }}>{doc.filename || doc.name || 'Unknown Document'}</span>
            </td>
            <td>Assignee {index + 1}</td>
            <td>Task {index + 1}</td>
        </tr>
    );
})}

        </tbody>
      </table>

      <Modal
      title=""
      open={modalOpened}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <div className="added-task">
        <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
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
              Task
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
              Doc
            </button>
          </li>
        </ul>

        <div className="tab-content " id="pills-tabContent">
          <div
            className="tab-pane fade show active task-name"
            id="pills-home"
            role="tabpanel"
            aria-labelledby="pills-home-tab"
            tabindex="0"
          >
            <Select style={{width:"70%",marginBottom:"25px"}}
                  placeholder="Enter Project Name"
                  onChange={(value) => {
                    const selectedUser = projectsData.find(
                      (user) => user._id === value
                    );
                    handleProject({
                      name: selectedUser.name,
                      id: selectedUser._id,
                    });
                  }}
                  virtual={false}
                  dropdownStyle={{
                    overflowY: "auto",
                    scrollBehavior: "smooth",
                  }}
                >
                  {projectsData.map((item) => (
                    <Option key={item._id} value={item.projectName}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
            <div className="d-flex gap-3">
             

            <Select
                  placeholder="Enter Assignee Name"
                  onChange={(value) => {
                    const selectedUser = userdata.find(
                      (user) => user._id === value
                    );
                    handleAssignee({
                      name: selectedUser.name,
                      id: selectedUser._id,
                    });
                  }}
                  virtual={false}
                  dropdownStyle={{
                    overflowY: "auto",
                    scrollBehavior: "smooth",
                  }}
                >
                  {userdata.map((item) => (
                    <Option key={item._id} value={item._id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              <select
                className="form-select tasks"
                style={{ width: "140px", fontSize: "0.9rem" }}
                aria-label="Default select example"
              >
                <option selected> Task</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
              </select>
            </div>
            <input
              type="text"
              placeholder="Task name ot type  '/' for commands"
            />

            <p
              style={{
                fontSize: "0.9rem",
                marginTop: "1.5rem",
                color: "#222",
                letterSpacing: "0.6px",
              }}
            >
              {" "}
              <span>
                <svg
                  height="16px"
                  width="16px"
                  fill="#000000"
                  viewBox="0 0 32 32"
                  data-name="Layer 1"
                  id="Layer_1"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <rect height="1" width="7" x="13" y="2"></rect>
                    <rect height="1" width="10" x="10" y="27"></rect>
                    <rect
                      height="1"
                      transform="translate(-10 23) rotate(-90)"
                      width="15"
                      x="-1"
                      y="16"
                    ></rect>
                    <rect
                      height="1"
                      transform="translate(8.5 38.5) rotate(-90)"
                      width="18"
                      x="14.5"
                      y="14.5"
                    ></rect>
                    <rect height="1" width="7" x="6" y="8"></rect>
                    <rect
                      height="1"
                      transform="translate(-1.05 8.18) rotate(-45)"
                      width="8.49"
                      x="5.11"
                      y="4.85"
                    ></rect>
                    <rect
                      height="1"
                      transform="translate(7 18) rotate(-90)"
                      width="7"
                      x="9"
                      y="5"
                    ></rect>
                    <rect height="1" width="10" x="12" y="29"></rect>
                    <rect
                      height="1"
                      transform="translate(8.5 42.5) rotate(-90)"
                      width="18"
                      x="16.5"
                      y="16.5"
                    ></rect>
                    <path d="M22,30V29h2a1,1,0,0,0,1-1V26h1v2a2,2,0,0,1-2,2Z"></path>
                    <path d="M20,28V27h2a1,1,0,0,0,1-1V24h1v2a2,2,0,0,1-2,2Z"></path>
                    <path d="M10,28V27H8a1,1,0,0,1-1-1V24H6v2a2,2,0,0,0,2,2Z"></path>
                    <path d="M20,2V3h2a1,1,0,0,1,1,1V6h1V4a2,2,0,0,0-2-2Z"></path>
                    <path d="M23,4V5h1a1,1,0,0,1,1,1V8h1V6a2,2,0,0,0-2-2Z"></path>
                    <path d="M12,30V29H10a1,1,0,0,1-1-1V27H8v1a2,2,0,0,0,2,2Z"></path>
                  </g>
                </svg>
              </span>{" "}
              Add Description
            </p>

            <input
              type="text"
              placeholder="...."
              style={{ marginTop: "3px" }}
            />
            <Form layout="vertical">
              <Row gutter={16}>
                <Col span={11}>
                  <Form.Item>
                    <Input
                      name="DeadLine"
                      type="date"
                      value={newSubList.DeadLine}
                      onChange={handleChange}
                      placeholder="DeadLine"
                    />
                  </Form.Item>
                </Col>
                <Col span={11}>
                  <Form.Item>
                    <Select
                      style={{ marginTop: "14px" }}
                      placeholder="priority"
                      //   value={newSubList.AsigneeName}
                      onChange={handleSelectPriority}
                      virtual={false}
                      dropdownStyle={{
                        overflowY: "auto",
                        scrollBehavior: "smooth",
                      }}
                    >
                      <Option value="Urgent" style={{ color: "red" }}>
                        Urgent
                      </Option>
                      <Option value="High" style={{ color: "blue" }}>
                        High
                      </Option>
                      <Option value="normal" style={{ color: "#FFD700" }}>
                        normal
                      </Option>
                      <Option value="low" style={{ color: "green" }}>
                        low
                      </Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
          
          <div
              className="tab-pane fade"
              id="pills-profile"
              role="tabpanel"
              aria-labelledby="pills-profile-tab"
              tabIndex="0"
            >
              <Form.Item>
                <Input
                  type="text"
                  onChange={(e) => setDocsDatas(e.target.value)}
                  placeholder="Add Doc Name"
                />
              </Form.Item>
              <Form.Item>
                <Input
                  type="file"
                  onChange={(e) => setdocss(e.target.files[0])}
                  className="form-control"
                  accept=".jpeg, .jpg, .png, .doc, .pdf"
                />
              </Form.Item>
              <Button onClick={handleSubmit}>Upload</Button>
            </div>


          <div>
            <br />
            {/* <h6>All Uploaded Docs </h6> */}
            {uploadedDocs?.map((item) => (
              <div key={item._id}>
                {console.log("item.docs", item.docs)}
                <a
                  href={`${import.meta.env.VITE_BACKEND_API}/${item.docs}`}  >  {item.docsName}
                  </a>

                  {/* <iframe src={`${import.meta.env.VITE_BACKEND_API}/${item.docs}`} width="100%" height="auto">
                  <p>Your browser does not support iframes.</p>
                   </iframe> */}
              </div>
            ))}

          </div>
        </div>
      </div>
    </Modal>
    </div>
  );
}

export default Doccs;





































// Attendance code 


import React, { useState, useEffect } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import img2 from "../../assets/Vector.png";
import im3 from "../../assets/Vector3.png";
import userIcon from "../../assets/usericon.png";
import img4 from "../../assets/Vector4.png";
import img5 from "../../assets/Vector5.png";
import img6 from "../../assets/Vector6.png";
import img7 from "../../assets/helpicon.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Modal,
  Button,
  Form,
  Input,
  Row,
  Col,
  DatePicker,
  message,
} from "antd";

const EmployeeAttendance = () => {
  const userToken = localStorage.getItem("userToken");
  const Profile = localStorage.getItem("user");
  const NewProfile = JSON.parse(Profile);
  const name = NewProfile?.name;
  const email = NewProfile?.email;
  const user_id = NewProfile?._id;

  const [hidden, setHidden] = useState(false);
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAttendanceOpen, setIsAttendance] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [date, setDate] = useState("");
  const [Punchmessage, setPunchMessage] = useState("");
  const [concernData, setConcernData] = useState([]);
  const [callApi, setCallApi] = useState(false);
  const [halfDayToday, setHalfDayToday] = useState(false);

  const [punchStatus, setPunchStatus] = useState("");
  const [punchDate, setPunchDate] = useState("");
  //model
  const [msgDate, setMsgDate] = useState("");
  const [leaveConcern, setleaveConcern] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  //
  const showLeaveModal = () => {
    setIsModalVisible(true);
  };

  const handleLeaveCancel = () => {
    setIsModalVisible(false);
  };



  async function getData() {
    try{
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_API}/attendance/${user_id}`
      );
      setAttendanceData(res.data?.attendance);
    }catch(err){
      console.log(err)
    }
    }

  const handleLeaveSubmit = async (values) => {
    try {
      const { leaveConcern, date } = values;

      const formattedDate = moment(date.$d).format("MMMM Do YYYY");
      console.log("date", formattedDate)

      // const user_id =user_id;
      const payload = {
        name: name,
        email: email,
        message:leaveConcern,
        date: formattedDate,
        status: "pending",
        punchType:"Leave Application",
        user_id,
      };
      // Send POST request to the server
      await axios.post(`${import.meta.env.VITE_BACKEND_API}/concern`, payload,{
        headers:{token: userToken}
      });
      setCallApi(!callApi)
      message.success("Concern Created and associated with Admin");
      form.resetFields();
      setIsModalVisible(false);
    } catch (error) {
      message.error("Failed to create concern");
      console.error(error);
    }
  };

  const groupedDatas = Object.values(
    attendanceData?.reduce((acc, curr) => {
      // Group entries by currentDate
      const currentDate = curr.currentDate;
      // console.log("Current:", curr);
      if (!acc[currentDate]) {
        acc[currentDate] = {
          currentDate,
          userName: "",
          userEmail: "",
          punchin: "",
          punchOut: "",
          time: "",
          status: "",
          ip: "",
        };
      }

      // Merge punchin, punchOut, status, and ip
      if (curr.userName) {
        acc[currentDate].userName = curr.userName;
      }
      if (curr.userEmail) {
        acc[currentDate].userEmail = curr.userEmail;
      }
      if (curr.punchin) {
        acc[currentDate].punchin = curr.punchin;
      }
      if (curr.punchOut) {
        acc[currentDate].punchOut = curr.punchOut;
      }
      if (curr.time) {
        acc[currentDate].time = curr.time;
      }
      if (curr.status) {
        acc[currentDate].status = curr.status;
      }
      if (curr.ip) {
        acc[currentDate].ip = curr.ip;
      }

      return acc;
    }, {})
  );
  // Add missing weekend days between the data
  const weekendEntriess = [];
  const weekdayEntriess = [];

  // Iterate over groupedData to add missing entries
  groupedDatas.forEach((entry, index) => {
    if (index > 0) {
      const currentDate = moment(entry.currentDate, "MMM Do YY");
      const prevDate = moment(groupedDatas[index - 1].currentDate, "MMM Do YY");
      const diffDays = currentDate.diff(prevDate, "days");
      for (let i = 1; i < diffDays; i++) {
        const missingDate = prevDate.clone().add(i, "days");
        if (missingDate.day() === 6 || missingDate.day() === 0) {
          // If the missing date is Saturday or Sunday, add an entry with "Week Off" status
          weekendEntriess.push({
            userName: entry.userName,
            userEmail: entry.userEmail,
            currentDate: missingDate.format("MMM Do YY"),
            punchin: "",
            punchOut: "",
            time: "",
            status: "Week Off",
            ip: "",
          });
        } else {
          // If the missing date is a weekday, add an entry with "Absent" status
          weekdayEntriess.push({
            userName: "",
            userEmail: "",
            currentDate: missingDate.format("MMM Do YY"),
            punchin: "",
            punchOut: "",
            time: "",
            status: "Absent",
            ip: "",
          });
        }
      }
    }
  });

  // Merge the original data with the added weekend and weekday entries
  const finalDatas = [...groupedDatas, ...weekendEntriess, ...weekdayEntriess];

  // Sort the data by currentDate
  finalDatas.sort(
    (a, b) =>
      moment(a.currentDate, "MMM Do YY").valueOf() -
      moment(b.currentDate, "MMM Do YY").valueOf()
  );

  console.log(finalDatas);

  // Filter the data based on the selected month and date
  const filteredDatas = finalDatas.filter((entry) => {
    // Check if the entry's currentDate includes the selected month
    if (!entry.currentDate.includes(selectedMonth)) {
      return false;
    }

    // Check if the entry's currentDate matches the selected date
    const formattedDate = moment(date).format("MMM Do YY");
    // console.log(formattedDate);
    if (date && entry.currentDate === formattedDate) {
      return true;
    }

    // If no date is selected, return true to include all entries for the selected month
    return !date;
  });
  console.log(filteredDatas);

  useEffect(() => {
    getData();
  }, [selectedMonth]);

  const totalLate = filteredDatas?.filter((e) => e.status === "LATE").length;
  const totalAbs = filteredDatas?.filter((e) => e.status === "Absent").length;
  // Calculate half day count

  const halfDayCount = filteredDatas?.filter((entry) => {
    if (entry.status === "Week Off" || entry.status === "Absent") {
      return false;
    }

    const punchInTime = moment(entry.punchin, "h:mm:ss A");
    const punchOutTime = moment(entry.punchOut, "h:mm:ss A");
console.log("count", entry.punchin, entry.punchOut)
    const duration = moment.duration(punchOutTime.diff(punchInTime)).asHours();
    console.log("duraction", duration)
    return duration < 7 && duration > 0;
  }).length;

  const getAttData = async () => {
    try{
      const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_API}/attendance/${user_id}`
    );
    
    setData(res.data.attendance);
    }catch(err){
      console.log(err)
    }
  };
  const getConcernData = async() => {
    try{
      const ConcernRes = await axios.get(`${import.meta.env.VITE_BACKEND_API}/concern/${user_id}`, {
        headers:{token: userToken}
      });
  setConcernData(ConcernRes.data.reverse())
    }catch(err){
      console.log(err)
    }
  }
console.log("concernData", concernData)
  const handleChange = (date, dateString) => {
    console.log(date, dateString);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };
  const showAttendance = () => {
    setIsAttendance(true);
  };
  const handleOk = async () => {
    setIsModalOpen(false);

    const payload = {
      name,
      email,
      message:Punchmessage,
      date: punchDate,
      punchType: punchStatus,
      status: "Pending",
      user_id,
    };
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/concern`,
        payload, {
          headers:{
            token:userToken
          }
        }
      );
      toast.info(res.data, {});
      getConcernData()
    } catch (error) {}
  };
  const handledOk = async () => {
    setIsAttendance(false);
   
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleCancels = () => {
    setIsAttendance(false);
  };

  const [isOpen, setIsOpen] = useState(true);
  const toggle = () => setIsOpen(!isOpen);

  // location tracker
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [locationPermission, setLocationPermission] = useState(false);
  const [iframe, setIframe] = useState(false);

  const [percent, setPercent] = useState(29);

  const status = percent === 100 ? "success" : percent <= 29 ? "red" : "active";
  const color = percent === 100 ? "#52c41a" : percent <= 29 ? "red" : "#ffc107";

  const [hide, setHide] = useState(false);

  const [punchin, setPunchin] = useState("");
  const [punchOut, setPunchOut] = useState("");

  const [timeDifferenceMinutes, setTimeDifferenceMinutes] = useState(0); // State to hold the working time in minutes

  const [checkoutClicked, setCheckoutClicked] = useState(false);

  const [loading, setLoading] = useState(false);
  function handleLoading() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 750);
  }
 
useEffect(()=> {
getData()
},[])  
  const handlePunchIn = async () => {
    const currentTime = new Date().toLocaleTimeString();
    setPunchin(currentTime); 
    setHide(!hide);
    setIframe(true);
    const currentDate = moment().format("MMM Do YY");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/attendance`,
        {
          userName: name,
          userEmail: email,
          punchin: currentTime,
          currentDate,
          ip: userIP,
          user_id,
        }
      );
      // console.log(response.data);
      setHidden(true);
      handleLoading();
    } catch (error) {
      console.error("Error sending checkin data:", error);
    }
    getAttData(); // Refresh attendance data after check-in
  };

  const handlePunchOut = async () => {
    const currentTime = new Date().toLocaleTimeString();
    setPunchOut(currentTime);
    setHide(!hide);
    const currentDate = moment().format("MMM Do YY");
    const status = isLate ? "LATE" : "In Time";
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/attendance`,
        {
          userName: name,
          userEmail: email,
          punchOut: currentTime,
          currentDate,
          status,
          ip: userIP,
          user_id,
        }
      );
      // console.log(response.data);
    } catch (error) {
      console.error("Error sending checkout data:", error);
    }
    getAttData(); 
    setCheckoutClicked(true); 
  };

  const currentDate = moment().format("MMM Do YY");

  const [userIP, setUserIP] = useState(null);
  const getIp = async () => {
    // Fetch user's IP address
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    setUserIP(data.ip);
  };

 



  // Add missing weekend days between the data
  const weekendEntries = [];
  const weekdayEntries = [];


  const groupedData = Object.values(
    attendanceData.reduce((acc, curr) => {
      // Group entries by currentDate
      const currentDate = curr.currentDate;
      // console.log("Current:", curr);
      if (!acc[currentDate]) {
        acc[currentDate] = {
          currentDate,
          userName: "",
          userEmail: "",
          punchin: "",
          punchOut: "",
          time: "",
          status: "",
          ip: "",
        };
      }

      // Merge punchin, punchOut, status, and ip
      if (curr.userName) {
        acc[currentDate].userName = curr.userName;
      }
      if (curr.userEmail) {
        acc[currentDate].userEmail = curr.userEmail;
      }
      if (curr.punchin) {
        acc[currentDate].punchin = curr.punchin;
      }
      if (curr.punchOut) {
        acc[currentDate].punchOut = curr.punchOut;
      }
      if (curr.time) {
        acc[currentDate].time = curr.time;
      }
      if (curr.status) {
        acc[currentDate].status = curr.status;
      }
      if (curr.ip) {
        acc[currentDate].ip = curr.ip;
      }

      return acc;
    }, {})
  );

  
  console.log(groupedData);
  // Iterate over groupedData to add missing entries
  groupedData.forEach((entry, index) => {
    if (index > 0) {
      const currentDate = moment(entry.currentDate, "MMM Do YY");
      const prevDate = moment(groupedData[index - 1].currentDate, "MMM Do YY");
      const diffDays = currentDate.diff(prevDate, "days");
      for (let i = 1; i < diffDays; i++) {
        const missingDate = prevDate.clone().add(i, "days");
        if (missingDate.day() === 6 || missingDate.day() === 0) {
          // If the missing date is Saturday or Sunday, add an entry with "Week Off" status
          weekendEntries.push({
            userName: entry.userName,
            userEmail: entry.userEmail,
            currentDate: missingDate.format("MMM Do YY"),
            punchin: "",
            punchOut: "",
            time: "",
            status: "Week Off",
            ip: "",
          });
        } else {
          // If the missing date is a weekday, add an entry with "Absent" status
          weekdayEntries.push({
            userName: "",
            userEmail: "",
            currentDate: missingDate.format("MMM Do YY"),
            punchin: "",
            punchOut: "",
            time: "",
            status: "Absent",
            ip: "",
          });
        }
      }
    }
  });

  // Merge the original data with the added weekend and weekday entries
  const finalData = [...groupedData, ...weekendEntries, ...weekdayEntries];

  // Sort the data by currentDate
  finalData.sort(
    (a, b) =>
      moment(a.currentDate, "MMM Do YY").valueOf() -
      moment(b.currentDate, "MMM Do YY").valueOf()
  );

  console.log(finalData);

  // Filter the data based on the selected month and date
  const filteredData = finalData.filter((entry) => {
    // Check if the entry's currentDate includes the selected month
    if (!entry.currentDate.includes(selectedMonth)) {
      return false;
    }

    // Check if the entry's currentDate matches the selected date
    const formattedDate = moment(date).format("MMM Do YY");
    // console.log(formattedDate);
    if (date && entry.currentDate === formattedDate) {
      return true;
    }

    // If no date is selected, return true to include all entries for the selected month
    return !date;
  });
  console.log(filteredData);

  // console.log("attdata", data);

  useEffect(() => {
    getData();

    getAttData();
    getIp();
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
            setLocationPermission(true);
          },
          (error) => {
            console.log("Error getting location:", error);
          }
        );
      } else {
        console.log("Geolocation is not supported by this browser.");
      }
    };

    getLocation();
    if (punchin && punchOut) {
      setTimeDifferenceMinutes(calculateTimeDifference(punchin, punchOut));
    }
    if (userToken) {
      // Use the <Navigate /> component to redirect
    } else {
      return navigate("/login");
    }
  }, [
    userToken,
    punchin,
    punchOut,
    currentDate,
    timeDifferenceMinutes,
    userIP,
  ]);

  const calculateTimeDifference = (time1, time2) => {
    const format = "hh:mm:ss A";
    const time1Date = new Date("2000-01-01 " + time1);
    const time2Date = new Date("2000-01-01 " + time2);

    // Get the difference in milliseconds
    let difference = Math.abs(time2Date - time1Date);

    // Convert milliseconds to hours, minutes, seconds
    let hours = Math.floor(difference / 3600000);
    difference -= hours * 3600000;
    let minutes = Math.floor(difference / 60000);
    difference -= minutes * 60000;
    let seconds = Math.floor(difference / 1000);

    return `${hours}:${minutes}:${seconds}`;
  };



  let filteredPunchin = [];

  if (data) {
    filteredPunchin = data.filter(
      (entry) =>
        entry.hasOwnProperty("punchin") &&
        !entry.hasOwnProperty("punchOut") &&
        entry.currentDate === currentDate
    );
  }

  // console.log(
  //   "punchin",
  //   filteredPunchin.length > 0 ? filteredPunchin : "No data available"
  // );
  let filteredPunchOut = [];

  if (data) {
    filteredPunchOut = data
      .filter(
        (entry) =>
          entry.hasOwnProperty("punchOut") &&
          !entry.hasOwnProperty("punchin") &&
          entry.currentDate === currentDate
      )
      .map((entry) => ({ ...entry, currentDate: getCurrentDateFormatted() }));
  }
  // console.log(data);
  // console.log(
  //   "punchout",
  //   filteredPunchOut.length > 0 ? filteredPunchOut : "No data available"
  // );

  let filteredTime = [];

  if (data) {
    filteredTime = data
      .filter((entry) => entry.hasOwnProperty("time"))
      .map((entry) => ({ ...entry, currentDate: getCurrentDateFormatted() }));
  }

  // console.log(
  //   "time",
  //   filteredTime.length > 0 ? filteredTime[0].time : "No data available"
  // );

  // console.log("test");

  const isLate =
    filteredPunchin.length > 0 && isCheckinLate(filteredPunchin[0].punchin);
  let timeDifference = null;

  if (filteredPunchin.length > 0 && filteredPunchOut.length > 0) {
    // Assuming filteredPunchin and filteredPunchOut are arrays containing login and logout times respectively
    timeDifference = calculateTimeDifference(
      filteredPunchin[0].punchin,
      filteredPunchOut[0].punchOut
    );

    // console.log("Time Difference (minutes):", timeDifference);
    const currentDate = moment().format("MMM Do YY");
    try {
      const response = axios.post(
        `${import.meta.env.VITE_BACKEND_API}/attendance`,
        {
          currentDate,
          time: timeDifference,
          user_id,
        }
      );
      // console.log(response.data);
    } catch (error) {
      console.error("Error sending checkout data:", error);
    }
  } else {
    console.log(
      "Cannot calculate time difference: Missing login or logout data"
    );
  }

  const isTodayHalfDay = (punchin, punchOut) => {
    const today = moment().startOf('day'); // Start of today (midnight)
    const punchInTime1 = moment(punchin, "h:mm:ss A");
    const punchOutTime1 = moment(punchOut, "h:mm:ss A");
    console.log("time1 ", punchInTime1, punchOutTime1)
    const duration1 = moment.duration(punchOutTime1.diff(punchInTime1)).asHours();

    // const duration = moment.duration(punchOutTime1.diff(punchInTime1)).asHours();
    console.log("today ", duration1 )

    // Check if both punch-in and punch-out are from today
    if (duration1 < 7 && duration1 > 0 ) {
      // Check if the duration is less than 7 hours
      return true;
    }
  
    return false; // Not a half-day if the punches are not from today
  };
  
  // Usage example
  const punchinDay = filteredPunchin[0]?.punchin;
  const punchOutDay = filteredPunchOut[0]?.punchOut;
  
  // const isHalfDayToday = punchinDay && punchOutDay && isTodayHalfDay(punchinDay, punchOutDay);
  // console.log("ehejhg", punchinDay, punchOutDay)
  // if (isHalfDayToday) {
  //   setHalfDayToday(true)
  //   console.log("half day.");

  // } else {
  //   console.log("full day.");
  // }
  

useEffect(()=>{
  getConcernData()
},[callApi])
  
  return (
    <>
      {/* modal */}
      <Modal
        title="Drop a message"
        centered
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className="container">
          <div className="row">
            <div className="col">
              <div className="col">
                <h6>Date of Issue Occurred</h6>
                <input type="date" value={punchDate} onChange={(e)=>setPunchDate(e.target.value)}/>

                <h6>Punch Status</h6>
                <select
                  value={punchStatus}
                  onChange={(e) => setPunchStatus(e.target.value)}
                  style={{ width: "160px", height: "30px" }}
                >
                  <option value="Punch In">Punch In</option>
                  <option value="Punch Out">Punch Out</option>
                </select>

               
              </div>
            </div>
            <div className="col">
              <h6>write concern</h6>

              <textarea onChange={(e) => setPunchMessage(e.target.value)} />
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        title="Monthly View"
        centered
        open={isAttendanceOpen}
        onOk={handledOk}
        onCancel={handleCancels}
      >
        <div className="container">
          <div className="row">
            <div
              className="col-md-3"
              style={{ display: "flex", justifyContent: "center" }}
            >
           
              <div className="emp-select-months-year">
                <div className="emp-select-month dflex">
                  <select
                    style={{
                      width: "124px",
                      height: "30px",
                      paddingRight: "12px",
                      color: "#222",
                    }}
                    onChange={handleMonthChange}
                  >
                    <option value="">Select Month</option>
                    <option value="Jan">Jan</option>
                    <option value="Feb">Feb</option>
                    <option value="Mar">Mar</option>
                    <option value="Apr">Apr</option>
                    <option value="May">May</option>
                    <option value="Jun">Jun</option>
                    <option value="Jul">July</option>
                    <option value="Aug">Aug</option>
                    <option value="Sep">Sep</option>
                    <option value="Oct">Oct</option>
                    <option value="Nov">Nov</option>
                    <option value="Dec">Dec</option>
                  </select>
                </div>
              </div>
            </div>
            <div
              className="col-md-9 d-flex gap-2"
              style={{ paddingLeft: "1.5rem" }}
            >
              <button
                style={{
                  height: "25px",
                  width: "90px",
                  borderRadius: "10px",
                  background: "#f3f3fb",
                  color: "#72757a",
                  fontSize: "0.8rem",
                  border: "1px solid #dcd2d2",
                  boxShadow: "2px 2px 2px 1px rgba(0, 0, 255, .2)",
                }}
              >
                Late : {totalLate}
              </button>

              <button
                style={{
                  height: "25px",
                  width: "90px",
                  borderRadius: "10px",
                  background: "#f3f3fb",
                  color: "#72757a",
                  fontSize: "0.8rem",
                  border: "1px solid #dcd2d2",
                  boxShadow: "2px 2px 2px 1px rgba(0, 0, 255, .2)",
                }}
              >
                Absent : {totalAbs}
              </button>

              <button
                style={{
                  height: "25px",
                  width: "90px",
                  borderRadius: "10px",
                  background: "#f3f3fb",
                  color: "#72757a",
                  fontSize: "0.8rem",
                  border: "1px solid #dcd2d2",
                  boxShadow: "2px 2px 2px 1px rgba(0, 0, 255, .2)",
                }}
              >
                Half Day : {halfDayCount}
              </button>
            </div>
          </div>
        </div>
      
      </Modal>

      {/* bOOK lEAVE  */}
      <Modal
        title="Book Leave"
        visible={isModalVisible}
        onCancel={handleLeaveCancel}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleLeaveSubmit}
        >
          <Form.Item
            name="leaveConcern"
            label="Reason for leave"
            rules={[{ required: true, message: 'Please enter your Concern Leave' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          
          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: 'Please select a date' }]}
          >
            <DatePicker />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <div className="attendance-container  my-4">
        <div className="emp-profile gap-4">
          <div className="left-emp-profile">
            <div className="profileImg">
              <img src={userIcon} alt="" />
              <div className="emp-profile-title">
                <h6>{name}</h6>
                <p>{email}</p>
              </div>
              <h4>
                <HiOutlineDotsVertical />
              </h4>
            </div>
            <div className="empBtn" onClick={showLeaveModal}>
              <button>+ BOOK LEAVE</button>
            </div>

            <div className="empBtn my-4" style={{background:"green !important"}}>
            <button  onClick={showModal}>Forget to Punch</button>
          </div>
          </div>
          <div className="emp-card mt-2">
            <div className="emp-punch-clock my-2 ">
              <h4>Punch Clock</h4>
              <img src={im3} alt="" />
            </div>
            <small>Click the button below to Punch In</small>
            <hr />

            <div className="emp-punchBtns">
              {filteredPunchin.length > 0 && filteredPunchin[0]?.punchin ? (
                <div className="punch-out-btn" onClick={handlePunchOut}>
                  <img src={img5} style={{ marginRight: "5px" }} alt="" />
                  Punch Out
                </div>
              ) : (
                <div className="punch-in-btn" onClick={handlePunchIn}>
                  <img src={img4} style={{ marginRight: "5px" }} alt="" /> Punch
                  In
                </div>
              )}
            </div>
            <div className="emp-locationBtns">
              <div className="location-id-btn">
                <img src={img6} alt="" />
                {userIP}
              </div>
              <div className="current-location-btn">
                Check my current location
              </div>
            </div>
          
        
          </div>

          <div className="emp-card mt-2 ">
            <div className="emp-punch-in-out-details">
              <h6 className="my-2">
                <span style={{ color: "#0BC81E" }}>Punch in :</span>{" "}
                {loading ? (
                  <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : filteredPunchin.length > 0 ? (
                  filteredPunchin[0].punchin
                ) : (
                  punchin
                )}
              </h6>

              <h6 className="my-2">
                <span style={{ color: "#FF0707" }}>Punch Out :</span>
                {filteredPunchOut.length > 0
                  ? filteredPunchOut[0].punchOut
                  : punchOut}
              </h6>
              <h6 className="my-2">Working Time : {timeDifference} </h6>
              <h6 className="my-2">IP Address : {userIP} </h6>
              <h6 className="my-2">
                Status :{" "}
                <span style={{ color: "#0BC81E" }}>
                  {" "}
                  {filteredPunchOut.length > 0 ? (
                    <span style={{ color: isLate ? "red" : "green" }}>
                      {filteredPunchOut[0].status} {halfDayToday ?? "Half Day"}
                    </span>
                  ) : (
                    <span style={{ color: isLate ? "red" : "green" }}>
                      {hidden ? (isLate ? "LATE" : "In Time") : null}
                    </span>
                  )}{" "}
                </span>
              </h6>
              {/* <h6>Half Day</h6> */}
            </div>
          </div>
        {/* </div> */}
        {/* -------emp--punch--cards----- */}
    
        {/* <div className="emp-cards mb-5"  style={{ marginTop: "10px" }}> */}
        <div
            className="right-emp-calender mb-4 my-2"
          
          >
          <h6 className="my-3">Calender</h6>
            <div className="emp-dates">
              <div>
                <p>Today</p>
                <small>{moment().format("dddd, DD MMMM")}</small>
              </div>
              <div>
                <hr style={{ border: "1px solid #D9D9D9",  }} />
              </div>
              <div>
                <p>Tommorow</p>
                <small>{moment().add(1, "day").format("dddd, DD MMMM")}</small>
              </div>
            </div>
            <div className="calender-title">
           
           <div className="right-calender-title">
             <h6
               style={{
                 color: "#FF560E",
                 cursor: "pointer",
                 padding: "0px 2rem",
               }}
               onClick={showAttendance}
             >
               MONTHLY VIEW
             </h6>
             <a
               href="/attendance-list"
               style={{
                 color: "#222",
               }}
             >
               <h6>FULL CALENDER</h6>
             </a>
           </div>
         </div>
          </div>
          <div className=" concernGrid mb-4 mt-3">
            <div className="emp-leave-balance p-2">
              <h6 style={{color:"coral"}}>Raised Concern</h6>
              <a href="">
                <img src={img7} alt="" />
              </a>
            </div>
            <table class="table">
              <thead>
                <tr>
                  <th scope="col" style={{color:"blue"}}>Concern Type</th>
                  <th scope="col">Date</th>
                  <th scope="col">Approval</th>
                  <th scope="col">Concern details</th>
                  {/* <th scope="col">Balance</th> */}
                </tr>
              </thead>
              <tbody>
               {concernData?.map((concern) => {
                return(
                  <tr>
                  <td  style={{color: concern.punchType === "Punch Out" ? "blue": (concern.punchType === ("Leave Application" || "Leave") ? "red" : "green") }}>{concern.punchType}</td>
                  <td>{concern.date}</td>
                  <td style={{color: concern.status === "Approved" ? "green": (concern.status === "Denied" &&"red")}} >{concern.status}</td>
                  <td>{concern.message}</td>
                </tr>
                )
               })}
               
              </tbody>
            </table>
          
          </div>
        </div>
        <div
          className="empBtn"
          style={{
            display: "flex",
            justifyContent: "flex-start",
            marginLeft: "10px",
          }}
        >
        
        </div>
      </div>
    </>
  );
};

export default EmployeeAttendance;

function getCurrentDateFormatted() {
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();
  return `${year}-${month < 10 ? "0" + month : month}-${
    day < 10 ? "0" + day : day
  }`;
}

function isCheckinLate(checkinTime) {
  // Assuming threshold time is between 10:41:00 AM and 12:00:00 PM
  const startTime = moment("10:40:59 AM", "hh:mm:ss A");
  const endTime = moment("7:59:00 PM", "hh:mm:ss A");
  const checkin = moment(checkinTime, "hh:mm:ss A");
  return checkin.isBetween(startTime, endTime);
}

// Example usage:
const lateCheckin = "08:40:00 PM"; // Assuming the check-in time
console.log("LATE", isCheckinLate(lateCheckin)); // Should return true or false based on the check-in time


















// my function attendenc




async function getTodayAttendance() {
  const currentDate = new Date().toISOString()
  try {
    console.log( `${import.meta.env.VITE_BACKEND_API}/todays-attendence?user_id=${user_id}&currentDate=${currentDate}`)
    console.log(user_id, currentDate)
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_API}/todays-attendence?user_id=${user_id}&currentDate=${currentDate}`
    );
    // console.log("todaysAttendance, setTodaysAttendence" = useState(),res?.data)
    setTodaysAttendence(res?.data)

    filterTodaysData()

    // setAttendanceData(res.data?.attendance);
  } catch (err) {
    console.log(err);
  }
}

const filterTodaysData = async()=> {


const convertToIST = (utcDate) => {
  const date = new Date(utcDate);
  // Convert to IST (UTC+5:30)
  date.setHours(date.getHours() );
  date.setMinutes(date.getMinutes() );
  return date;
};

const formatTime = (date) => {
  return new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  }).format(date);
};

if(todaysAttendance){
  const workingStatus = todaysAttendance?.workStatus
  const status = todaysAttendance?.status
    setAttendanceInfo(prev => ({...prev, workStatus:workingStatus}))
    setAttendanceInfo(prev => ({...prev, status:status}))
       const punchesList = todaysAttendance?.punches
         if(punchesList?.length>0){
          const showPunchIn = punchesList[0]?.punchIn
            const punchInData = convertToIST(showPunchIn)
            const formattedPunchIn = formatTime(punchInData)
            // setfirstPunchIn(formattedPunchIn)
            setAttendanceInfo(prev => ({ ...prev, firstPunchIn: formattedPunchIn }));

            if(punchesList[punchesList.length - 1]?.punchOut){
             
             let showPunchOut = convertToIST(punchesList[punchesList.length - 1]?.punchOut)
              const formatedPunchOut = formatTime(showPunchOut)
            console.log("punch out",formatedPunchOut)

              setAttendanceInfo(prev => ({ ...prev, LastpunchOut: formatedPunchOut }));
              // setIsPunchInDone(true)
            }else{
              setshowFinalPunchOut('')
            }
           
      }
  
  
      const totalWorkingTimeMinutes = todaysAttendance?.totalWorkingTime; // Example value in minutes
  const hours = Math.floor(totalWorkingTimeMinutes / 60); // Calculate hours
  const minutes = Math.round(totalWorkingTimeMinutes % 60);
  const formatedWorkingTime = `${hours <1 ? "00" : ( hours < 10 ? "0"+hours: hours)}h   ${minutes}m`
  setAttendanceInfo(prev => ({...prev , totalWorkingTime:formatedWorkingTime}))

}
else{
  console.log("no data available")
}
}



// concern modal 


<Modal
title="Drop a message"
centered
open={isModalOpen}
onOk={handleOk}
onCancel={handleCancel}
>


{/* <div className="container">
  <div className="row">
    <div className="col">
      <div className="col">
        <span>Date of Issue Occurred</span>
        <input
          type="date"
          value={punchDate}
          onChange={(e) => setPunchDate(e.target.value)}
        />

        <h6>Punch Status</h6>
        <select
          value={punchStatus}
          onChange={(e) => setPunchStatus(e.target.value)}
          style={{ width: "160px", height: "30px" }}
        >
          <option value="Punch In">Punch In</option>
          <option value="Punch Out">Punch Out</option>
        </select>
      </div>
    </div>
    <div className="col">
      <h6>write concern</h6>

      <textarea onChange={(e) => setPunchMessage(e.target.value)} />
    </div>
  </div>
</div> */}
</Modal>






















