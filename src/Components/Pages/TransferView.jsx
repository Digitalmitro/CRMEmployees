import React, { useState, useEffect } from "react";
import { Modal, Input } from 'antd';
import Arrow from "../../assets/Arrowss.png";
import callPhone from "../../assets/callbackPhone.png";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";
import { Stepper, Step, StepLabel, StepContent, TextField, Button } from "@mui/material";

const TransferView = () => {
    const navigate = useNavigate()
  const token = Cookies.get('token')
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

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [activeStep, setActiveStep] = useState(0);



  const showModal = () => {
    setIsModalVisible(true);
};

const handleOk = async () => {
    try {
        const payload = {
            comment: newComment,
            user_id,
            callback_id: id
        };

        const res = await axios.post(
            `${import.meta.env.VITE_BACKEND_API}/comments`,
            payload
        );

        toast.success("Comment added successfully!");
        setIsModalVisible(false);
        setNewComment("");
        getData(); // Refresh data to include the new comment
    } catch (error) {
        toast.warning(error.response.data, {});
    }
};

const handleCancel = () => {
    setIsModalVisible(false);
};

  const getData = async () => {
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_API}/transfer-1/${id}`)
    setData(res.data)
  }
  console.log(data)
  useEffect(() => {
    getData()
    if (token) {
      // Use the <Navigate /> component to redirect
    } else {
      return navigate('/Login')
    }
  }, [token])

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
      toast.success(res.data, {})
      setName('')
      setEmail('')
      setPhone('')

      setDomain('')
      setAddress('')
      setCountry('')

      setComments('')
      setBudget('')

      navigate(`/transfer_status/${id}`)
    } catch (error) {
      toast.warning(error.response.data, {})
    }
  }

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
};

const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
};
    return (
        <>
            <div className="CallbackPanel">
                <div className="d-flex justify-content-between align-items-center my-3">
                    <p>
                        {/* <b>mr. tirthoraj badhaeI (sample) - </b> oh my goodknits inc */}
                    </p>
                    <div className="d-flex justify-content-end gap-2">
                        <button className="buttonFilled">Send Email</button>
                        <button className="buttonFilled" onClick={handleUpdate}>Edit</button>
                        {/* <div className="text-center">
                            <img
                                src={Arrow}
                                alt=""
                                className="mt-2"
                                style={{ width: "40px", height: "30px" }}
                            />
                        </div> */}
                        <span>
                            <p></p>
                        </span>
                    </div>
                </div>
                {/* <div className="d-flex gap-2 my-2">
                    <button className="buttonHeading text-center d-flex gap-2 border-none">
                        <span className="py-2 overviewText">Overview</span>
                        <span className="py-2 TimeLineText">Timeline</span>
                    </button>
                </div> */}
                <div className="row d-flex justify-content-between" style={{ zoom: "0.8" }}>
                    <div className="col-5 m-3 p-2 callbackform">
                        <p className="row">
                            <span className="col-4">Name</span>
                            <span className="col-6">
                                <input type="text" readOnly={true} placeholder={data.name} value={name} onChange={(e) => setName(e.target.value)} />
                            </span>
                        </p>
                        <div className="row">
                            <p className="col-md-4">Email</p>
                            <div className="col-md-8 d-flex gap-3 justify-content-start align-items-start">
                                <span>
                                    <input readOnly={true} type="email" placeholder={data.email} value={email} onChange={(e) => setEmail(e.target.value)} />
                                </span>
                            </div>
                        </div>
                        <div className="row">
                            <p className="col-4 my-3">Mobile</p>
                            <div className="col-6 d-flex gap-3 justify-content-start align-items-start">
                                <span>
                                    <input readOnly={true} className="my-2" type="number" placeholder={`+1 ${data.phone}`} value={phone} onChange={(e) => setPhone(e.target.value)} />
                                </span>
                            </div>
                        </div>
                        <p className="row">
                            <span className="col-4 my-2">Domain Name</span>
                            <span className="col-6">
                                <input readOnly={true} type="text" placeholder={data.domainName} value={domainName} onChange={(e) => setDomain(e.target.value)} />
                            </span>
                        </p>
                        <p className="row">
                            <span className="col-4">Address</span>
                            <span className="col-6">
                                <input readOnly={true}
                                    style={{ border: "none", color: "#222",marginTop:"-8px" }}
                                    resize="none"
                                    columns={40}
                                    type="text"
                                    placeholder={data.address}
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </span>
                        </p>
                        <p className="row">
                            <span className="col-4">Country</span>
                            <span className="col-6">
                                <input readOnly={true} type="text" placeholder={data.country} value={country} onChange={(e) => setCountry(e.target.value)} />
                            </span>
                        </p>
                    </div>
                    <div className="col-5 p-2 callbackform">
                        {/* <div className="row">
                            <label  htmlFor="email" className="col-4 my-2">Callback date</label>
                            <input readOnly={true}
                                className="col-7"
                                type="email"
                                id="email"
                                placeholder={data.calldate}
                                value={calldate}
                                onChange={(e) => setCalldate(e.target.value)}
                            />
                        </div> */}
                        <div className="row">
                            <label htmlFor="website" className="col-4 my-3">Budget</label>
                            <input readOnly={true}
                                className="col-7 my-2"
                                placeholder={`$ ${data.buget}`}
                                value={budget}
                                onChange={(e) => setBudget(e.target.value)}
                            />
                        </div>
                        {/* <div className="row">
                            <label className="col-4 my-3" htmlFor="createdBy">Created By :</label>
                            <input readOnly={true}
                                className="col-7 my-2"
                                type="text"
                                id="createdBy"
                                placeholder={data.employeeName}
                            />
                        </div>
                        <div className="row">
                            <label className="col-4 my-3" htmlFor="createdDate">Created Date :</label>
                            <input readOnly={true}
                                className="col-7 my-2"
                                type="text"
                                id="createdDate"
                                placeholder={data.createdDate}
                            />
                        </div> */}
                        <div className="comment-progress" style={{ height: "auto",marginRight:"22px",marginTop:"10px" }}>
                          <div style={{display:"flex",justifyContent:"flex-end"}}><Button className="buttonFilled" onClick={showModal}>
                            Add Comment</Button></div>
                            <Stepper activeStep={activeStep} orientation="vertical">
                                <Step key="Step1">
                                    <StepLabel >Carl Morena</StepLabel>
                                    <StepContent>
                                        <TextField
                                            label="Comments"
                                            multiline
                                            rows={4}
                                          
                                            fullWidth
                                            value="Comment Added by user"
                                            inputProps={{ readOnly: true }}
                                            sx={{borderRadius:"10px !important"}}
                                        />
                                        <p style={{paddingTop:"5px"}}>Date: July 23rd 2024, 3:41:28 am</p>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleNext}
                                            style={{ marginTop: "16px",background:"#FF560E !important" }}
                                        >
                                            Next
                                        </Button>
                                    </StepContent>
                                </Step>
                                <Step key="Step2">
                                    <StepLabel>Admin</StepLabel>
                                    <StepContent>
                                        <TextField
                                            label="Comments"
                                            multiline
                                            rows={4}
                                           
                                            fullWidth
                                            value="Comment Added by Admin Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged."
                                            inputProps={{ readOnly: true }}
                                        />
                                        <p style={{paddingTop:"5px"}}>Date: July 23rd 2024, 3:41:28 am</p>
                                        <Button
                                            variant="contained"
                                            onClick={handleBack}
                                            style={{ marginTop: "16px", marginRight: "8px",background:"#FF560E !important" }}
                                        >
                                            Back
                                        </Button>
                                    </StepContent>
                                </Step>
                                
                            </Stepper>
                        </div>
                        
                    </div>
                </div>
            </div>
            {/* Add Comment Modal */}
            <Modal title="Add Comment" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Input.TextArea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={4}
                    placeholder="Enter your comment here"
                />
            </Modal>
        </>
    );
};

export default TransferView;
