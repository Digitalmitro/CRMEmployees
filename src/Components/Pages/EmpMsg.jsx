import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Input, Button, Spin, List, Avatar } from "antd";
import io from "socket.io-client";
import Cookies from "cookies-js";
import moment from "moment";
import { jwtDecode } from "jwt-decode";

const ENDPOINT = import.meta.env.VITE_BACKEND_API; // Update with your server endpoint
let socket;

const EmpMsg = () => {

  const messagesEndRef = useRef(null); 

  const userToken = localStorage.getItem("userToken");
  const user = JSON.parse(localStorage.getItem("user"));
  const decodeToken = userToken && jwtDecode(userToken);
  const userId = decodeToken._id;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [employees, setEmployees] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name,
    email: user?.email,
    message: "",
    senderId: userId,
    date: moment().format("h:mm:ss a"),
    status: "",
    user_id: userId,
  });

  
  // Scroll to the bottom function
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  useEffect(() => {
    scrollToBottom(); // Scroll to bottom on page load or when messages change
  }, [messages]);


  // Establish socket connection only when an employee is selected
  useEffect(() => {
    if (formData.user_id) {
      socket = io(ENDPOINT);
      socket.emit("register", formData.user_id);
      socket.on("connected", () => setSocketConnected(true));
      socket.on("typing", () => setIsTyping(true));
      socket.on("stop typing", () => setIsTyping(false));

      socket.on("chat message", (msg) => {
        // Code to display the message in the chat window
        console.log("Message received:", msg);
        setMessages((prevMessages) => [...prevMessages, msg]); // Assuming you have a state for messages
      });

      return () => {
        socket.disconnect();
        setSocketConnected(false);
      };
    }
  }, [formData.user_id]);

  const curTime = new Date();

  const handleSendMessage = async () => {
    if (input.trim() !== "") {
      const newMessage = {
        name: formData.name,
        email: formData.email,
        senderId: userId,
        receiverId: "66c2e95d90490ca5dfc00764", 
        message: input,
        status:'false',
        role: "user",
        time: curTime,
        userId: formData.user_id,
      };

      try{
        console.log("hereeeee",newMessage)
       const res =  axios
        .post(
          `${import.meta.env.VITE_BACKEND_API}/notifymessage`, {
            senderName:formData.name,
            Date: moment().format("MMMM Do YYYY, h:mm:ss a"),
            status:false,
            message: input,
            senderId: userId,
            receiverId: "66c2e95d90490ca5dfc00764"
          }
          )
          console.log("res", res)
    
       }catch(err){
        console.log(err)
       }

      setMessages([...messages, newMessage]);
   socket.emit("sendMsg", newMessage)
  
      setInput("");
    }
  };

  const getChatData = async (employeeId) => {
    setLoading(true);
    axios
      .get(
        `${import.meta.env.VITE_BACKEND_API}/message-user/${
          employeeId || userId
        }`
      )
      .then((res) => {
        const chatData = res.data.chatData;

        if (chatData.length > 0) {
        
          const filterStatus = res.data.chatData[0].messages.filter((msg)=> msg.status  &&  msg.status === 'false')
          setMessages(res.data.chatData[0].messages);
        } else {
          setMessages([]);
        }
      })
      .finally(() => {
        setLoading(false);
        scrollToBottom();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
      getChatData(formData.user_id);
  }, [formData.user_id]);



  const typingHandler = (e) => {
    setInput(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", userId);
    }
    let lastTypingTime = new Date().getTime();
    const timerLength = 3000;
    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", userId);
        setTyping(false);
      }
    }, timerLength);
  };

  const filteredEmployees =
    employees?.length > 0 && searchQuery
      ? employees.filter((employee) =>
          employee.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : employees;

  return (
    <div className="chat-app" style={styles.chatApp}>
      {/* <div className="sidebar" style={styles.sidebar}>
        <Input
          placeholder="Search employee..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchBar}
        />
        <List
          itemLayout="horizontal"
          dataSource={filteredEmployees}
          renderItem={(employee) => (
            <List.Item
              key={employee._id}
              onClick={() => setSelectedEmployee(employee)}
              style={{
                ...styles.employeeItem,
                backgroundColor:
                  selectedEmployee?._id === employee._id
                    ? "#e0e0e0"
                    : "#ffffff",
              }}
            >
              <List.Item.Meta
                avatar={<Avatar>{employee.name[0]}</Avatar>}
                title={employee.name}
                description={employee.email}
              />
            </List.Item>
          )}
        />
      </div> */}
      <div className="chat-container" style={styles.chatContainer}>
          <>
            <div
              className="messages-container"
              style={styles.messagesContainer}
            >
              {loading ? (
                <Spin tip="Loading..." style={styles.spinner} />
              ) : (
                messages?.map((item, index) => {
                  // console.log(item);
                  return (
                    <>
                    <div
                      key={index}
                      className={
                        item.role === "user" ? "right-msg" : "left-msg"
                      }
                      style={{
                        ...styles.messageBubble,
                        alignSelf:
                          item.role === "user" ? "flex-end" : "flex-start",
                        backgroundColor:
                          item.role === "user" ? "#b3e5fc" : "#c8e6c9",
                      }}
                    >
                      <p style={styles.senderName}>
                        <strong>{item.name}</strong>
                      </p>
                     {/* <div  className="d-flex align-items-end gap-2 justify-content-between"> */}
                     <p style={styles.messageText}>{item.message}</p>
                     <p style={styles.messageTime}>{typeof item.time === "string" ? item.time : moment(item.time).format("DD/MM/YYYY HH:mm")}</p>
                     {/* </div> */} 
                    </div>
                    <div ref={messagesEndRef} /> 

                    </>
                  );
                })
              )}
            </div>
            <div className="input-container" style={styles.inputContainer}>
              <Input
                placeholder="Type your message here..."
                value={input}
                onChange={typingHandler}
                onPressEnter={handleSendMessage}
                style={styles.inputField}
              />
              {isTyping && <p style={styles.typingIndicator}>Typing...</p>}
              <Button
                type="primary"
                onClick={handleSendMessage}
                style={styles.sendButton}
              >
                Send
              </Button>
            </div>
          </> 
          <div ref={messagesEndRef} /> 
      </div>
    </div>
  );
};

