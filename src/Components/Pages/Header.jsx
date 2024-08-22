import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import Button from '@mui/material/Button';
import { IoIosArrowDown } from "react-icons/io";
import UserProfileDrawer from './UserProfileDrawer';
import usericon from '../../assets/usericon.png';
import img1 from '../../assets/Vector3.png';
import { Modal, Input, List } from 'antd';
import moment from 'moment';

const Header = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const [isToggles, setIsToggles] = useState(false);
    const [activeButton, setProfileActiveButton] = useState(0);
    const [profileDrawerOpened, setprofileDrawerOpened] = useState(false);
    const [open, setOpen] = useState(false);

    // -------for sending messages---------
    const [isMsgModalVisible, setIsMsgModalVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const { TextArea } = Input;

    const showMsgModales = () => {
        setIsMsgModalVisible(true);
    };
    const handleClick = (index) => {
        setProfileActiveButton(index);
      };
      const handleToggle = () => {
        setIsToggles(!isToggles);
      };

    const handleMsgOk = () => {
        if (message.trim()) {
            const timestamp = moment().format('MMMM Do YYYY, h:mm:ss a');
            setMessages([...messages, { text: message.trim(), time: timestamp }]);
            setMessage('');
        }
        setIsMsgModalVisible(false);
    };

    const handleMsgCancel = () => {
        setIsMsgModalVisible(false);
    };

    const handleMessageChanged = (e) => {
        setMessage(e.target.value);
    };

    // const handleProfileDrawerToggles = () => {
    //     console.log("Drawer toggled! Current state:", profileDrawerOpened); // Debug log
    //     setprofileDrawerOpened(!profileDrawerOpened);
    // };


    const showDrawer = () => {
        setOpen(true);
      };
      const onClose = () => {
        setOpen(false);
      };
      const handleSubmit = () => {
        onClose();
      };
  

    return (
        <>
            <div className="container-fluid header w-100">
                <div className="row1" style={{ padding: "0px 2rem" }}>
                    <div className="col-md-6">
                        <Link to={"/"}><img src={logo} alt='' width={40} style={{ background: "#fff" }} /></Link>
                    </div>
                    <div className="col-md-6 part3" style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                        <Button onClick={showMsgModales}>
                            <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10 9H17M10 13H17M7 9H7.01M7 13H7.01M21 20L17.6757 18.3378C17.4237 18.2118 17.2977 18.1488 17.1656 18.1044C17.0484 18.065 16.9277 18.0365 16.8052 18.0193C16.6672 18 16.5263 18 16.2446 18H6.2C5.07989 18 4.51984 18 4.09202 17.782C3.71569 17.5903 3.40973 17.2843 3.21799 16.908C3 16.4802 3 15.9201 3 14.8V7.2C3 6.07989 3 5.51984 3.21799 5.09202C3.40973 4.71569 3.71569 4.40973 4.09202 4.21799C4.51984 4 5.0799 4 6.2 4H17.8C18.9201 4 19.4802 4 19.908 4.21799C20.2843 4.40973 20.5903 4.71569 20.782 5.09202C21 5.51984 21 6.0799 21 7.2V20Z" stroke="#4d4c4c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                        </Button>
                        <Button className='rounded-circle1'><img src={img1} width={20} alt="" /></Button>
                        <div className="profileBtn d-flex" style={{ background: "#efe9e9", padding: "7px", width: "60px", borderRadius: "20px" }}>
                            <button className='rounded-circle1' style={{ width: "25px !important", padding: "10px", height: "25px",width:"25px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "#bba399", color: "#fff", border: "none" }} onClick={showDrawer}>
                                
                                {user?.name.charAt(0).toUpperCase()}
                                
                                </button>
                            <span><IoIosArrowDown width={20} onClick={showDrawer}/>
                            </span>
                        </div>
                    </div>
                </div>
              
            </div>
            <UserProfileDrawer open={open} onClose={onClose} onSubmit={handleSubmit} />
            <Modal
                title="Send a Message"
                visible={isMsgModalVisible}
                onOk={handleMsgOk}
                onCancel={handleMsgCancel}
                okText="Send"
            >
                {messages.length !== 0 ? (
                    <List
                        style={{ marginTop: 20}}
                        bordered
                        dataSource={messages}
                        renderItem={item => (
                            <List.Item>
                                <div>
                                    <div>{item.text}</div>
                                    <div style={{ fontSize: '0.8em', color: 'gray' }}>{item.time}</div>
                                </div>
                            </List.Item>
                        )}
                    />
                ) : (
                    ""
                )}

                <div className="send-msg">
                <TextArea
                    style={{ marginTop: "1rem",color:"#222" }}
                    rows={4}
                    value={message}
                    onChange={handleMessageChanged}
                    placeholder="Type your message here..."
                />
                </div>
            </Modal>
        </>
    );
};

export default Header;
