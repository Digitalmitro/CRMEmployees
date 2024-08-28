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

import pngIcon from '../../assets/icons/png-icons.svg';

// import pngIcon from '../../assets/icons/png-icons.svg';

import { useNavigate, useParams } from 'react-router-dom';

const Doccs = () => {
  const [modalOpened, setModalOpened] = useState(false);
  const [docss, setdocss] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [projectsData, setProjectsData] = useState([]);
  const [docsData, setDocsData] = useState({
    assigneeName: "",
    projectName: "",
    docName: "",
  });
  
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [userdata, setUserData] = useState([]);
  const navigate = useNavigate();
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
    '.doc': DocxIcon,
    '.xlsx': XlsxIcon,
    '.gif': GifIcon,
    '.png':pngIcon,
  };

  const getFileExtension = (filename) => {
    return filename.slice(filename.lastIndexOf('.')).toLowerCase();
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
    setNewSubList((prev) => ({ ...prev, priority: value }));
  };

  const handleBack = () => {
    navigate(`/projects/${id}`);
  };

  const handleSubmit = async () => {
    const formData = new FormData();


    docsData.assigneeName.trim() !== "" && formData.append("assigneeName", docsData.assigneeName);
    docsData.projectName.trim() !== "" && formData.append("projectName", docsData.projectName);
    docsData.docName.trim() !== "" && formData.append("docsName", docsData.docName);
    if (docss) {
      formData.append("docs", docss);
    }
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
      
      window.location.reload()
      // Handle successful response
    } catch (err) {
      console.log(err);
    }
  };

  const getAllDocs = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/docs`);
      setDocuments(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getProjectsData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/projects`);
      setProjectsData(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  console.log("all document",documents)
  const getUsersData = async () => {
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_API}/alluser`);

    setUserData(res.data);
  };

  useEffect(() => {
    getProjectsData();
    getUsersData();
    getAllDocs();
  }, []);

  return (
    <div className="doccs-container my-5">
      <div className="total-docs my-2">
        <div className="total-no">
          <span style={{ paddingRight: "15px" }} onClick={handleBack}>
            <svg width="30px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 12H20M4 12L8 8M4 12L8 16" stroke="#616161" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <p style={{ fontSize: "0.9rem", color: "#616161", paddingTop: "3px" }}>{documents.length} Documents</p>
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
          {documents?.map((doc, index) => {
            const fileExtension = getFileExtension(doc.docs || doc.filename || doc.name || '');
            const IconComponent = extensionToIconMap[fileExtension];

            return (
              <tr key={index}>
                <td>
                  <span>
                    {IconComponent && <img src={IconComponent} alt={fileExtension} width="18" height="18" />}
                  </span>
                  <span style={{ marginLeft: "8px" }}><a
                  href={`${import.meta.env.VITE_BACKEND_API}/${doc.docs}`}  > {doc.docsName || 'Unknown Document'}</a></span>
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
                  onChange={(e) => setDocsData(prevState => ({
                    ...prevState,
                    assigneeName: e.target.value,
                  }))}
                  placeholder="Add Assignee Name"
                  value={docsData.assigneeName}
                />
              </Form.Item>
              
              <Form.Item>
                <Input
                  type="text"
                  onChange={(e) => setDocsData(prevState => ({
                    ...prevState,
                    projectName: e.target.value,
                  }))}
                  placeholder="Add project Name"
                  value={docsData.taskName}
                />
              </Form.Item>

              <Form.Item>
                <Input
                  type="text"
                  onChange={(e) => setDocsData(prevState => ({
                    ...prevState,
                    docName: e.target.value,
                  }))}
                  placeholder="Add Doc Name"
                  value={docsData.docName}
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
           

          </div>
        </div>
      </div>
    </Modal>
   
    </div>
  );
};

export default Doccs;