const styles = {
  chatApp: {
    display: "flex",
    height: "100vh !important",
    backgroundColor: "#f5f5f5",
  },
  sidebar: {
    width: "300px",
    padding: "20px",
    backgroundColor: "#ffffff",
    borderRight: "1px solid #e0e0e0",
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    overflowY: "auto",
  },
  searchBar: {
    marginBottom: "20px",
    borderRadius: "8px",
  },
  employeeItem: {
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  chatContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    flexGrow: 1,
    padding: "20px",
    backgroundColor: "#f5f5f5",
    height:"80vh",
  },
  messagesContainer: {
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    overflowX:"hidden",
    padding: "10px",
    marginBottom: "20px",
    scrollbarWidth: "thin",
    scrollbarColor: "#888 #f1f1f1",
    maxHeight: "calc(100vh - 150px)", // Adjust height based on the input field
  },
  spinner: {
    alignSelf: "center",
  },
  messageBubble: {
    padding: "10px",
    borderRadius: "8px",
    margin: "5px 0",
    maxWidth: "60%",
  },
  senderName: {
    margin: 0,
    // marginRight:".9rem",

    fontSize: "0.8rem",
    // line
    color: "#424242",
  },
  messageText: {
    margin: "2px 0",
    fontSize: ".9rem",
    color: "#424242",
  },
  messageTime: {
    fontSize: "0.7rem",
    color: "#757575",
    textAlign: "right",
    margin: 0,
    
  },
  inputContainer: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    padding: " 5px 10px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    position: "sticky",
    bottom: 0,
  },
  inputField: {
    flexGrow: 1,
    border: "none",
    outline: "none",
    padding: "10px",
    fontSize: "1rem",
    borderRadius: "8px",
  },
  sendButton: {
    marginLeft: "10px",
  },
  typingIndicator: {
    fontSize: "0.8rem",
    color: "#757575",
    marginLeft: "10px",
  },
};


export default EmpMsg;
