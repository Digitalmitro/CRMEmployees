// src/components/CustomDrawer.js

import React from 'react';
import { useState, useEffect } from 'react'
import { Drawer, Button, Form, Input, Row, Col, Select, DatePicker, Space, Checkbox } from 'antd';
import { createStyles, useTheme } from 'antd-style';

import { motion } from 'framer-motion'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
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


const TransferViewEdit = () => {
    const { styles } = useStyle();
    const navigate = useNavigate()
    const userToken = Cookies.get('userToken')
    const { id } = useParams()
    const Profile = localStorage.getItem('user')
    const NewProfile = JSON.parse(Profile)
    const user_id = NewProfile?._id
    console.log('NewProfile', NewProfile)
    const [isOpen, setIsOpen] = useState(true)
    const toggle = () => setIsOpen(!isOpen)
    const [data, setData] = useState({})
    const [name, setName] = useState(data.name)
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
  
    const [domainName, setDomain] = useState('')
    const [address, setAddress] = useState('')
    const [country, setCountry] = useState('USA')
  
    const [comments, setComments] = useState('')
    const [budget, setBudget] = useState('')
    const getData = async () => {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_API}/transfer-1/${id}`)
      setData(res.data)
    }
    console.log(data)
    useEffect(() => {
      getData()
      if (userToken) {
        // Use the <Navigate /> component to redirect
      } else {
        return navigate('/Login')
      }
    }, [userToken])
  
    const handleUpdate = async (e) => {
      e.preventDefault()
      try {
        const payload = {}
  
        // Check if each field has been changed and update the payload accordingly
        if (name !== '') payload.name = name
        if (email !== '') payload.email = email
        if (phone !== '') payload.phone = phone
        if (domainName !== '') payload.domainName = domainName
        if (address !== '') payload.address = address
        if (country !== '') payload.country = country
        if (comments !== '') payload.comments = comments
        if (budget !== '') payload.buget = budget
        const res = await axios.put(`${import.meta.env.VITE_BACKEND_API}/transfer-1/${id}`, payload)
        navigate(`/transfer-view/${id}`)
        toast.success(res.data, {})
        setName('')
        setEmail('')
        setPhone('')
  
        setDomain('')
        setAddress('')
        setCountry('')
  
        setComments('')
        setBudget('')
  
      } catch (error) {
        toast.warning(error.response.data, {})
      }
    }
    return (
        <div className="drawerPage">

                  <div className='projectDrawer'>


                    <Form layout="horizontal" hideRequiredMark >


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
                            {/* <Col span={11}>
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
                            </Col> */}
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
                                    <Input placeholder="Enter Budget" type='number' value={budget}
                                        onChange={(e) => setBudget(e.target.value)} />
                                </Form.Item>
                            </Col>
                        </Row>

                        {/* <Row gutter={16}>
                            <Col span={22}>
                                <Form.Item name="strictProject" valuePropName="checked">
                                    <Checkbox>Make this a strict project</Checkbox>
                                </Form.Item>
                            </Col>
                        </Row> */}
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
                            <Button onClick={handleUpdate} className='buttonFilled' type="primary">
                                Submit
                            </Button>
                            <Button  className='buttonLine'  >Cancel</Button>
                        </Space>
                    </Form>
                </div>
        </div>
    );
};

export default TransferViewEdit;
