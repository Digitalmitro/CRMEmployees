import React, { useEffect, useState } from "react";
// import Layout from "../pages/Layout";
// import "../style/Transfer.css"
import downArrow from '../../assets/bxs_down-arrow.png';
import menuDots from '../../assets/lucide_ellipsis.png';
import filter from '../../assets/mdi_filter.png';
import menuList from '../../assets/material-symbols_list.png';
import { Modal } from 'antd'
import * as XLSX from 'xlsx'
import axios from 'axios'
import messageIcon from '../../assets/messageIcon.png'
import handelSeoMail from '../Mail/SeoMail'
import handelSMMail from '../Mail/SmoMail'
import handelDMMail from '../Mail/DmMail'
import handelBWMail from '../Mail/BasicWebMail'
import handelEcomMail from '../Mail/EcomMail'
import { NavLink, useNavigate } from "react-router-dom";
import { DatePicker, Space } from 'antd';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Cookies from 'js-cookie'
import moment from 'moment'
import { FaListUl } from "react-icons/fa";
import { FaFilter } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import Delete from '../../assets/delete-icon.png'
import SalesDrawer from "./SalesDrawer";


const EmployeeSales = () => {
    const Profile = localStorage.getItem('user')
    const NewProfile = JSON.parse(Profile)
    const user_id = NewProfile?._id
    const user_name = NewProfile?.name
    const aliceName = NewProfile?.aliceName
    const navigate = useNavigate()
    const [searchTerm, setSearchTerm] = useState('')
    const [sortBy, setSortBy] = useState('Date') // Default sorting by Date
    const [searchResults, setSearchResults] = useState([])
    const [data, setData] = useState([])
    const [selectedMonth, setSelectedMonth] = useState('')
    const [date, setDate] = useState('')
    const [open, setOpen] = useState(false);

    const showDrawers = () => {
      setOpen(true);
    };
  
    const onClose = () => {
      setOpen(false);
    };
  
    const handleSubmit = () => {
      // Handle form submit logic here
      onClose();
    };

    const refreshData = () => {
      Getdata(); // Refresh data function
    };
  
    // Function to handle the change in the select input
    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value)
    }
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };
    const Getdata = async () => {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_API}/sale-user/${user_id}`)
        setData(res.data.sale)
        filterAndSortResults(searchTerm, sortBy, res.data.sale)
    }
    console.log(data)
    const handleDel = async (id) => {
        try {
            await axios.delete(`${import.meta.env.VITE_BACKEND_API}/sale-1/${id}`)
            Getdata()
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        Getdata()
    }, [searchTerm, sortBy])
    const handleChange = (event) => {
        setSearchTerm(event.target.value)
    }

    const handleSortChange = (event) => {
        setSortBy(event.target.value)
    }

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
        link.setAttribute('download', 'sales.xlsx')
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

    return (
        <>
            <ToastContainer />
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
                        <h6>All Sales</h6>
                    </div>
                    <div className="list-of-days" style={{ display: "flex", width: "50%", justifyContent: "flex-end" }}>
                        {/* <div>
                            <span style={{ marginRight: "10px", color: "#FF560E" }}><FaListUl style={{ marginRight: "10px", color: "#FF560E" }} />List </span>
                        </div> */}
                        <div className="emp-holidays-btn">
                            {/* <button style={{ height: "25px", width: "90px", borderRadius: "10px", background: "#FFC700", color: "#fff", fontSize: "0.8rem", border: "none" }}>No. of Late</button> */}
                            <button className="custom-btn btn-5" onClick={showDrawers}>Create Sales</button>
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
                                              


                                                <td>
                                                    <img src={messageIcon} alt="..." className="messageIcon" style={{}} onClick={() => showModal(res)} />

                                                    <button className="buttonFilled" style={{ fontSize: "0.8rem" }} onClick={() => navigate(`/view_sale/${res._id}`)}>View</button >

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
                    <SalesDrawer open={open} onClose={handleSubmit} refreshData={refreshData} />

                </div>
            </div>

        </>
    );
};

export default EmployeeSales;

{/* <div className=" TransferPanel  employee-project-container container py-5">
      
        <div className="emp-select-months-year">
          <div className="emp-select-month">
            <select style={{ width: '130px', height: '45px' }} onChange={handleMonthChange}>
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
          <div className="emp-select-date">
            <Space direction="vertical" style={{ border: "none", outline: "none" }}>
              <DatePicker onChange={handleChange} />

            </Space>
          </div>
          <div  >
            <button className="borderColor p-1 px-4" type="text">Search</button>
          </div>
        </div>
        <hr className="lineTag m-2" />
        <div className="projectSection2 d-flex justify-content-between gap-3 my-2"
          style={{ marginRight: "4rem" }}>
          <div className="d-flex  justify-content-start text-center gap-3 align-items-center" style={{ color: "coral" }}>
            <span className="p-2">All Sales</span>
          </div>
          <div className="d-flex  px-3 justify-content-start text-center gap-5 align-items-center">
            <div className="d-flex  px-3 justify-content-start text-center gap-2 align-items-center">
              <img src={menuList} className="menulist" alt="..." />
              <div className="text-center ">
                <span className="px-1" style={{ color: "coral" }}>List</span>
                <img src={downArrow} className="downArrow mx-1 mb-1" alt="..." />
              </div>

            </div>

            <div className="d-flex gap-2">
              <img src={filter} alt="..." />
              <img src={menuDots} alt="..." />
            </div>
          </div>
        </div>
        <div class="tab-content" id="pills-tabContent">
          <div class="tab-pane fade show active table-responsive " id="pills-activeproject-home" role="tabpanel" aria-labelledby="pills-activeproject-home" tabindex="0">



            <div class="">
              <table class="table table-bordered mt-2">
                <thead>
                  <tr>
                    <th scope="col">Created By </th>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Phone</th>
                    <th scope="col">Call Date</th>
                    <th scope="col">Domain Name</th>
                    <th scope="col">Address</th>

                    <th scope="col">Comments</th>
                    <th scope="col">Budget</th>
                    <th scope="col">Created Date</th>



                    <th scope="col">Action</th>


                  </tr>
                </thead>
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
                          <td>{res.employeeName}</td>
                          <td>{res.name}</td>
                          <td>{res.email}</td>
                          <td>{res.phone}</td>
                          <td>{res.calldate}</td>
                          <td>{res.domainName}</td>
                          <td>{res.address}</td>
                          <td>{res.comments}</td>
                          <td>{res.buget}</td>
                          <td>{res.createdDate}</td>
                          <td>
                            <button
                              className="btn btn-primary me-2"
                              onClick={() => showModal(res)}
                            >
                              <svg
                                width="30"
                                height="20"
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
                                  {' '}
                                  <path
                                    d="M16 17H21M18.5 14.5V19.5M12 19H6.2C5.0799 19 4.51984 19 4.09202 18.782C3.71569 18.5903 3.40973 18.2843 3.21799 17.908C3 17.4802 3 16.9201 3 15.8V8.2C3 7.0799 3 6.51984 3.21799 6.09202C3.40973 5.71569 3.71569 5.40973 4.09202 5.21799C4.51984 5 5.0799 5 6.2 5H17.8C18.9201 5 19.4802 5 19.908 5.21799C20.2843 5.40973 20.5903 5.71569 20.782 6.09202C21 6.51984 21 7.0799 21 8.2V11M20.6067 8.26229L15.5499 11.6335C14.2669 12.4888 13.6254 12.9165 12.932 13.0827C12.3192 13.2295 11.6804 13.2295 11.0677 13.0827C10.3743 12.9165 9.73279 12.4888 8.44975 11.6335L3.14746 8.09863"
                                    stroke="#ffffff"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  ></path>{' '}
                                </g>
                              </svg>
                            </button>
                            <button
                              className="btn btn-success"
                              onClick={() => navigate(`/view_sale/${res._id}`)}
                            >
                              View
                            </button>
                            <button
                              className="btn btn-danger ms-2"
                              onClick={() => handleDel(res._id)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                class="bi bi-trash"
                                viewBox="0 0 16 16"
                              >
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      </>
                    )
                  })}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div> */}