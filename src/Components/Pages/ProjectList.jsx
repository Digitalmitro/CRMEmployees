import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Modal, Button, Input, Form, Row, Col, Select } from "antd";
import axios from "axios";
import { NavLink, useParams } from "react-router-dom";

const initialData = {
  lists: [
    { id: "list1", title: "Pending", items: [] },
    { id: "list2", title: "In Progress", items: [] },
    { id: "list3", title: "Completed", items: [] },
  ],
};

const ProjectList = () => {
  const { id } = useParams();
  const [data, setData] = useState(initialData);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const adminToken = localStorage.getItem('token')

  const [modalOpened, setModalOpened] = useState(false);

  const [taskList, setTaskList] = useState([]);
  const [currentStatus, setCurrentStatus] = useState("pending");

  const [taskAssignees, setTaskAssignees] = useState([]);

  const [showAssignees, setShowAssignees] = useState(false);

  const [projectsData, setProjectsData] = useState([]);

  const [showFilter,setShowFilter]=useState(false)

  const [EmployeeData, setEmployeeData] = useState([]);
  const [EmployeeTasks, setEmployeeTasks] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const [project,setProject]=useState([])

  const [isMeMode, setIsMeMode] = useState(false);


  const [activeBtn,setActiveBtn]=useState(false)

  const [selectedAssigneeId, setSelectedAssigneeId] = useState(null);

  const [meMode,setMeMode]=useState(false);


  const [taskNames, setTaskNames] = useState([]);
const [selectedTask, setSelectedTask] = useState([]);
const [selectedTaskName, setSelectedTaskName] = useState('');

const [docss, setdocss] = useState([]);

const [docsDatas, setDocsDatas] = useState("");
const [uploadedDocs, setUploadedDocs] = useState();


  // const [isSearchVisible, setIsSearchVisible] = useState(false);
  // const [filteredTasks, setFilteredTasks] = useState([]);

  const [newSubList, setNewSubList] = useState({
    TaskName: "",
    AsigneeName: "",
    AsigneeId: "",
    DeadLine: "",
    priority: "",
    Status: "Pending",
  });
  const [currentListId, setCurrentListId] = useState(null);

  console.log("assignees",taskAssignees)
  console.log("projecyss",project)
  console.log("id",id)






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
  


  const getDocsData = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_API}/docs`);
      console.log("res", res.data);
      setUploadedDocs(res.data)
    } catch (err) {
      console.log(err);
    }
  };



  const handleToggles = () => {
    setShowAssignees(!showAssignees);
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

  const resetFilter=()=>{
    window.location.reload()
  }

 // Function to fetch and categorize tasks, and handle filtering by task name
const getAllTaskname = async (selectedTaskName) => {
  try {
    // Fetch project data
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/projects/${id}`);
    const tasks = response.data.tasks;

    // Extract unique task names
    const uniqueTaskNames = [...new Set(tasks.map(task => task.taskname).filter(Boolean))];
    console.log("uniqueTaskNames", uniqueTaskNames);

    // Update state with the unique task names
    setTaskNames(uniqueTaskNames);

    // Function to categorize tasks into lists
    const categorizeTask = (task) => {
      if (task.status === "Completed") return "list3";
      if (task.status === "In Progress") return "list2";
      return "list1";
    };

    // Create a copy of initialData to avoid mutating the original state
    const newData = { ...initialData };

    // Clear existing items from lists
    newData.lists.forEach(list => list.items = []);

    // Filter tasks by the selected task name if provided
    const filteredTasks = selectedTaskName
      ? tasks.filter(task => task.taskname === selectedTaskName)
      : tasks;

    // Categorize and add tasks to lists
    filteredTasks.forEach(task => {
      const listId = categorizeTask(task);

      const subList = {
        id: task._id,
        content: (
          <div
          key={task._id}
          style={{
            fontSize: "0.8rem",
            fontWeight: "300",
            lineHeight: "10px",
            letterSpacing: "0.7px",
          }}
        >
          <h6 style={{ fontWeight: "300", fontSize: "0.9rem" }}>
            <span style={{ paddingRight: "5px" }}>
              <svg
                width="12px"
                height="12px"
                viewBox="0 0 16 16"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                fill="#000000"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    fill="#87909E"
                    d="M8 4c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4z"
                  ></path>
                  <path
                    fill="#87909E"
                    d="M8 1c3.9 0 7 3.1 7 7s-3.1 7-7 7-7-3.1-7-7 3.1-7 7-7zM8 0c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8v0z"
                  ></path>
                </g>
              </svg>
            </span>
            {task.taskname || "task "}
          </h6>
          <p style={{ paddingTop: "10px" }}>
            <span style={{ paddingRight: "5px" }}>
              <svg
                fill="#000000"
                height="12px"
                width="12px"
                version="1.1"
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 456.368 456.368"
                xmlSpace="preserve"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <g>
                    <g>
                      <g>
                        <path d="M324.194,220.526c-6.172,7.772-13.106,14.947-21.07,21.423c45.459,26.076,76.149,75.1,76.149,131.158 c0,30.29-66.367,54.018-151.09,54.018s-151.09-23.728-151.09-54.018c0-56.058,30.69-105.082,76.149-131.158 c-7.963-6.476-14.897-13.65-21.07-21.423c-50.624,31.969-84.322,88.41-84.322,152.581c0,19.439,10.644,46.53,61.355,65.201 c31.632,11.647,73.886,18.06,118.979,18.06c45.093,0,87.347-6.413,118.979-18.06c50.71-18.671,61.355-45.762,61.355-65.201 C408.516,308.936,374.818,252.495,324.194,220.526z"></path>
                        <path d="M228.182,239.795c56.833,0,100.597-54.936,100.597-119.897C328.779,54.907,284.993,0,228.182,0 c-56.833,0-100.597,54.936-100.597,119.897C127.585,184.888,171.372,239.795,228.182,239.795z M228.182,29.243 c39.344,0,71.354,40.667,71.354,90.654s-32.01,90.654-71.354,90.654s-71.354-40.667-71.354-90.654S188.838,29.243,228.182,29.243 z"></path>
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
            </span>
            {task.assigneeName || "kjl gpt"}
          </p>

          <p>
            <span style={{ paddingRight: "3px" }}>
              <svg
                height="12px"
                width="12px"
                fill="#000000"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    d="M6,22H18a3,3,0,0,0,3-3V7a2,2,0,0,0-2-2H17V3a1,1,0,0,0-2,0V5H9V3A1,1,0,0,0,7,3V5H5A2,2,0,0,0,3,7V19A3,3,0,0,0,6,22ZM5,12.5a.5.5,0,0,1,.5-.5h13a.5.5,0,0,1,.5.5V19a1,1,0,0,1-1,1H6a1,1,0,0,1-1-1Z"
                    fill="#5b5757"
                  ></path>
                </g>
              </svg>
            </span>
            {task.DeadLine || "01-01-24"}
          </p>
          <p
            style={{ color: task.priority === "pending" ? "red" : "green" }}
          >
            <svg
              height="12px"
              width="12px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5 1C4.44772 1 4 1.44772 4 2V22C4 22.5523 4.44772 23 5 23C5.55228 23 6 22.5523 6 22V14H19C19.3603 14 19.6927 13.8062 19.8702 13.4927C20.0477 13.1792 20.0429 12.7944 19.8575 12.4855L17.1662 8L19.8575 3.5145C20.0429 3.20556 20.0477 2.82081 19.8702 2.5073C19.6927 2.19379 19.3603 2 19 2H6V2C6 1.44772 5.55228 1 5 1ZM14.198 6L16.0277 9H6V6H14.198ZM16.0277 11L14.198 14H6V11H16.0277Z"
                  fill="#000000"
                ></path>
              </g>
            </svg>
            {task.priority || "priority"}
          </p>
          <p className="d-flex align-items-start gap-1">
            <span style={{ paddingRight: "5px" }}>
              <svg
                fill="#000000"
                height="12px"
                width="12px"
                version="1.1"
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 456.368 456.368"
                xmlSpace="preserve"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <g>
                    <g>
                      <g>
                        <path d="M324.194,220.526c-6.172,7.772-13.106,14.947-21.07,21.423c45.459,26.076,76.149,75.1,76.149,131.158 c0,30.29-66.367,54.018-151.09,54.018s-151.09-23.728-151.09-54.018c0-56.058,30.69-105.082,76.149-131.158 c-7.963-6.476-14.897-13.65-21.07-21.423c-50.624,31.969-84.322,88.41-84.322,152.581c0,19.439,10.644,46.53,61.355,65.201 c31.632,11.647,73.886,18.06,118.979,18.06c45.093,0,87.347-6.413,118.979-18.06c50.71-18.671,61.355-45.762,61.355-65.201 C408.516,308.936,374.818,252.495,324.194,220.526z"></path>
                        <path d="M228.182,239.795c56.833,0,100.597-54.936,100.597-119.897C328.779,54.907,284.993,0,228.182,0 c-56.833,0-100.597,54.936-100.597,119.897C127.585,184.888,171.372,239.795,228.182,239.795z M228.182,29.243 c39.344,0,71.354,40.667,71.354,90.654s-32.01,90.654-71.354,90.654s-71.354-40.667-71.354-90.654S188.838,29.243,228.182,29.243 z"></path>
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
            </span>
            <textarea
              rows="4"
              readOnly={true}
              // className="p-1"
              cols="25"
              placeholder={task.comments || "Comments"}
              style={{ border: "none" }}
            ></textarea>
          </p>
        </div>
         
        ),
      };

      newData.lists = newData.lists.map(list =>
        list.id === listId
          ? { ...list, items: [...list.items, subList] }
          : list
      );
    });

    // Update state with the new task data
    setData(newData);
    setSelectedTask(filteredTasks);

  } catch (error) {
    console.error("Error fetching project data:", error);
  }
};


  const handleTaskNameChange = (event) => {
    setSelectedTaskName(event.target.value);
  };

  const handleFilterClick = () => {
    getAllTaskname(selectedTaskName);
  };

  const clearFilter = () => {
    setSelectedTaskName('');
    setSelectedTask([]);
    setSelectedAssigneeId(null);
  };



  // const clearFilter = () => {
  //   setSelectedAssigneeId(null); // Reset the filter
  // };

  const showAssigneeTask = (assigneeName) => {
    const assigneeTask = project.tasks.find(
      (task) => task.assigneeName === assigneeName
    );

    if (assigneeTask) {
      setSelectedAssigneeId(assigneeTask.assigneeId);
    }
  };

  const showFlterTaskName = (assigneeName) => {
    const assigneeTask = project.tasks.find(
      (task) => task.assigneeName === assigneeName
    );

    if (assigneeTask) {
      setSelectedAssigneeId(assigneeTask.assigneeId);
    }
  };




  const getAllAssigneeData = async () => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_API}/projects/${id}`
        );

        setProject(response.data);
        console.log("response.data", response.data);

        const assignees = response.data.tasks;

        // Create a Set to track unique assignee IDs
        const uniqueAssigneeIds = new Set();
        const uniqueAssigneeNames = [];

        assignees.forEach((task) => {
            if (!uniqueAssigneeIds.has(task.assigneeId)) {
                uniqueAssigneeIds.add(task.assigneeId);
                uniqueAssigneeNames.push(task.assigneeName);
            }
        });

        console.log("uniqueAssigneeNames", uniqueAssigneeNames);

        // Update state with the unique assignee names
        setTaskAssignees(uniqueAssigneeNames);
    } catch (error) {
        console.log(error);
    }
};






const handleMeModeToggle = async () => {
  try {
    // Toggle the mode here (if needed, e.g., toggle a state value for Me Mode)
    setMeMode((prevMode) => !prevMode);

    // Fetch tasks assigned to the logged-in user
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_API}/tasks/${user._id}`
    );
    const fetchedTasks = response.data;

    // Flatten and filter tasks assigned to the logged-in user
    let tasks = fetchedTasks.reduce((tasks, project) => {
      const userTasks = project.tasks.filter(
        (task) => task.assigneeId === user._id
      );
      return tasks.concat(userTasks);
    }, []);

    // Categorize tasks based on their status
    const categorizeTask = (task) => {
      if (task.status === "Completed") return "list3";
      if (task.status === "In Progress") return "list2";
      return "list1";
    };

    // Initialize a new data structure for the DragDropContext
    const newData = { ...initialData };
    tasks.forEach((task) => {
      const listId = categorizeTask(task);

      const subList = {
        id: task._id,
        content: (
          <div
            key={task._id}
            style={{
              fontSize: "0.8rem",
              fontWeight: "300",
              lineHeight: "10px",
              letterSpacing: "0.7px",
            }}
          >
            <h6 style={{ fontWeight: "300", fontSize: "0.9rem" }}>
              <span style={{ paddingRight: "5px" }}>
                {/* SVG Icon */}
              </span>
              {task.taskname || "Task"}
            </h6>
            <p style={{ paddingTop: "10px" }}>
              <span style={{ paddingRight: "5px" }}>
                {/* SVG Icon */}
              </span>
              {task.assigneeName || "Assignee"}
            </p>
            <p>
              <span style={{ paddingRight: "3px" }}>
                {/* SVG Icon */}
              </span>
              {task.DeadLine || "01-01-24"}
            </p>
            <p style={{ color: task.priority === "pending" ? "red" : "green" }}>
              {/* Priority SVG Icon */}
              {task.priority || "Priority"}
            </p>
            <p className="d-flex align-items-start gap-1">
              <span style={{ paddingRight: "5px" }}>
                {/* SVG Icon */}
              </span>
              <textarea
                rows="4"
                readOnly={true}
                cols="25"
                placeholder={task.comments || "Comments"}
                style={{ border: "none" }}
              ></textarea>
            </p>
          </div>
        ),
      };

      newData.lists = newData.lists.map((list) =>
        list.id === listId
          ? { ...list, items: [...list.items, subList] }
          : list
      );
    });

    // Update the state with the new data
    setData(newData);
    setTaskList(tasks); // Optionally, you can also update a separate task list state
  } catch (error) {
    console.error("Error fetching project data:", error);
  }
};




  const onDragEnd = async (result) => {
    const { destination, source } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const startList = data.lists.find((list) => list.id === source.droppableId);
    const finishList = data.lists.find(
      (list) => list.id === destination.droppableId
    );

    const draggedItem = startList.items[source.index];
    const newStatus = finishList.title; // Status based on destination list's title
    console.log("draggedItem", draggedItem);
    if (startList === finishList) {
      const newItems = Array.from(startList.items);
      newItems.splice(source.index, 1);
      newItems.splice(destination.index, 0, {
        ...draggedItem,
        Status: draggedItem.Status,
      });

      const newList = { ...startList, items: newItems };
      const newData = {
        ...data,
        lists: data.lists.map((list) =>
          list.id === newList.id ? newList : list
        ),
      };

      setData(newData);
      return;
    }

    // Remove item from startList
    const startItems = Array.from(startList.items);
    startItems.splice(source.index, 1);

    // Add item to finishList with updated status
    const finishItems = Array.from(finishList.items);
    finishItems.splice(destination.index, 0, {
      ...draggedItem,
      Status: newStatus,
    });

    const newStartList = { ...startList, items: startItems };
    const newFinishList = { ...finishList, items: finishItems };

    const newData = {
      ...data,
      lists: data.lists.map((list) => {
        if (list.id === newStartList.id) return newStartList;
        if (list.id === newFinishList.id) return newFinishList;
        return list;
      }),
    };

    console.log("newData", newData);

    setData(newData);

    // Update newSubList with the new status
    setNewSubList((prev) => {
      const updatedSubList = { ...prev, Status: newStatus };

      // Call API to update status on server
      if (draggedItem.id) {
        updateTaskStatusOnServer(draggedItem.id, newStatus);
      }

      return updatedSubList;
    });
  };

  const updateTaskStatusOnServer = async (taskId, newStatus) => {
    let payload = {};
    console.log(newStatus, taskId);
    newSubList.TaskName && (payload.taskname = newSubList.TaskName);
    newSubList.AsigneeName && (payload.assigneeName = newSubList.TaskName);
    newSubList.AsigneeName && (payload.assigneeId = newSubList.AsigneeId);
    newSubList.DeadLine && (payload.deadline = newSubList.DeadLine);
    newSubList.priority && (payload.priority = newSubList.priority);
    newStatus && (payload.status = newStatus);

    try {
      console.log("paylaod", payload);
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_API}/tasks/${taskId}`,
        payload
      );

      console.log("Task status updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleStatusChanges = () => {
    setCurrentStatus();
  };
  const handleAddSubList = (listId) => {
    setCurrentListId(listId);
    setModalIsOpen(true);
  };

  const handleSaveSubList = async () => {
    console.log("newSubList", newSubList);
    try {
      // Define the new task data to be posted
      const newTaskData = {
        taskname: newSubList.TaskName,
        assigneeName: newSubList.AsigneeName,
        assigneeId: newSubList.AsigneeId,
        deadline: newSubList.DeadLine,
        priority: newSubList.priority,
        status: newSubList.Status,
      };

      // Post the new task data to the backend
      const response=await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/projects/${id}`,
        newTaskData, {
          headers: { token: adminToken },
        }
      );
     


      // Call getProjectsData to refresh the data
      await getProjectsData();

      // Reset modal and newSubList state
      setModalIsOpen(false);
      setNewSubList({
        TaskName: "",
        AsigneeName: "",
        DeadLine: "",
        priority: "",
        Status: "",
      });
    } catch (error) {
      console.error("Error saving task data:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSubList({ ...newSubList, [name]: value });
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

  // set data for project
  const [userdata, setUserData] = useState([]);
  const getUsersData = async () => {
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_API}/alluser`, {
      headers: { token: adminToken },
    });

    setUserData(res.data);
  };



  const getAllProjectsData = async() => {
    try{
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/projects`);
       console.log("respo", response)
       setProjectsData(response.data)
    }catch(err){
        console.log(err)
    }
  }

  const getProjectsData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_API}/projects/${id}`
      );

      const tasks = response.data.tasks;

      // Define a function to categorize tasks into lists
      const categorizeTask = (task) => {
        if (task.status === "Completed") return "list3";
        if (task.status === "In Progress") return "list2";
        return "list1";
      };

      // Create a copy of initialData to avoid mutating the original state
      const newData = { ...initialData };
      // Iterate over tasks and add them to the appropriate list based on their status
      tasks.forEach((task) => {
        const listId = categorizeTask(task);

        const subList = {
          id: task._id,
          content: (
            <div
              key={task._id}
              style={{
                fontSize: "0.8rem",
                fontWeight: "300",
                lineHeight: "10px",
                letterSpacing: "0.7px",
              }}
            >
              <h6 style={{ fontWeight: "300", fontSize: "0.9rem" }}>
                <span style={{ paddingRight: "5px" }}>
                  <svg
                    width="12px"
                    height="12px"
                    viewBox="0 0 16 16"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#000000"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <path
                        fill="#87909E"
                        d="M8 4c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4z"
                      ></path>
                      <path
                        fill="#87909E"
                        d="M8 1c3.9 0 7 3.1 7 7s-3.1 7-7 7-7-3.1-7-7 3.1-7 7-7zM8 0c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8v0z"
                      ></path>
                    </g>
                  </svg>
                </span>
                {task.taskname || "task "}
              </h6>
              <p style={{ paddingTop: "10px" }}>
                <span style={{ paddingRight: "5px" }}>
                  <svg
                    fill="#000000"
                    height="12px"
                    width="12px"
                    version="1.1"
                    id="Layer_1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 456.368 456.368"
                    xmlSpace="preserve"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <g>
                        <g>
                          <g>
                            <path d="M324.194,220.526c-6.172,7.772-13.106,14.947-21.07,21.423c45.459,26.076,76.149,75.1,76.149,131.158 c0,30.29-66.367,54.018-151.09,54.018s-151.09-23.728-151.09-54.018c0-56.058,30.69-105.082,76.149-131.158 c-7.963-6.476-14.897-13.65-21.07-21.423c-50.624,31.969-84.322,88.41-84.322,152.581c0,19.439,10.644,46.53,61.355,65.201 c31.632,11.647,73.886,18.06,118.979,18.06c45.093,0,87.347-6.413,118.979-18.06c50.71-18.671,61.355-45.762,61.355-65.201 C408.516,308.936,374.818,252.495,324.194,220.526z"></path>
                            <path d="M228.182,239.795c56.833,0,100.597-54.936,100.597-119.897C328.779,54.907,284.993,0,228.182,0 c-56.833,0-100.597,54.936-100.597,119.897C127.585,184.888,171.372,239.795,228.182,239.795z M228.182,29.243 c39.344,0,71.354,40.667,71.354,90.654s-32.01,90.654-71.354,90.654s-71.354-40.667-71.354-90.654S188.838,29.243,228.182,29.243 z"></path>
                          </g>
                        </g>
                      </g>
                    </g>
                  </svg>
                </span>
                {task.assigneeName || "kjl gpt"}
              </p>

              <p>
                <span style={{ paddingRight: "3px" }}>
                  <svg
                    height="12px"
                    width="12px"
                    fill="#000000"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <path
                        d="M6,22H18a3,3,0,0,0,3-3V7a2,2,0,0,0-2-2H17V3a1,1,0,0,0-2,0V5H9V3A1,1,0,0,0,7,3V5H5A2,2,0,0,0,3,7V19A3,3,0,0,0,6,22ZM5,12.5a.5.5,0,0,1,.5-.5h13a.5.5,0,0,1,.5.5V19a1,1,0,0,1-1,1H6a1,1,0,0,1-1-1Z"
                        fill="#5b5757"
                      ></path>
                    </g>
                  </svg>
                </span>
                {task.DeadLine || "01-01-24"}
              </p>
              <p
                style={{ color: task.priority === "pending" ? "red" : "green" }}
              >
                <svg
                  height="12px"
                  width="12px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M5 1C4.44772 1 4 1.44772 4 2V22C4 22.5523 4.44772 23 5 23C5.55228 23 6 22.5523 6 22V14H19C19.3603 14 19.6927 13.8062 19.8702 13.4927C20.0477 13.1792 20.0429 12.7944 19.8575 12.4855L17.1662 8L19.8575 3.5145C20.0429 3.20556 20.0477 2.82081 19.8702 2.5073C19.6927 2.19379 19.3603 2 19 2H6V2C6 1.44772 5.55228 1 5 1ZM14.198 6L16.0277 9H6V6H14.198ZM16.0277 11L14.198 14H6V11H16.0277Z"
                      fill="#000000"
                    ></path>
                  </g>
                </svg>
                {task.priority || "priority"}
              </p>
              <p className="d-flex align-items-start gap-1">
                <span style={{ paddingRight: "5px" }}>
                  <svg
                    fill="#000000"
                    height="12px"
                    width="12px"
                    version="1.1"
                    id="Layer_1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 456.368 456.368"
                    xmlSpace="preserve"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <g>
                        <g>
                          <g>
                            <path d="M324.194,220.526c-6.172,7.772-13.106,14.947-21.07,21.423c45.459,26.076,76.149,75.1,76.149,131.158 c0,30.29-66.367,54.018-151.09,54.018s-151.09-23.728-151.09-54.018c0-56.058,30.69-105.082,76.149-131.158 c-7.963-6.476-14.897-13.65-21.07-21.423c-50.624,31.969-84.322,88.41-84.322,152.581c0,19.439,10.644,46.53,61.355,65.201 c31.632,11.647,73.886,18.06,118.979,18.06c45.093,0,87.347-6.413,118.979-18.06c50.71-18.671,61.355-45.762,61.355-65.201 C408.516,308.936,374.818,252.495,324.194,220.526z"></path>
                            <path d="M228.182,239.795c56.833,0,100.597-54.936,100.597-119.897C328.779,54.907,284.993,0,228.182,0 c-56.833,0-100.597,54.936-100.597,119.897C127.585,184.888,171.372,239.795,228.182,239.795z M228.182,29.243 c39.344,0,71.354,40.667,71.354,90.654s-32.01,90.654-71.354,90.654s-71.354-40.667-71.354-90.654S188.838,29.243,228.182,29.243 z"></path>
                          </g>
                        </g>
                      </g>
                    </g>
                  </svg>
                </span>
                <textarea
                  rows="4"
                  readOnly={true}
                  // className="p-1"
                  cols="25"
                  placeholder={task.comments || "Comments"}
                  style={{ border: "none" }}
                ></textarea>
              </p>
            </div>
          ),
        };
        newData.lists = newData.lists.map((list) =>
          list.id === listId
            ? { ...list, items: [...list.items, subList] }
            : list
        );
      });
      setData(newData);

      // Update state with the new task data
      setTaskList(tasks);
    } catch (error) {
      console.error("Error fetching project data:", error);
    }
  };


  const getProjectsDatas = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_API}/projects/${id}`
      );

      let tasks = response.data.tasks;

      const categorizeTask = (task) => {
        if (task.status === "Completed") return "list3";
        if (task.status === "In Progress") return "list2";
        return "list1";
      };

      if (selectedAssigneeId) {
        tasks = tasks.filter(task => task.assigneeId === selectedAssigneeId);
      }

      const newData = { ...initialData };
      tasks.forEach((task) => {
        const listId = categorizeTask(task);

        const subList = {
          id: task._id,
          content: (
            <div
              key={task._id}
              style={{
                fontSize: "0.8rem",
                fontWeight: "300",
                lineHeight: "10px",
                letterSpacing: "0.7px",
              }}
            >
              <h6 style={{ fontWeight: "300", fontSize: "0.9rem" }}>
                <span style={{ paddingRight: "5px" }}>
                  <svg
                    width="12px"
                    height="12px"
                    viewBox="0 0 16 16"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#000000"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <path
                        fill="#87909E"
                        d="M8 4c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4z"
                      ></path>
                      <path
                        fill="#87909E"
                        d="M8 1c3.9 0 7 3.1 7 7s-3.1 7-7 7-7-3.1-7-7 3.1-7 7-7zM8 0c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8v0z"
                      ></path>
                    </g>
                  </svg>
                </span>
                {task.taskname || "task "}
              </h6>
              <p style={{ paddingTop: "10px" }}>
                <span style={{ paddingRight: "5px" }}>
                  <svg
                    fill="#000000"
                    height="12px"
                    width="12px"
                    version="1.1"
                    id="Layer_1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 456.368 456.368"
                    xmlSpace="preserve"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <g>
                        <g>
                          <g>
                            <path d="M324.194,220.526c-6.172,7.772-13.106,14.947-21.07,21.423c45.459,26.076,76.149,75.1,76.149,131.158 c0,30.29-66.367,54.018-151.09,54.018s-151.09-23.728-151.09-54.018c0-56.058,30.69-105.082,76.149-131.158 c-7.963-6.476-14.897-13.65-21.07-21.423c-50.624,31.969-84.322,88.41-84.322,152.581c0,19.439,10.644,46.53,61.355,65.201 c31.632,11.647,73.886,18.06,118.979,18.06c45.093,0,87.347-6.413,118.979-18.06c50.71-18.671,61.355-45.762,61.355-65.201 C408.516,308.936,374.818,252.495,324.194,220.526z"></path>
                            <path d="M228.182,239.795c56.833,0,100.597-54.936,100.597-119.897C328.779,54.907,284.993,0,228.182,0 c-56.833,0-100.597,54.936-100.597,119.897C127.585,184.888,171.372,239.795,228.182,239.795z M228.182,29.243 c39.344,0,71.354,40.667,71.354,90.654s-32.01,90.654-71.354,90.654s-71.354-40.667-71.354-90.654S188.838,29.243,228.182,29.243 z"></path>
                          </g>
                        </g>
                      </g>
                    </g>
                  </svg>
                </span>
                {task.assigneeName || "kjl gpt"}
              </p>

              <p>
                <span style={{ paddingRight: "3px" }}>
                  <svg
                    height="12px"
                    width="12px"
                    fill="#000000"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <path
                        d="M6,22H18a3,3,0,0,0,3-3V7a2,2,0,0,0-2-2H17V3a1,1,0,0,0-2,0V5H9V3A1,1,0,0,0,7,3V5H5A2,2,0,0,0,3,7V19A3,3,0,0,0,6,22ZM5,12.5a.5.5,0,0,1,.5-.5h13a.5.5,0,0,1,.5.5V19a1,1,0,0,1-1,1H6a1,1,0,0,1-1-1Z"
                        fill="#5b5757"
                      ></path>
                    </g>
                  </svg>
                </span>
                {task.DeadLine || "01-01-24"}
              </p>
              <p
                style={{ color: task.priority === "pending" ? "red" : "green" }}
              >
                <svg
                  height="12px"
                  width="12px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M5 1C4.44772 1 4 1.44772 4 2V22C4 22.5523 4.44772 23 5 23C5.55228 23 6 22.5523 6 22V14H19C19.3603 14 19.6927 13.8062 19.8702 13.4927C20.0477 13.1792 20.0429 12.7944 19.8575 12.4855L17.1662 8L19.8575 3.5145C20.0429 3.20556 20.0477 2.82081 19.8702 2.5073C19.6927 2.19379 19.3603 2 19 2H6V2C6 1.44772 5.55228 1 5 1ZM14.198 6L16.0277 9H6V6H14.198ZM16.0277 11L14.198 14H6V11H16.0277Z"
                      fill="#000000"
                    ></path>
                  </g>
                </svg>
                {task.priority || "priority"}
              </p>
              <p className="d-flex align-items-start gap-1">
                <span style={{ paddingRight: "5px" }}>
                  <svg
                    fill="#000000"
                    height="12px"
                    width="12px"
                    version="1.1"
                    id="Layer_1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 456.368 456.368"
                    xmlSpace="preserve"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <g>
                        <g>
                          <g>
                            <path d="M324.194,220.526c-6.172,7.772-13.106,14.947-21.07,21.423c45.459,26.076,76.149,75.1,76.149,131.158 c0,30.29-66.367,54.018-151.09,54.018s-151.09-23.728-151.09-54.018c0-56.058,30.69-105.082,76.149-131.158 c-7.963-6.476-14.897-13.65-21.07-21.423c-50.624,31.969-84.322,88.41-84.322,152.581c0,19.439,10.644,46.53,61.355,65.201 c31.632,11.647,73.886,18.06,118.979,18.06c45.093,0,87.347-6.413,118.979-18.06c50.71-18.671,61.355-45.762,61.355-65.201 C408.516,308.936,374.818,252.495,324.194,220.526z"></path>
                            <path d="M228.182,239.795c56.833,0,100.597-54.936,100.597-119.897C328.779,54.907,284.993,0,228.182,0 c-56.833,0-100.597,54.936-100.597,119.897C127.585,184.888,171.372,239.795,228.182,239.795z M228.182,29.243 c39.344,0,71.354,40.667,71.354,90.654s-32.01,90.654-71.354,90.654s-71.354-40.667-71.354-90.654S188.838,29.243,228.182,29.243 z"></path>
                          </g>
                        </g>
                      </g>
                    </g>
                  </svg>
                </span>
                <textarea
                  rows="4"
                  readOnly={true}
                  // className="p-1"
                  cols="25"
                  placeholder={task.comments || "Comments"}
                  style={{ border: "none" }}
                ></textarea>
              </p>
            </div>
          ),
        };

        newData.lists = newData.lists.map((list) =>
          list.id === listId
            ? { ...list, items: [...list.items, subList] }
            : list
        );
      });
      setData(newData);

      setTaskList(tasks);
    } catch (error) {
      console.error("Error fetching project data:", error);
    }
  };

  console.log("prjectsdata", data);

  useEffect(() => {
    getUsersData();
    getProjectsData();
    // getEmployeeTaskData();
    getAllAssigneeData()
    getAllProjectsData()
  }, []);
  useEffect(() => {
    getProjectsData();
  }, [id]);

  useEffect(() => {
    getProjectsDatas();
  }, [selectedAssigneeId]);

  useEffect(() => {
    getAllTaskname(selectedTaskName);
  }, [selectedTaskName]);

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="projects-list-heading ">
          <ul>
            <li>
              {/* <button onClick={toggleSearchVisibility}> */}
            


              <button onClick={handleFilterClick} style={{width:"190px"}}>
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
                <select className="filter-selected" onChange={handleTaskNameChange} value={selectedTaskName} >
                  <option value=""  >Select Task Name</option>
                  {taskNames.map((name, index) => (
                    <option className="options" style={{border:"2px solid red"}} key={index} value={name}>
                      {name}
                    </option>
        ))}
      </select>
              </button>

           


              {/* {taskNames.length > 0 && (
    <select onChange={(e) => setSelectedTask(e.target.value)}>
      <option value="">Select Task</option>
      {taskNames.map((taskname, index) => (
        <option key={index} value={taskname}>
          {taskname}
        </option>
      ))}
    </select>
  )} */}

              {/* {showFilter ? (
        <ul className="list-group list-group-flush dropdown my-2">
            <button style={{background:"#5f55ed",width:"160px",color:"#fff"}} onClick={clearFilter} className="mx-auto">Clear Filter</button>
          
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
      )} */}


                              {/* {isSearchVisible && (
                  <input
                    type="text"
                    placeholder="Search by task name..."
                    onChange={handleSearchChange}
                  />
                )} */}
              
            </li>

            
            {/* <li>
              <button>
                <span style={{ paddingRight: "5px" }}>
                  <svg
                    viewBox="0 0 24 24"
                    width="15px"
                    height="20px"
                    fill="#616161"
                    xmlns="http://www.w3.org/2000/svg"
                    stroke="#616161"
                  >
                    <path
                      d="M13 12H21M13 8H21M13 16H21M6 7V17M6 17L3 14M6 17L9 14"
                      stroke="#616161"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                </span>
                Sort
              </button>
            </li> */}
            <li>
              <button onClick={handleMeModeToggle}>
                <span style={{ paddingRight: "5px" }}>
                  <svg
                    width="15px"
                    height="20px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    stroke="#616161"
                  >
                    <path
                      d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                      stroke="#616161"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                    <path
                      d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z"
                      stroke="#616161"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                </span>
                Me mode
              </button>
            </li>
            <li style={{position:"relative"}}>
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
            <button style={{background:"#5f55ed",width:"160px",color:"#fff"}} onClick={clearFilter} className="mx-auto">Clear Filter</button>
          
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
                {/* {showAssignees ? (<ul class="list-group list-group-flush dropdown my-2">
              <li class="list-group-item  ">duwheudhewduhewdu</li>  
              <li class="list-group-item ">duwheudhewduhewdu</li>  

              <li class="list-group-item ">duwheudhewduhewdu</li>  
              <li class="list-group-item ">duwheudhewduhewdu</li>  
              <li class="list-group-item ">duwheudhewduhewdu</li>  
              <li class="list-group-item ">duwheudhewduhewdu</li>  
              <li class="list-group-item ">duwheudhewduhewdu</li>  
              <li class="list-group-item ">duwheudhewduhewdu</li> 
              </ul>):("")} */}
              
              
              

               

            </li>

            <li>
              <button style={{width:"120px"}} onClick={resetFilter}>
                <span style={{marginRight:"8px"}}>
                <svg width="12px" height="12px" fill="#616161" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M960 0v213.333c411.627 0 746.667 334.934 746.667 746.667S1371.627 1706.667 960 1706.667 213.333 1371.733 213.333 960c0-197.013 78.4-382.507 213.334-520.747v254.08H640V106.667H53.333V320h191.04C88.64 494.08 0 720.96 0 960c0 529.28 430.613 960 960 960s960-430.72 960-960S1489.387 0 960 0" fill-rule="evenodd"></path> </g></svg>
                </span>
                Reset Filter
              </button>
            </li>
            <li>
              <NavLink to={`/doccuments/${id}`}>
              <button style={{width:"80px"}}>
                <span style={{marginRight:"6px"}}>
                <svg width="12px" height="12px" fill="#616161" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M 15.5547 53.125 L 40.4453 53.125 C 45.2969 53.125 47.7109 50.6640 47.7109 45.7890 L 47.7109 24.5078 C 47.7109 21.4844 47.3828 20.1718 45.5078 18.2500 L 32.5703 5.1015 C 30.7891 3.2734 29.3359 2.8750 26.6875 2.8750 L 15.5547 2.8750 C 10.7266 2.8750 8.2891 5.3594 8.2891 10.2344 L 8.2891 45.7890 C 8.2891 50.6875 10.7266 53.125 15.5547 53.125 Z M 15.7422 49.3515 C 13.3281 49.3515 12.0625 48.0625 12.0625 45.7187 L 12.0625 10.3047 C 12.0625 7.9844 13.3281 6.6484 15.7656 6.6484 L 26.1718 6.6484 L 26.1718 20.2656 C 26.1718 23.2187 27.6718 24.6718 30.5781 24.6718 L 43.9375 24.6718 L 43.9375 45.7187 C 43.9375 48.0625 42.6953 49.3515 40.2578 49.3515 Z M 31.0000 21.1328 C 30.0859 21.1328 29.7109 20.7578 29.7109 19.8203 L 29.7109 7.3750 L 43.2109 21.1328 Z"></path></g></svg>
                </span>
                Doc
              </button>

              </NavLink>
             
            </li>
          </ul>

    
          <div className="add-task">
            <button onClick={showModals}>Add Task</button>
          </div>
        </div>

        <div className="project-list-container my-4">
          {data.lists.map((list, index) => (
            <Droppable droppableId={list.id} key={list.id} direction="vertical">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`list-${index + 1}`}
                >
                  <div
                    className="list-head"
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <button
                      className={
                        list.id === "list1"
                          ? "btnGray"
                          : list.id === "list2"
                          ? "btnBlue"
                          : "btnGreen"
                      }
                    >
                      <span>
                        <svg width="10px" height="10px" viewBox="0 0 16 16">
                          <g>
                            <path
                              fill={list.id === "list1" ? "#fff" : "#fff"}
                              d="M8 4c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4z"
                            ></path>
                            <path
                              fill={list.id === "list1" ? "#fff" : "#fff"}
                              d="M8 1c3.9 0 7 3.1 7 7s-3.1 7-7 7-7-3.1-7-7 3.1-7 7-7zM8 0c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8v0z"
                            ></path>
                          </g>
                        </svg>
                      </span>
                      {list.title}
                    </button>
                    <button
                      className="addList"
                      onClick={() => handleAddSubList(list.id)}
                    >
                      {/* + */}
                    </button>
                  </div>
                  {list.items.map((item, idx) => (
                    <Draggable key={item.id} draggableId={item.id} index={idx}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="list-1-sublist mx-auto"
                        >
                          {item.content}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
      <Modal
        title="Assign tasks"
        visible={modalIsOpen}
        onOk={handleSaveSubList}
        onCancel={() => setModalIsOpen(false)}
        style={{ height: "200px" }}
      >
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={22}>
              <Form.Item>
                <Input
                  name="TaskName"
                  value={newSubList.TaskName}
                  onChange={handleChange}
                  placeholder="Enter Task Name"
                />
              </Form.Item>
            </Col>
            <Col span={22}>
              <Form.Item>
                <Select
                  placeholder="Enter Assignee Name"
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
                <Select
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
      </Modal>

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
    </>
  );
};

export default ProjectList;
