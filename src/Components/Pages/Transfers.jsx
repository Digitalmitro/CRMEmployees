import * as XLSX from 'xlsx'
import { useEffect, useState, useRef } from 'react'
import { FaListUl } from "react-icons/fa";
import { FaFilter } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { DatePicker, Space } from 'antd';
import messageIcon from '../../assets/messageIcon.png'
import Delete from '../../assets/delete-icon.png'
import TransferDrawer from "./TransferDrawer"
import { NavLink } from "react-router-dom";
import axios from 'axios'
import { motion } from 'framer-motion'
import { Modal } from 'antd'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import handelSeoMail from '../Mail/SeoMail'
import handelSMMail from '../Mail/SmoMail'
import handelDMMail from '../Mail/DmMail'
import handelBWMail from '../Mail/BasicWebMail'
import handelEcomMail from '../Mail/EcomMail'
import { Navigate, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import moment from 'moment'
import { Select } from 'antd';

// import "../style/Project.css"
const Transfers = () => {

    const [open, setOpen] = useState(false);

    const [opened, setOpened] = useState(false);


  const navigate = useNavigate()

  const token = Cookies.get('token')
  const Profile = localStorage.getItem('user')
  const NewProfile = JSON.parse(Profile)
  const user_id = NewProfile?._id
  const user_name = NewProfile?.name
  const aliceName = NewProfile?.aliceName
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('Date') // Default sorting by Date
  const [data, setData] = useState([])
  const [selectedMonth, setSelectedMonth] = useState('')
  const [date, setDate] = useState('')
  const [searchResults, setSearchResults] = useState([])
  // Function to handle the change in the select input
  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value)
  }
  const Getdata = async () => {
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_API}/transfer-user/${user_id}`)
    setData(res.data.transfer)
    filterAndSortResults(searchTerm, sortBy, res.data.transfer)
  }
  console.log(data)
  const handleDel = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_API}/transfer-1/${id}`)
      Getdata()
    } catch (error) {
      console.log(error)
    }
  }
  const [userData, setUserData] = useState({})
  const handleCallback = async (userData) => {
    console.log('userData', userData)

    // Perform the POST request here with Axios
    axios
      .post(`${import.meta.env.VITE_BACKEND_API}/callbacks`, userData)
      .then((response) => {
        // Handle the response if needed
        console.log('Transfer successful:', response.data)
        // After successful transfer, perform the delete request
        axios
          .delete(`${import.meta.env.VITE_BACKEND_API}/transfer-1/${userData._id}`)
          .then(() => {
            console.log('Deletion successful')
            Getdata() // Refresh the data after deletion
          })
          .catch((error) => {
            console.error('Error deleting data:', error)
          })
      })
      .catch((error) => {
        console.error('Error transferring:', error)
      })

    const noti = {
      message: `${NewProfile?.name} created a callback: ${userData.name}`,
      currentDate:moment().format('MMMM Do YYYY, h:mm:ss a')
    }
    await axios.post(`${import.meta.env.VITE_BACKEND_API}/notification`, noti)
  }
  const handleSale = async (userData) => {
    console.log('userData', userData)

    // Perform the POST request here with Axios
    axios
      .post(`${import.meta.env.VITE_BACKEND_API}/sale`, userData)
      .then((response) => {
        // Handle the response if needed
        console.log('Transfer successful:', response.data)
        // After successful transfer, perform the delete request
        axios
          .delete(`${import.meta.env.VITE_BACKEND_API}/transfer-1/${userData._id}`)
          .then(() => {
            console.log('Deletion successful')
            Getdata() // Refresh the data after deletion
          })
          .catch((error) => {
            console.error('Error deleting data:', error)
          })
      })
      .catch((error) => {
        console.error('Error transferring:', error)
      })

    const noti = {
      message: `${NewProfile?.name} created a sale: ${userData.name}`,
      currentDate:moment().format('MMMM Do YYYY, h:mm:ss a')
    }
    await axios.post(`${import.meta.env.VITE_BACKEND_API}/notification`, noti)
  }
  useEffect(() => {
    Getdata()
    if (token) {
      // Use the <Navigate /> component to redirect
    } else {
      return navigate('/Login')
    }
  }, [searchTerm, sortBy, token])
  // Function to handle search term change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const refreshData = () => {
    Getdata(); // Refresh data function
  };

  const filterAndSortResults = (searchTerm, sortBy, data) => {
    let filteredResults = data.filter((item) =>
      Object.values(item).join(' ').toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (sortBy === 'Date') {
      filteredResults.sort((a, b) => new Date(a.date) - new Date(b.date))
    } else if (sortBy === 'Name') {
      filteredResults.sort((a, b) => a.name.localeCompare(b.name))
    }

    setSearchResults(filteredResults)
  }
  const [isOpen, setIsOpen] = useState(true)
  const toggle = () => setIsOpen(!isOpen)
  const downloadExcel = () => {
    if (data.length === 0) {
      console.error('No data to download')
      return
    }

    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

    // Convert workbook to array buffer
    const arrayBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    })

    // Convert array buffer to Blob
    const excelBlob = new Blob([arrayBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })

    // Create a download link
    const url = URL.createObjectURL(excelBlob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'Transfer.xlsx')
    document.body.appendChild(link)

    // Trigger the download
    link.click()

    // Cleanup
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedResult, setSelectedResult] = useState(null)
  // Function to handle opening modal and setting selected result
  const showModal = (result) => {
    setSelectedResult(result)
    setIsModalOpen(true)
  }
  const handleOk = () => {
    setIsModalOpen(false)
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }


  // ------drawer for transfer---
  const showDrawers = () => {
    setOpened(true);
  };

  const onClose = () => {
    setOpened(false);
  };

  const handleSubmit = () => {
    // Handle form submit logic here
    onClose();
  };

  // Filter the data based on the selected month and date
  const filteredData = data?.filter((entry) => {
    // Check if the entry's name includes the search term
    const nameIncludesSearchTerm = entry.name.toLowerCase().includes(searchTerm.toLowerCase());

    // Check if the entry's currentDate includes the selected month
    const currentDateIncludesMonth = !selectedMonth || entry.createdDate.includes(selectedMonth);

    // Check if the entry's currentDate matches the selected date
    const formattedDate = moment(date).format('MMM Do YY');
    const currentDateMatchesDate = !date || entry.createdDate === formattedDate;

    // Return true if all conditions are met
    return nameIncludesSearchTerm && currentDateIncludesMonth && currentDateMatchesDate;
  });






  const handleChange = (date, dateString) => {
    console.log(date, dateString);
  };



    return (
        <>
            <div className="employee-project-container container py-4">
            <div className="emp-select-months-year">
                    <div className="emp-select-month">
                        <select  style={{ width: '124px', height: '30px',  paddingRight: "12px", color: "#222" }} onChange={handleMonthChange} >
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
                    <div className="emp-select-month"style={{width:"123px",paddingRight:"0.2rem",height:"34px"}}>
                        {/* <Space direction="vertical" style={{ border: "none", outline: "none" }}>
                            <DatePicker onChange={(e) => setDate(e.target.value)} />

                        </Space> */}
                        <input onChange={(e) => setDate(e.target.value)} style={{ width: '118px', height: '30px',   color: "#222" }} type="date" />

                        {/* for search */}
                        {/* <input
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="search"
                            className="search shadow"
                            style={{ height: '45px', marginLeft: '10px', border: 'none' }}
                        /> */}
                    </div>
                </div>

                <hr />
                <div className="project-title my-2">
                    <div className="allproject">
                        <h6>All Transfers</h6>
                    </div>
                    <div className="list-of-days" style={{ display: "flex", width: "50%", justifyContent: "flex-end" }}>
                        {/* <div>
                            <span style={{ marginRight: "10px", color: "#FF560E" }}><FaListUl style={{ marginRight: "10px", color: "#FF560E" }} />List </span>
                        </div> */}
                        <div className="emp-holidays-btn">
                            {/* <button style={{ height: "25px", width: "90px", borderRadius: "10px", background: "#FFC700", color: "#fff", fontSize: "0.8rem", border: "none" }}>No. of Late</button> */}
                            <button className='custom-btn btn-5' onClick={showDrawers}>Create Transfer</button>
                            {/* <button style={{ height: "25px", width: "90px", borderRadius: "10px", background: "#FFC700", color: "#fff", fontSize: "0.8rem", border: "none" }}>Half Day : 0</button> */}
                        </div>
                        {/* <div className="sort"  >

                            <span><FaFilter style={{ color: "FF560E", fontSize: "0.8rem" }} /> </span>
                            <span><BsThreeDots style={{ color: "FF560E", fontSize: "0.8rem", }} /> </span>

                        </div> */}
                    </div>
                    {/* <div className="list">
                                <span><FaListUl style={{ marginRight: "10px" }} />List <button style={{ border: "1px solid #FF560E", marginLeft: "10px", background: "#fff", color: "#FF560E", padding: "2px 5px", borderRadius: "10px", fontSize: "0.8rem" }}>Automation</button></span>
                            </div> */}
                    {/* <div>
                                <button style={{ border: "1px solid #FF560E", background: "#fff", color: "#FF560E", padding: "2px 5px", borderRadius: "10px", fontSize: "0.8rem" }}>Automation</button>
                            </div> */}
                    {/* <div className="sort"  >

                                <span><FaFilter style={{ color: "FF560E", fontSize: "0.8rem" }} /> </span>
                                <span><BsThreeDots style={{ color: "FF560E", fontSize: "0.8rem" }} /> </span>
                              
                            </div> */}
                </div>
                <div class="tab-content table-cont " id="pills-tabContent">
                    <div class="tab-pane fade show active table-responsive" id="pills-activeproject-home" role="tabpanel" aria-labelledby="pills-activeproject-home" tabindex="0">

                        <table class="table table-bordered mt-2">
                            <thead>
                                <tr>
                                    <th scope="col">Created Date</th>
                                    <th scope="col">Created By </th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Phone</th>
                                    <th scope="col">Call Date</th>
                                    <th scope="col">Domain Name</th>
                                    <th scope="col">Address</th>

                                    <th scope="col">Comments</th>
                                    <th scope="col">Budget</th>

                                    <th scope="col">Sent To</th>
                                    <th scope="col">Action</th>


                                </tr>
                            </thead>
                            {/* for email */}
                            <Modal
                                title={`Sent mail to ${selectedResult?.email}`}
                                open={isModalOpen}
                                onOk={handleOk}
                                onCancel={handleCancel}
                                width={800}
                                centered
                            >
                                <div
                                    className="d-flex"
                                    style={{
                                        gap: '15px',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <button
                                        className="btn btn-success"
                                        onClick={() => {
                                            handelSeoMail(selectedResult?.name, aliceName, selectedResult?.email)
                                            handleCancel()
                                            toast.success('Mail sent successfully!', {})
                                        }}
                                    >
                                        Seo Proposal
                                    </button>
                                    <button
                                        className="btn btn-success"
                                        onClick={() => {
                                            handelSMMail(selectedResult?.name, aliceName, selectedResult?.email)
                                            handleCancel()
                                            toast.success('Mail sent successfully!', {})
                                        }}
                                    >
                                        Smo Proposal
                                    </button>
                                    <button
                                        className="btn btn-success"
                                        onClick={() => {
                                            handelDMMail(selectedResult?.name, aliceName, selectedResult?.email)
                                            handleCancel()
                                            toast.success('Mail sent successfully!', {})
                                        }}
                                    >
                                        Digital Marketing Proposal
                                    </button>
                                    <button
                                        className="btn btn-success"
                                        onClick={() => {
                                            handelBWMail(selectedResult?.name, aliceName, selectedResult?.email)
                                            handleCancel()
                                            toast.success('Mail sent successfully!', {})
                                        }}
                                    >
                                        Basic Website Proposal
                                    </button>
                                    <button
                                        className="btn btn-success"
                                        onClick={() => {
                                            handelEcomMail(selectedResult?.name, aliceName, selectedResult?.email)
                                            handleCancel()
                                            toast.success('Mail sent successfully!', {})
                                        }}
                                    >
                                        E-commerce Proposal
                                    </button>
                                </div>
                            </Modal>
                            <tbody>
                                {filteredData?.map((res, index) => {
                                    return (
                                        <>
                                            <tr key={res._id}>
                                                {/* <th >Prakriti Sing</th>
                                    <th >kamal Sing</th>
                                    <td>prakriti@gmail.com</td>
                                    <td>95412653</td>
                                    <td>24-06-2024</td>
                                    <td>bestbotoxnearme.com</td>
                                    <td>2000 California Ave
                                        Cleveland</td>
                                    <td>his website wants to
                                        redesign at $800</td>
                                    <td>$800</td>
                                    <td>April 28th 24</td>
                                    <td>CAME LATE DUE TO TRAFFI</td>
                                    <td>PENDING</td>
                                    <td>2024-07-0</td> */}
                                                <td>{res.createdDate}</td>
                                                <td>{res.employeeName}</td>
                                                <td>{res.name}</td>
                                                <td>{res.email}</td>
                                                <td>{res.phone}</td>
                                                <td>{res.calldate}</td>
                                                <td>{res.domainName}</td>
                                                <td>{res.address}</td>
                                                <td>{res.comments}</td>
                                                <td>{res.buget}</td>
                                                {/* <td></td> */}
                                                {/* <td></td> */}
                                                {/* <td></td> */}
                                                <td class="d-flex gap-1">
                                                    <button className="buttonFilled" style={{ fontSize: "0.8rem" }} onClick={() => {
                                                        setUserData(res) // Set the user data to be transferred
                                                        handleCallback(res) // Call function to handle transfer
                                                    }}>Callback</button>

                                                </td>


                                                <td>
                                                    <img src={messageIcon} alt="..." className="messageIcon" style={{}} onClick={() => showModal(res)} />

                                                    <button className="buttonFilled" style={{ fontSize: "0.8rem" }} onClick={() => navigate(`/transfer-view/${res._id}`)}>View</button >

                                                    <button onClick={() => handleDel(res._id)} style={{ outline: "none", border: "none" }}>
                                                        <img src={Delete} alt="..." width={30} height={30} className="DeleteIcon" />
                                                    </button>
                                                </td>
                                            </tr>
                                        </>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                    <TransferDrawer open={opened} onClose={handleSubmit} refreshData={refreshData} />
                </div>
            </div>
        </>
    )
}

export default Transfers