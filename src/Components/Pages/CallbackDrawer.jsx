// src/components/CustomDrawer.js

import React from 'react';
import { useState, useEffect } from 'react'
import { Drawer, Button, Form, Input, Row, Col, Select, DatePicker, Space, Checkbox } from 'antd';
import { createStyles, useTheme } from 'antd-style';

import { motion } from 'framer-motion'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import DM from '../../assets/logo.png'
import Push from 'push.js'
import Cookies from 'js-cookie'
import moment from 'moment';


const { Option } = Select;


const useStyle = createStyles(() => ({

    'my-drawer-mask': {
        boxShadow: `inset 0 0 15px #fff`,
    },
    // 'my-drawer-header': {
    //     background: token.green1,
    // },

    'my-drawer-content': {
        borderLeft: '2px dotted #333',
    },
}));


const CallbackDrawer = ({open,onClose,refreshData}) => {
    const { styles } = useStyle();
    const navigate = useNavigate()
const userToken = Cookies.get('userToken')
const [isOpen, setIsOpen] = useState(true)
const [name, setName] = useState('')
const [email, setEmail] = useState('')
const [phone, setPhone] = useState('')

const [domainName, setDomain] = useState('')
const [address, setAddress] = useState('')
const [country, setCountry] = useState('USA')

const [comments, setComments] = useState('')
const [buget, setBuget] = useState('')
const [calldate, setCalldate] = useState('')

const Profile = localStorage.getItem('user')
const NewProfile = JSON.parse(Profile)
// console.log("name",NewProfile.name);
const useName = NewProfile?.name
const useEmail = NewProfile?.email
const user_id = NewProfile?._id
console.log('NewProfile', NewProfile)

const toggle = () => setIsOpen(!isOpen)
const handelSubmit = async (e) => {
    e.preventDefault()
    const payload = {
        employeeName: useName,
        employeeEmail: useEmail,
        name,
        email,
        phone,

        domainName,
        address,
        country,

        comments,
        buget,
        calldate,
        createdDate: moment().format("MMM Do YY"),
        user_id,
    }
    try {
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_API}/callbacks`, payload)

        toast.success(res.data, {})
        Push.create(`Hey ${useName}`, {
            body: `You have successfully ceated a Lead ${name}'?`,
            icon: `${DM}`,
        })

        setName('')
        setEmail('')
        setPhone('')

        setDomain('')
        setAddress('')
        setCountry('')

        setComments('')
        setBuget('')
        onClose();

          refreshData()

        const noti = {
            message: `${NewProfile?.name} created a callback: ${name}`,
            currentDate:moment().format('MMMM Do YYYY, h:mm:ss a')
        }
        await axios.post(`${import.meta.env.VITE_BACKEND_API}/notification`, noti)
      
    } catch (error) {
        toast.warning(error.response.data, {})
    }
}
useEffect(() => {
    if (userToken) {
        // Use the <Navigate /> component to redirect
    } else {
        return navigate('/Login')
    }
}, [country, userToken])
    // const token = useTheme();


  

    const classNames = {
        body: styles['my-drawer-body'],
        mask: styles['my-drawer-mask'],
        header: styles['my-drawer-header'],
        footer: styles['my-drawer-footer'],
        content: styles['my-drawer-content'],
    };
    const drawerStyles = {
        mask: {
            backdropFilter: 'blur(10px)',
        },
        content: {
            boxShadow: '-10px 0 10px #666',
        },

        // body: {
        //     fontSize: token.fontSizeLG,
        // },

    };
    return (
        <div className="drawerPage">

            <Drawer
                title="Create Callback"
                width={650}
            
                visible={open}  // Use visible instead of open
                onClose={onClose}  // onClose function to handle drawer close
                classNames={classNames}
                styles={drawerStyles}
                bodyStyle={{
                    paddingBottom: 80,
                }}
            >
                <div className='projectDrawer'>


                    <Form layout="vertical" hideRequiredMark >


                        <Row gutter={16}>
                            <Col span={11}>
                                <Form.Item
                                    name="Transfer Title"
                                    label="Name"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Provide Name',
                                        },
                                    ]}
                                >
                                    <Input placeholder="Enter Name" type='text' value={name}  onChange={(e) => setName(e.target.value)} />
                                </Form.Item>
                            </Col>
                            <Col span={11}>
                                <Form.Item
                                    name="Email"
                                    label="Email"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Provide Email',
                                        },
                                    ]}
                                >
                                    <Input placeholder="Enter Email" value={email}  onChange={(e) => setEmail(e.target.value)} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={11}>
                                <Form.Item
                                    name="Phone "
                                    label="Phone Number"
                                    rules={[
                                        {
                                            required: false,
                                            message: 'Please Provide Phone Number',
                                        },
                                    ]}
                                >
                                    <Input placeholder="Enter Phone Number" type='number' value={phone} onChange={(e) => setPhone(e.target.value)}/>
                                </Form.Item>
                            </Col>
                            <Col span={11}>
                                <Form.Item
                                    name="Call Date"
                                    label="Call Date"
                                    rules={[
                                        {
                                            required: false,
                                            message: 'Enter Call Date',
                                        },
                                    ]}
                                >
                                    <DatePicker
                                        style={{
                                            width: '100%',
                                        }}
                                        getPopupContainer={(trigger) => trigger.parentElement}

                                        value={calldate}
                                        onChange={(e) => setCalldate(e.target.value)}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={11}>
                                <Form.Item
                                    name="Domain Name"
                                    label="Domain Name"
                                    rules={[
                                        {
                                            required: false,
                                            message: 'Please Provide Domain Name',
                                        },
                                    ]}
                                >
                                    <Input placeholder=" Domain Name" type='text' value={domainName} onChange={(e) => setDomain(e.target.value)}/>
                                </Form.Item>
                            </Col>
                            <Col span={11}>
                                <Form.Item
                                    name="Budget "
                                    label="Budget"
                                    rules={[
                                        {
                                            required: false,
                                            message: 'Please Provide Budget',
                                        },
                                    ]}
                                >
                                    <Input placeholder="Enter Budget" type='number' value={buget}
                                        onChange={(e) => setBuget(e.target.value)} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={22}>
                                <Form.Item
                                    name="country"
                                    label="country"
                                    rules={[
                                        {
                                            required: false,
                                            message: 'Please enter country',
                                        },
                                    ]}
                                >
                                    <Input placeholder="USA" type='text' value={country}
                            onChange={(e) => setCountry(e.target.value)} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={22}>
                                <Form.Item
                                    name="Address"
                                    label="Address"
                                    rules={[
                                        {
                                            required: false,
                                            message: 'Please enter Address',
                                        },
                                    ]}
                                >
                                    <Input.TextArea rows={3} placeholder="Please enter Address"  value={address}
                            onChange={(e) => setAddress(e.target.value)} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={22}>
                                <Form.Item
                                    name="Comment"
                                    label="Comment"
                                    rules={[
                                        {
                                            required: false,
                                            message: 'Please enter Comment',
                                        },
                                    ]}
                                >
                                    <Input.TextArea rows={3} placeholder="Please enter Comment"   value={comments}
                            onChange={(e) => setComments(e.target.value)}
                           />
                                </Form.Item>
                            </Col>
                        </Row>



                        <Space>
                            <Button onClick={handelSubmit} className='buttonFilled' type="primary">
                                Submit
                            </Button>
                            <Button onClick={onClose} className='buttonLine'  >Cancel</Button>
                        </Space>
                    </Form>
                </div>
            </Drawer>
        </div>
    );
};

export default CallbackDrawer;
