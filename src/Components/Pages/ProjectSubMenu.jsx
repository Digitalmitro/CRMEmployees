import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Modal, Button, Input, Form, Row, Col, Select, message } from "antd";
import axios from "axios";
import { NavLink, useParams } from "react-router-dom";

const ProjectList = () => {
  // const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("admin"));

  const userToken = localStorage.getItem('userToken')
  const [modalOpened, setModalOpened] = useState(false);
  const [taskAssignees, setTaskAssignees] = useState([]);
  const [showAssignees, setShowAssignees] = useState(false);
  const [selectedAssigneeId, setSelectedAssigneeId] = useState(null);
  const [meMode, setMeMode] = useState(false);
  const [taskNames, setTaskNames] = useState([]);
  const [selectedTaskName, setSelectedTaskName] = useState("");
  const [docss, setdocss] = useState([]);
  const [docsDatas, setDocsDatas] = useState("");

  const [projectsData, setprojectsData] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [userdata, setUserData] = useState([]);
  const [projectName, setProjectsName] = useState("");
  const [projectListId, setProjectListId] = useState("");
  const [taskListId, setTaskListId] = useState("");
  const [selectedTask, setSelectedTask] = useState([]);
  const [filterProjectsData, setfilterProjectsData] = useState([]);

  const [newSubList, setNewSubList] = useState({
    TaskName: "",
    AsigneeName: "",
    AsigneeId: "",
    DeadLine: "",
    comments: "",
    priority: "",
    docsName: "",
    Status: "",
  });

  console.log("assignees", taskAssignees);


  useEffect(() => {
    getProjectsData()
  }, []);  

  useEffect(() => {
    getUsersData();
    getAllAssigneeData();
  }, [projectsData]);



  const showModals = () => {
    setModalOpened(true);
  };
  const handleOk = () => {
    setModalOpened(false);
  };
  const handleCancel = () => {
    setModalOpened(false);
  };

  const handleAddSubList = (projectsId, tasksId) => {
    setProjectListId(projectsId);
    setTaskListId(tasksId);
    setModalIsOpen(true);
  };
  const handleSaveSubList = async () => {
    // console.log("newSubList", newSubList);
    // console.log("projectsname", projectName);
    try {
      const newTaskData = {};
      newSubList.TaskName && (newTaskData.taskname = newSubList.TaskName);
      newSubList.AsigneeName &&
        (newTaskData.assigneeName = newSubList.AsigneeName);
      newSubList.AsigneeId && (newTaskData.assigneeId = newSubList.AsigneeId);
      newSubList.DeadLine && (newTaskData.deadline = newSubList.DeadLine);
      newSubList.comments && (newTaskData.comments = newSubList.comments);
      newSubList.priority && (newTaskData.priority = newSubList.priority);
      // console.log("newTaskData", newTaskData);

      projectName &&
        (await axios.put(
          `${import.meta.env.VITE_BACKEND_API}/projects/${projectListId}`,
          { projectName: projectName }
        ));
      // Check if newTaskData is not empty
      if (Object.keys(newTaskData).length > 0) {
        // Post the new task data to the backend
        await axios.put(
          `${import.meta.env.VITE_BACKEND_API}/tasks/${taskListId}`,
          newTaskData
        );
      }
      setModalIsOpen(false);
      getEmployeeTaskData();
      setNewSubList({
        TaskName: "",
        AsigneeName: "",
        AsigneeId: "",
        DeadLine: "",
        comments: "",
        priority: "",
        docsName: "",
        Status: "",
      });
    } catch (error) {
      console.error("Error saving task data:", error);
    }
  };
  const handleDelete = async (projectId, taskItem, taskId) => {
    // console.log(projectId, taskId, taskItem);
    console.log(
      `${
        import.meta.env.VITE_BACKEND_API
      }/projects/${projectId}/tasks/${taskId}`
    );
    if (window.confirm("Do you want to Delete this Task")) {
      try {
        const response = await axios.delete(
          `${
            import.meta.env.VITE_BACKEND_API
          }/projects/${projectId}/tasks/${taskId}`
        );
        console.log("Action confirmed!");
        message.success("task Deleted Successfully");
        getProjectsData();
      } catch (err) {
        console.log("catch error ", err);
      }
    } else {
      console.log("Action canceled.");
    }
  };


  const getProjectsData = async () => {
    console.log("user._id");
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_API}/projects`
      );
      setprojectsData(response.data);
      setfilterProjectsData(response.data)
    } catch (err) {
      console.log("catch error ", err);
    }
  };
 

  const handleSelectChange = (selectedUser) => {
    console.log("Selected user:", selectedUser);
    setNewSubList((prev) => ({
      ...prev,
      AsigneeName: selectedUser.name,
      AsigneeId: selectedUser.id,
    }));
  };
  const handleSelectPriority = (value) => {
    console.log("hello");
    setNewSubList((prev) => ({ ...prev, priority: value }));
    console.log("newSubList", newSubList);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSubList({ ...newSubList, [name]: value });
  };
  const getAllTaskname = async (selectedTaskName) => {
    try {
      const ProjectKaname = projectsData.map((item) => item.projectName);
      const taskName = projectsData.flatMap((project) =>
        project.tasks.map((task) => task.taskname)
      );
      console.log("taskss", taskName);
      setTaskNames(ProjectKaname);
      setProjectsName(ProjectKaname);

      // Update state with the new task data
      // setData(newData);
      // setSelectedTask(filteredTasks);
    } catch (error) {
      console.error("Error fetching project data:", error);
    }
  };

  console.log("taskNames", projectsData);
  const handleTaskNameChange = (event) => {
    console.log('event', event.target.value)
    setSelectedTaskName(event.target.value);
    const StoredProject = projectsData

    const filterData = event.target.value !== "" ? StoredProject.filter((project) => project.projectName === event.target.value ): true

    filterData.length>=0 && setfilterProjectsData(filterData)
  };

  const handleFilterClick = () => {
    getAllTaskname(selectedTaskName);
  };

  const clearFilter = () => {
   setfilterProjectsData(projectsData)
   setShowAssignees(!showAssignees);

  };

  const getUsersData = async () => {
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_API}/alluser`, {
      headers: { token: userToken },
    });

    setUserData(res.data);
  };

  const getAllAssigneeData = async () => {
    try {
     
      const StoredData = projectsData
      // Extract assignee names and IDs
      const assigneeData = StoredData.flatMap((project) =>
        project.tasks.map((task) => ({
          assigneeName: task.assigneeName,
          assigneeId: task.assigneeId,
        }))
      );

      const uniqueAssignees = new Map();
      assigneeData.forEach(({ assigneeId, assigneeName }) => {
        if (!uniqueAssignees.has(assigneeId)) {
          uniqueAssignees.set(assigneeId, assigneeName);
        }
      });
      // Extract unique assignee names from the Map
      const uniqueAssigneeNames = Array.from(uniqueAssignees.values());
      // Update state with the unique assignee names
      setTaskAssignees(uniqueAssigneeNames);
    } catch (error) {
      console.log(error);
    }
  };

  // docs post
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
  const handleToggles = () => {
    setShowAssignees(!showAssignees);
  };


  const resetFilter = () => {
    window.location.reload();
  };

  const showAssigneeTask = (assigneeName) => {
    const StoredData = projectsData
    const filteredProjects = StoredData.filter(project => 
      project.tasks.some(task => task.assigneeName === assigneeName)
    );
  
    // Extract the tasks that match the assigneeName from the filtered projects
    const assigneeTasks = filteredProjects.flatMap(project => 
      project.tasks.filter(task => task.assigneeName === assigneeName)
    );
  
    console.log("Filtered Projects with matching AssigneeName", filteredProjects);
    console.log("Tasks assigned to the given AssigneeName", assigneeTasks);


    if (assigneeTasks) {
      setSelectedAssigneeId(assigneeTasks.assigneeId);
    }
    setfilterProjectsData(filteredProjects);
    setShowAssignees(!showAssignees);

  };


  return (
    <>
      <div className="projects-list-heading ">
        <ul>
          <li>
            {/* <button onClick={toggleSearchVisibility}> */}

            <button onClick={handleFilterClick} style={{ width: "190px" }}>
              <span style={{ paddingRight: "5px" }}>
                <svg
                  width="15px"
                  height="20px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3 7C3 6.44772 3.44772 6 4 6H20C20.5523 6 21 6.44772 21 7C21 7.55228 20.5523 8 20 8H4C3.44772 8 3 7.55228 3 7ZM6 12C6 11.4477 6.44772 11 7 11H17C17.5523 11 18 11.4477 18 12C18 12.5523 17.5523 13 17 13H7C6.44772 13 6 12.5523 6 12ZM9 17C9 16.4477 9.44772 16 10 16H14C14.5523 16 15 16.4477 15 17C15 17.5523 14.5523 18 14 18H10C9.44772 18 9 17.5523 9 17Z"
                    fill="#616161"
                  ></path>
                </svg>
              </span>
              <select
                className="filter-selected"
                onChange={handleTaskNameChange}
                value={selectedTaskName}
              >
                <option value="">Select Projects Name</option>
                {taskNames.map((name, index) => (
                  <option
                    className="options"
                    style={{ border: "2px solid red" }}
                    key={index}
                    value={name}
                  >
                    {name}
                  </option>
                ))}
              </select>
            </button>
          </li>

          <li style={{ position: "relative" }}>
            <button id="emp-assignee" onClick={handleToggles}>
              <span style={{ paddingRight: "5px" }}>
                <svg
                  width="12px"
                  height="19px"
                  fill="#616161"
                  viewBox="0 0 32 32"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>user-profiles</title>
                  <path d="M0 26.016q0 2.496 1.76 4.224t4.256 1.76h12q2.464 0 4.224-1.76t1.76-4.224q-0.448-2.688-2.112-4.928t-4.096-3.552q2.208-2.368 2.208-5.536v-4q0-3.296-2.336-5.632t-5.664-2.368-5.664 2.368-2.336 5.632v4q0 3.168 2.208 5.536-2.4 1.344-4.064 3.552t-2.144 4.928zM4 26.016q0.672-2.592 2.944-4.288t5.056-1.696 5.056 1.696 2.944 4.288q0 0.832-0.576 1.44t-1.408 0.576h-12q-0.832 0-1.44-0.576t-0.576-1.44zM8 12.032v-4q0-1.664 1.184-2.848t2.816-1.152 2.816 1.152 1.184 2.848v4q0 1.664-1.184 2.816t-2.816 1.184-2.816-1.184-1.184-2.816zM18.208 0.224q0.896-0.224 1.792-0.224 3.328 0 5.664 2.368t2.336 5.632v4.032q0 3.168-2.208 5.504 2.4 1.344 4.096 3.584t2.112 4.896q0 2.496-1.76 4.256t-4.224 1.76h-2.784q1.888-1.632 2.496-4h0.288q0.8 0 1.408-0.576t0.576-1.44q-0.384-1.472-1.312-2.688t-2.336-2.048q-1.44-2.528-3.712-4.256 0.352-0.608 0.608-1.216 1.216-0.416 1.984-1.44t0.768-2.368v-4q0-1.312-0.768-2.336t-1.984-1.44q-0.96-2.336-3.040-4z"></path>
                </svg>
              </span>
              Assignees
            </button>
            {showAssignees ? (
              <ul className="list-group list-group-flush dropdown my-2">
                <button
                  style={{
                    background: "#5f55ed",
                    width: "160px",
                    color: "#fff",
                  }}
                  onClick={clearFilter}
                  className="mx-auto"
                >
                  Clear Filter
                </button>

                {taskAssignees.map((name, index) => (
                  <li
                    key={index}
                    className="list-group-item"
                    onClick={() => showAssigneeTask(name)}
                  >
                    {name}
                  </li>
                ))}
              </ul>
            ) : (
              ""
            )}
          </li>

          <li>
            <button style={{ width: "120px" }} onClick={resetFilter}>
              <span style={{ marginRight: "8px" }}>
                <svg
                  width="12px"
                  height="12px"
                  fill="#616161"
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
                    <path
                      d="M960 0v213.333c411.627 0 746.667 334.934 746.667 746.667S1371.627 1706.667 960 1706.667 213.333 1371.733 213.333 960c0-197.013 78.4-382.507 213.334-520.747v254.08H640V106.667H53.333V320h191.04C88.64 494.08 0 720.96 0 960c0 529.28 430.613 960 960 960s960-430.72 960-960S1489.387 0 960 0"
                      fill-rule="evenodd"
                    ></path>{" "}
                  </g>
                </svg>
              </span>
              Reset Filter
            </button>
          </li>
          <li>
            <NavLink to={`/doccuments`}>
              <button style={{ width: "80px" }}>
                <span style={{ marginRight: "6px" }}>
                  <svg
                    width="12px"
                    height="12px"
                    fill="#616161"
                    viewBox="0 0 56 56"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <path d="M 15.5547 53.125 L 40.4453 53.125 C 45.2969 53.125 47.7109 50.6640 47.7109 45.7890 L 47.7109 24.5078 C 47.7109 21.4844 47.3828 20.1718 45.5078 18.2500 L 32.5703 5.1015 C 30.7891 3.2734 29.3359 2.8750 26.6875 2.8750 L 15.5547 2.8750 C 10.7266 2.8750 8.2891 5.3594 8.2891 10.2344 L 8.2891 45.7890 C 8.2891 50.6875 10.7266 53.125 15.5547 53.125 Z M 15.7422 49.3515 C 13.3281 49.3515 12.0625 48.0625 12.0625 45.7187 L 12.0625 10.3047 C 12.0625 7.9844 13.3281 6.6484 15.7656 6.6484 L 26.1718 6.6484 L 26.1718 20.2656 C 26.1718 23.2187 27.6718 24.6718 30.5781 24.6718 L 43.9375 24.6718 L 43.9375 45.7187 C 43.9375 48.0625 42.6953 49.3515 40.2578 49.3515 Z M 31.0000 21.1328 C 30.0859 21.1328 29.7109 20.7578 29.7109 19.8203 L 29.7109 7.3750 L 43.2109 21.1328 Z"></path>
                    </g>
                  </svg>
                </span>
                Doc
              </button>
            </NavLink>
          </li>
        </ul>

       
      </div>

      {filterProjectsData?.map((items) => {
        return (
          <>
            <div className="task-list-container">
              <p style={{ fontSize: "1.1rem" }}>{items?.projectName}</p>
              <table
                class="table table-bordered"
                style={{ border: "1px solid #eee8e8" }}
              >
                <thead>
                  <tr>
                    <th scope="col" style={{ width: "30%" }}>
                      Task Name
                    </th>
                    <th scope="col">DeadLine</th>
                    <th scope="col">Assignee Name</th>
                    <th scope="col">priority</th>
                    <th scope="col">status</th>
                    <th scope="col">comments</th>
                    <th scope="col">Edit</th>
                    <th scope="col">Delete</th>
                  </tr>
                </thead>
                {items?.tasks.map((taskItem) => {
                  return (
                    <>
                      <tbody className="text-start tbody ">
                        <tr>
                          <td className="text-start">
                            {" "}
                            <strong>{taskItem.taskname}</strong>
                          </td>
                          <td className="text-start">
                            <span className="mx-2">
                              <svg
                                width="15px"
                                height="15px"
                                fill="#616161"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                                stroke="#000000"
                                stroke-width="0.0002"
                              >
                                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                <g
                                  id="SVGRepo_tracerCarrier"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                ></g>
                                <g id="SVGRepo_iconCarrier">
                                  <path d="M15 2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4c0-1.1.9-2 2-2h2V0h2v2h6V0h2v2zM3 6v12h14V6H3zm6 5V9h2v2h2v2h-2v2H9v-2H7v-2h2z"></path>
                                </g>
                              </svg>
                            </span>
                            {taskItem.deadline}
                          </td>
                          <td className="text-start">
                            <span className="mx-2">
                              <svg
                                width="16px"
                                height="16px"
                                viewBox="-2.5 0 32 32"
                                version="1.1"
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
                                  <g id="icomoon-ignore"> </g>{" "}
                                  <path
                                    d="M18.723 21.788c-1.15-0.48-3.884-1.423-5.565-1.919-0.143-0.045-0.166-0.052-0.166-0.649 0-0.493 0.203-0.989 0.401-1.409 0.214-0.456 0.468-1.224 0.559-1.912 0.255-0.296 0.602-0.88 0.826-1.993 0.196-0.981 0.104-1.338-0.026-1.673-0.013-0.035-0.028-0.070-0.038-0.105-0.049-0.23 0.018-1.425 0.186-2.352 0.116-0.636-0.030-1.989-0.906-3.108-0.553-0.707-1.611-1.576-3.544-1.696l-1.060 0.001c-1.9 0.12-2.96 0.988-3.513 1.695-0.876 1.119-1.021 2.472-0.906 3.108 0.169 0.928 0.236 2.123 0.187 2.348-0.010 0.039-0.025 0.074-0.039 0.11-0.129 0.335-0.221 0.692-0.025 1.673 0.222 1.113 0.57 1.697 0.826 1.993 0.090 0.688 0.344 1.456 0.559 1.912 0.157 0.334 0.23 0.788 0.23 1.431 0 0.597-0.023 0.604-0.157 0.646-1.738 0.513-4.505 1.513-5.537 1.965-0.818 0.351-1.017 0.98-1.017 1.548s0 2.251 0 2.623c0 0.371 0.22 1.006 1.017 1.006 0.613 0 5.518 0 7.746 0 0.668 0 1.098 0 1.098 0h0.192c0 0 0.437 0 1.115 0 2.237 0 7.135 0 7.747 0 0.796 0 1.017-0.634 1.017-1.006s0-2.055 0-2.623-0.392-1.262-1.209-1.613zM18.876 25.98h-17.827v-2.579c0-0.318 0.092-0.46 0.388-0.587 0.994-0.435 3.741-1.426 5.434-1.926 0.889-0.282 0.889-1.070 0.889-1.646 0-0.801-0.106-1.397-0.331-1.878-0.172-0.366-0.392-1.022-0.468-1.601l-0.041-0.312-0.206-0.238c-0.113-0.13-0.396-0.538-0.59-1.513-0.153-0.759-0.085-0.935-0.031-1.076 0.031-0.076 0.058-0.152 0.081-0.237l0.005-0.022 0.005-0.022c0.105-0.495-0.037-1.962-0.181-2.755-0.067-0.365 0.017-1.401 0.7-2.273 0.418-0.534 1.229-1.19 2.722-1.293l0.992-0.001c1.219 0.083 2.145 0.518 2.752 1.294 0.682 0.872 0.766 1.909 0.7 2.275-0.148 0.814-0.287 2.257-0.18 2.758l0.008 0.039 0.011 0.038c0.016 0.054 0.036 0.108 0.056 0.161l0.009 0.026 0.001 0.002c0.059 0.153 0.127 0.326-0.024 1.087-0.196 0.974-0.479 1.384-0.592 1.515l-0.204 0.237-0.042 0.31c-0.076 0.578-0.296 1.237-0.468 1.603-0.247 0.525-0.5 1.157-0.5 1.856 0 0.577 0 1.367 0.918 1.655 1.641 0.485 4.345 1.416 5.448 1.877 0.418 0.179 0.574 0.493 0.574 0.649l-0.006 2.579z"
                                    fill="#000000"
                                  >
                                    {" "}
                                  </path>{" "}
                                  <path
                                    d="M23.078 14.441v-4.185h-1.049v4.185h-4.186v1.049h4.186v4.185h1.049v-4.185h4.185v-1.049z"
                                    fill="#000000"
                                  >
                                    {" "}
                                  </path>{" "}
                                </g>
                              </svg>
                            </span>
                            {taskItem.assigneeName}
                          </td>
                          <td className="text-start">
                            <span className="mx-2">
                              <svg
                                width="15px"
                                height="15px"
                                fill="#616161"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                                stroke="#000000"
                                stroke-width="0.0002"
                              >
                                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                <g
                                  id="SVGRepo_tracerCarrier"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                ></g>
                                <g id="SVGRepo_iconCarrier">
                                  <path d="M15 2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4c0-1.1.9-2 2-2h2V0h2v2h6V0h2v2zM3 6v12h14V6H3zm6 5V9h2v2h2v2h-2v2H9v-2H7v-2h2z"></path>
                                </g>
                              </svg>
                            </span>
                            {taskItem.priority}
                          </td>
                          <td className="text-start">
                            <span className="mx-2">
                              <svg
                                width="15px"
                                height="15px"
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
                                    d="M5 22V14M5 14V4M5 14L7.47067 13.5059C9.1212 13.1758 10.8321 13.3328 12.3949 13.958C14.0885 14.6354 15.9524 14.7619 17.722 14.3195L17.8221 14.2945C18.4082 14.148 18.6861 13.4769 18.3753 12.9589L16.8147 10.3578C16.4732 9.78863 16.3024 9.50405 16.2619 9.19451C16.2451 9.06539 16.2451 8.93461 16.2619 8.80549C16.3024 8.49595 16.4732 8.21137 16.8147 7.64221L18.0932 5.51132C18.4278 4.9536 17.9211 4.26972 17.2901 4.42746C15.8013 4.79967 14.2331 4.69323 12.8082 4.12329L12.3949 3.95797C10.8321 3.33284 9.1212 3.17576 7.47067 3.50587L5 4M5 4V2"
                                    stroke="#1C274C"
                                    stroke-width="1.5"
                                    stroke-linecap="round"
                                  ></path>{" "}
                                </g>
                              </svg>
                            </span>
                            {taskItem.status}
                          </td>

                          <td className="text-start">
                            <span className="mx-2"></span>
                            {taskItem.comments}
                          </td>
                          <td className="text-start">
                            <span
                              onClick={() =>
                                handleAddSubList(items._id, taskItem._id)
                              }
                            >
                              <svg
                                viewBox="0 -0.5 25 25"
                                width="27px"
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
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M17.265 4.16231L19.21 5.74531C19.3978 5.9283 19.5031 6.17982 19.5015 6.44201C19.5 6.70421 19.3919 6.9545 19.202 7.13531L17.724 8.93531L12.694 15.0723C12.6069 15.1749 12.4897 15.2473 12.359 15.2793L9.75102 15.8793C9.40496 15.8936 9.10654 15.6384 9.06702 15.2943L9.18902 12.7213C9.19806 12.5899 9.25006 12.4652 9.33702 12.3663L14.15 6.50131L15.845 4.43331C16.1743 3.98505 16.7938 3.86684 17.265 4.16231Z"
                                    stroke="#000000"
                                    stroke-width="1.5"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  ></path>{" "}
                                  <path
                                    d="M5.5 18.2413C5.08579 18.2413 4.75 18.5771 4.75 18.9913C4.75 19.4056 5.08579 19.7413 5.5 19.7413V18.2413ZM19.2 19.7413C19.6142 19.7413 19.95 19.4056 19.95 18.9913C19.95 18.5771 19.6142 18.2413 19.2 18.2413V19.7413ZM14.8455 6.22062C14.6904 5.83652 14.2534 5.65082 13.8693 5.80586C13.4852 5.9609 13.2995 6.39796 13.4545 6.78206L14.8455 6.22062ZM17.8893 9.66991C18.2933 9.57863 18.5468 9.17711 18.4556 8.77308C18.3643 8.36904 17.9628 8.1155 17.5587 8.20678L17.8893 9.66991ZM5.5 19.7413H19.2V18.2413H5.5V19.7413ZM13.4545 6.78206C13.6872 7.35843 14.165 8.18012 14.8765 8.8128C15.6011 9.45718 16.633 9.95371 17.8893 9.66991L17.5587 8.20678C16.916 8.35198 16.3609 8.12551 15.8733 7.69189C15.3725 7.24656 15.0128 6.63526 14.8455 6.22062L13.4545 6.78206Z"
                                    fill="#000000"
                                  ></path>{" "}
                                </g>
                              </svg>
                            </span>
                          </td>
                          <td className="text-start">
                            <span>
                              <button
                                onClick={() =>
                                  handleDelete(
                                    items._id,
                                    taskItem,
                                    taskItem._id
                                  )
                                }
                                style={{
                                  background: "none",
                                  border: "none",
                                  padding: 0,
                                  cursor: "pointer",
                                }}
                              >
                                <svg
                                  viewBox="0 0 1024 1024"
                                  class="icon"
                                  width="25px"
                                  version="1.1"
                                  xmlns="http://www.w3.org/2000/svg"
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
                                    <path
                                      d="M667.8 362.1H304V830c0 28.2 23 51 51.3 51h312.4c28.4 0 51.4-22.8 51.4-51V362.2h-51.3z"
                                      fill="#CCCCCC"
                                    ></path>
                                    <path
                                      d="M750.3 295.2c0-8.9-7.6-16.1-17-16.1H289.9c-9.4 0-17 7.2-17 16.1v50.9c0 8.9 7.6 16.1 17 16.1h443.4c9.4 0 17-7.2 17-16.1v-50.9z"
                                      fill="#CCCCCC"
                                    ></path>
                                    <path
                                      d="M733.3 258.3H626.6V196c0-11.5-9.3-20.8-20.8-20.8H419.1c-11.5 0-20.8 9.3-20.8 20.8v62.3H289.9c-20.8 0-37.7 16.5-37.7 36.8V346c0 18.1 13.5 33.1 31.1 36.2V830c0 39.6 32.3 71.8 72.1 71.8h312.4c39.8 0 72.1-32.2 72.1-71.8V382.2c17.7-3.1 31.1-18.1 31.1-36.2v-50.9c0.1-20.2-16.9-36.8-37.7-36.8z m-293.5-41.5h145.3v41.5H439.8v-41.5z m-146.2 83.1H729.5v41.5H293.6v-41.5z m404.8 530.2c0 16.7-13.7 30.3-30.6 30.3H355.4c-16.9 0-30.6-13.6-30.6-30.3V382.9h373.6v447.2z"
                                      fill="#211F1E"
                                    ></path>
                                    <path
                                      d="M511.6 798.9c11.5 0 20.8-9.3 20.8-20.8V466.8c0-11.5-9.3-20.8-20.8-20.8s-20.8 9.3-20.8 20.8v311.4c0 11.4 9.3 20.7 20.8 20.7zM407.8 798.9c11.5 0 20.8-9.3 20.8-20.8V466.8c0-11.5-9.3-20.8-20.8-20.8s-20.8 9.3-20.8 20.8v311.4c0.1 11.4 9.4 20.7 20.8 20.7zM615.4 799.6c11.5 0 20.8-9.3 20.8-20.8V467.4c0-11.5-9.3-20.8-20.8-20.8s-20.8 9.3-20.8 20.8v311.4c0 11.5 9.3 20.8 20.8 20.8z"
                                      fill="#211F1E"
                                    ></path>
                                  </g>
                                </svg>
                              </button>
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </>
                  );
                })}
                <Modal
                  title="Edit tasks"
                  visible={modalIsOpen}
                  onOk={handleSaveSubList}
                  onCancel={() => setModalIsOpen(false)}
                  style={{ height: "200px" }}
                >
                  <Form layout="vertical">
                    <Row gutter={16}>
                      <Col span={10}>
                        <Form.Item>
                          <Input
                            name="Projects Name"
                            value={projectName}
                            onChange={(e) => setProjectsName(e.target.value)}
                            placeholder="Projects Name"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={10}>
                        <Form.Item>
                          <Input
                            name="TaskName"
                            value={newSubList.TaskName}
                            onChange={handleChange}
                            placeholder="Task Name"
                          />
                        </Form.Item>
                      </Col>{" "}
                      <Col span={22}>
                        <Form.Item>
                          <Select
                            placeholder="Select Assignee"
                            onChange={(value) => {
                              const selectedUser = userdata.find(
                                (user) => user._id === value
                              );
                              handleSelectChange({
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
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={22}>
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
                      <Col span={22}>
                        <Form.Item>
                          <Input.TextArea
                            name="comments"
                            type="date"
                            value={newSubList.comments}
                            onChange={handleChange}
                            placeholder="Comments"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={22}>
                        <Form.Item>
                          <Select
                            placeholder="priority"
                            value={newSubList.AsigneeName}
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
                </Modal>
              </table>

           
            </div>
           
          </>
        );
      })}
    </>
  )
};

export default ProjectList;
