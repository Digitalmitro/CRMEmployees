import React, { useState, useEffect } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import img2 from "../../assets/Vector.png";
import im3 from "../../assets/Vector3.png"
import userIcon from "../../assets/usericon.png";
import img4 from "../../assets/Vector4.png";
import img5 from "../../assets/Vector5.png";
import img6 from "../../assets/Vector6.png";
import img7 from "../../assets/helpicon.png";
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Cookies from 'js-cookie'
import moment from 'moment'
import { Modal } from 'antd'
import { useNavigate } from "react-router-dom";
import { DatePicker, Space } from 'antd';
import axios from "axios"




const EmployeeAttendance = () => {
  const token = Cookies.get('token')
  const Profile = localStorage.getItem('user')
  const NewProfile = JSON.parse(Profile)
  const name = NewProfile?.name
  const email = NewProfile?.email
  const user_id = NewProfile?._id

  // console.log("NewProfile", NewProfile);
  const [hidden, setHidden] = useState(false)
  const [data, setData] = useState([])
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAttendanceOpen, setIsAttendance] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState('')
  const [date, setDate] = useState("")



  //model
  const [msgDate, setMsgDate] = useState('')
  const [message, setMessage] = useState('')
  const [attendanceData, setAttendanceData] = useState([])


  const groupedDatas = Object.values(
    attendanceData.reduce((acc, curr) => {
      // Group entries by currentDate
      const currentDate = curr.currentDate
      // console.log("Current:", curr);
      if (!acc[currentDate]) {
        acc[currentDate] = {
          currentDate,
          userName: '',
          userEmail: '',
          punchin: '',
          punchOut: '',
          time: '',
          status: '',
          ip: ''
        }
      }

      // Merge punchin, punchOut, status, and ip
      if (curr.userName) {
        acc[currentDate].userName = curr.userName
      }
      if (curr.userEmail) {
        acc[currentDate].userEmail = curr.userEmail
      }
      if (curr.punchin) {
        acc[currentDate].punchin = curr.punchin
      }
      if (curr.punchOut) {
        acc[currentDate].punchOut = curr.punchOut
      }
      if (curr.time) {
        acc[currentDate].time = curr.time
      }
      if (curr.status) {
        acc[currentDate].status = curr.status
      }
      if (curr.ip) {
        acc[currentDate].ip = curr.ip
      }

      return acc
    }, {}),
  )
  console.log(groupedDatas)
  // Add missing weekend days between the data
  const weekendEntriess = [];
  const weekdayEntriess = [];

  // Iterate over groupedData to add missing entries
  groupedDatas.forEach((entry, index) => {
    if (index > 0) {
      const currentDate = moment(entry.currentDate, "MMM Do YY");
      const prevDate = moment(groupedDatas[index - 1].currentDate, "MMM Do YY");
      const diffDays = currentDate.diff(prevDate, "days");
      for (let i = 1; i < diffDays; i++) {
        const missingDate = prevDate.clone().add(i, "days");
        if (missingDate.day() === 6 || missingDate.day() === 0) {
          // If the missing date is Saturday or Sunday, add an entry with "Week Off" status
          weekendEntriess.push({
            userName: entry.userName,
            userEmail: entry.userEmail,
            currentDate: missingDate.format("MMM Do YY"),
            punchin: "",
            punchOut: "",
            time: "",
            status: "Week Off",
            ip: ""
          });
        } else {
          // If the missing date is a weekday, add an entry with "Absent" status
          weekdayEntriess.push({
            userName: "",
            userEmail: "",
            currentDate: missingDate.format("MMM Do YY"),
            punchin: "",
            punchOut: "",
            time: "",
            status: "Absent",
            ip: ""
          });
        }
      }
    }
  });

  // Merge the original data with the added weekend and weekday entries
  const finalDatas = [...groupedDatas, ...weekendEntriess, ...weekdayEntriess];

  // Sort the data by currentDate
  finalDatas.sort((a, b) => moment(a.currentDate, "MMM Do YY").valueOf() - moment(b.currentDate, "MMM Do YY").valueOf());

  console.log(finalDatas);

  // Filter the data based on the selected month and date
  const filteredDatas = finalDatas.filter((entry) => {
    // Check if the entry's currentDate includes the selected month
    if (!entry.currentDate.includes(selectedMonth)) {
      return false;
    }

    // Check if the entry's currentDate matches the selected date
    const formattedDate = moment(date).format("MMM Do YY");;
    // console.log(formattedDate);
    if (date && entry.currentDate === formattedDate) {
      return true;
    }

    // If no date is selected, return true to include all entries for the selected month
    return !date;
  });
  console.log(filteredDatas)

  useEffect(() => {
    getData()
  }, [selectedMonth])

  const totalLate = filteredDatas?.filter((e) => e.status === "LATE").length
  const totalAbs = filteredDatas?.filter((e) => e.status === "Absent").length
  // Calculate half day count

  const halfDayCount = filteredDatas?.filter((entry) => {
    if (entry.status === 'Week Off' || entry.status === 'Absent') {
      return false;
    }

    const punchInTime = moment(entry.punchin, 'h:mm:ss A');
    const punchOutTime = moment(entry.punchOut, 'h:mm:ss A');

    const duration = moment.duration(punchOutTime.diff(punchInTime)).asHours();
    return duration < 7 && duration > 0;
  }).length;






  const getAttData = async () => {
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_API}/attendance/${user_id}`)
    setData(res.data.attendance)
  }


  const handleChange = (date, dateString) => {
    console.log(date, dateString);
  };



  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value)
  }



  const showModal = () => {
    setIsModalOpen(true)
  }
  const showAttendance = () => {
    setIsAttendance(true)
  }
  const handleOk = async () => {
    setIsModalOpen(false)
    const payload = {
      name,
      email,
      message,
      date: moment().format('MMMM Do YYYY, h:mm:ss a'),
      status: "Pending",
      user_id,
    }
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_API}/concern`, payload)
      toast.info(res.data, {})
    } catch (error) { }
  }
  const handledOk = async () => {
    setIsAttendance(false)
    const payload = {
      name,
      email,
      message,
      date: msgDate,
      status: "Pending",
      user_id,
    }
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_API}/concern`, payload)
      toast.info(res.data, {})
    } catch (error) { }
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }
  const handleCancels = () => {
    setIsAttendance(false)
  }

  const [isOpen, setIsOpen] = useState(true)
  const toggle = () => setIsOpen(!isOpen)

  // location tracker
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [locationPermission, setLocationPermission] = useState(false)
  const [iframe, setIframe] = useState(false)

  const [percent, setPercent] = useState(29)

  const status = percent === 100 ? 'success' : percent <= 29 ? 'red' : 'active'
  const color = percent === 100 ? '#52c41a' : percent <= 29 ? 'red' : '#ffc107'

  const [hide, setHide] = useState(false)

  const [punchin, setPunchin] = useState('')
  const [punchOut, setPunchOut] = useState('')

  const [timeDifferenceMinutes, setTimeDifferenceMinutes] = useState(0) // State to hold the working time in minutes

  const [checkoutClicked, setCheckoutClicked] = useState(false)

  const [loading, setLoading] = useState(false)
  function handleLoading() {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 750)
  }


  const handlePunchIn = async () => {
    const currentTime = new Date().toLocaleTimeString()
    setPunchin(currentTime) // Update punchin state with current time
    setHide(!hide)
    setIframe(true)
    const currentDate = moment().format('MMM Do YY')
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_API}/attendance`, {
        userName: name,
        userEmail: email,
        punchin: currentTime,
        currentDate,
        ip: userIP,
        user_id,
      })
      // console.log(response.data);
      setHidden(true)
      handleLoading()
    } catch (error) {
      console.error('Error sending checkin data:', error)
    }
    getAttData() // Refresh attendance data after check-in
  }

  const handlePunchOut = async () => {
    const currentTime = new Date().toLocaleTimeString()
    setPunchOut(currentTime)
    setHide(!hide)
    const currentDate = moment().format('MMM Do YY')
    const status = isLate ? 'LATE' : 'In Time'
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_API}/attendance`, {
        userName: name,
        userEmail: email,
        punchOut: currentTime,
        currentDate,
        status,
        ip: userIP,
        user_id,
      })
      // console.log(response.data);
    } catch (error) {
      console.error('Error sending checkout data:', error)
    }
    getAttData() // Refresh attendance data after check-out
    setCheckoutClicked(true) // Set checkout clicked to true
  }

  const currentDate = moment().format('MMM Do YY')

  const [userIP, setUserIP] = useState(null)
  const getIp = async () => {
    // Fetch user's IP address
    const response = await fetch('https://api.ipify.org?format=json')
    const data = await response.json()
    setUserIP(data.ip)
  }



  async function getData() {
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_API}/attendance/${user_id}`)
    setAttendanceData(res.data.attendance)
  }
  const groupedData = Object.values(
    attendanceData.reduce((acc, curr) => {
      // Group entries by currentDate
      const currentDate = curr.currentDate
      // console.log("Current:", curr);
      if (!acc[currentDate]) {
        acc[currentDate] = {
          currentDate,
          userName: '',
          userEmail: '',
          punchin: '',
          punchOut: '',
          time: '',
          status: '',
          ip: '',
        }
      }

      // Merge punchin, punchOut, status, and ip
      if (curr.userName) {
        acc[currentDate].userName = curr.userName
      }
      if (curr.userEmail) {
        acc[currentDate].userEmail = curr.userEmail
      }
      if (curr.punchin) {
        acc[currentDate].punchin = curr.punchin
      }
      if (curr.punchOut) {
        acc[currentDate].punchOut = curr.punchOut
      }
      if (curr.time) {
        acc[currentDate].time = curr.time
      }
      if (curr.status) {
        acc[currentDate].status = curr.status
      }
      if (curr.ip) {
        acc[currentDate].ip = curr.ip
      }

      return acc
    }, {}),
  )
  console.log(groupedData)
  // Add missing weekend days between the data
  const weekendEntries = [];
  const weekdayEntries = [];

  // Iterate over groupedData to add missing entries
  groupedData.forEach((entry, index) => {
    if (index > 0) {
      const currentDate = moment(entry.currentDate, "MMM Do YY");
      const prevDate = moment(groupedData[index - 1].currentDate, "MMM Do YY");
      const diffDays = currentDate.diff(prevDate, "days");
      for (let i = 1; i < diffDays; i++) {
        const missingDate = prevDate.clone().add(i, "days");
        if (missingDate.day() === 6 || missingDate.day() === 0) {
          // If the missing date is Saturday or Sunday, add an entry with "Week Off" status
          weekendEntries.push({
            userName: entry.userName,
            userEmail: entry.userEmail,
            currentDate: missingDate.format("MMM Do YY"),
            punchin: "",
            punchOut: "",
            time: "",
            status: "Week Off",
            ip: ""
          });
        } else {
          // If the missing date is a weekday, add an entry with "Absent" status
          weekdayEntries.push({
            userName: "",
            userEmail: "",
            currentDate: missingDate.format("MMM Do YY"),
            punchin: "",
            punchOut: "",
            time: "",
            status: "Absent",
            ip: ""
          });
        }
      }
    }
  });

  // Merge the original data with the added weekend and weekday entries
  const finalData = [...groupedData, ...weekendEntries, ...weekdayEntries];

  // Sort the data by currentDate
  finalData.sort((a, b) => moment(a.currentDate, "MMM Do YY").valueOf() - moment(b.currentDate, "MMM Do YY").valueOf());

  console.log(finalData);

  // Filter the data based on the selected month and date
  const filteredData = finalData.filter((entry) => {
    // Check if the entry's currentDate includes the selected month
    if (!entry.currentDate.includes(selectedMonth)) {
      return false;
    }

    // Check if the entry's currentDate matches the selected date
    const formattedDate = moment(date).format("MMM Do YY");;
    // console.log(formattedDate);
    if (date && entry.currentDate === formattedDate) {
      return true;
    }

    // If no date is selected, return true to include all entries for the selected month
    return !date;
  });
  console.log(filteredData)





  // console.log("attdata", data);

  useEffect(() => {
    getData()

    getAttData()
    getIp()
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLatitude(position.coords.latitude)
            setLongitude(position.coords.longitude)
            setLocationPermission(true)
          },
          (error) => {
            console.log('Error getting location:', error)
          },
        )
      } else {
        console.log('Geolocation is not supported by this browser.')
      }
    }

    getLocation()
    if (punchin && punchOut) {
      setTimeDifferenceMinutes(calculateTimeDifference(punchin, punchOut))
    }
    if (token) {
      // Use the <Navigate /> component to redirect
    } else {
      return navigate('/Login')
    }
  }, [token, punchin, punchOut, currentDate, timeDifferenceMinutes, userIP])

  const calculateTimeDifference = (time1, time2) => {
    const format = 'hh:mm:ss A'
    const time1Date = new Date('2000-01-01 ' + time1)
    const time2Date = new Date('2000-01-01 ' + time2)

    // Get the difference in milliseconds
    let difference = Math.abs(time2Date - time1Date)

    // Convert milliseconds to hours, minutes, seconds
    let hours = Math.floor(difference / 3600000)
    difference -= hours * 3600000
    let minutes = Math.floor(difference / 60000)
    difference -= minutes * 60000
    let seconds = Math.floor(difference / 1000)

    return `${hours}:${minutes}:${seconds}`
  }

  let filteredPunchin = []

  if (data) {
    filteredPunchin = data.filter(
      (entry) =>
        entry.hasOwnProperty('punchin') &&
        !entry.hasOwnProperty('punchOut') &&
        entry.currentDate === currentDate,
    )
  }

  // console.log(
  //   "punchin",
  //   filteredPunchin.length > 0 ? filteredPunchin : "No data available"
  // );
  let filteredPunchOut = []

  if (data) {
    filteredPunchOut = data
      .filter(
        (entry) =>
          entry.hasOwnProperty('punchOut') &&
          !entry.hasOwnProperty('punchin') &&
          entry.currentDate === currentDate,
      )
      .map((entry) => ({ ...entry, currentDate: getCurrentDateFormatted() }))
  }
  // console.log(data);
  // console.log(
  //   "punchout",
  //   filteredPunchOut.length > 0 ? filteredPunchOut : "No data available"
  // );

  let filteredTime = []

  if (data) {
    filteredTime = data
      .filter((entry) => entry.hasOwnProperty('time'))
      .map((entry) => ({ ...entry, currentDate: getCurrentDateFormatted() }))
  }

  // console.log(
  //   "time",
  //   filteredTime.length > 0 ? filteredTime[0].time : "No data available"
  // );

  // console.log("test");

  const isLate = filteredPunchin.length > 0 && isCheckinLate(filteredPunchin[0].punchin)
  let timeDifference = null

  if (filteredPunchin.length > 0 && filteredPunchOut.length > 0) {
    // Assuming filteredPunchin and filteredPunchOut are arrays containing login and logout times respectively
    timeDifference = calculateTimeDifference(
      filteredPunchin[0].punchin,
      filteredPunchOut[0].punchOut,
    )

    // console.log("Time Difference (minutes):", timeDifference);
    const currentDate = moment().format('MMM Do YY')
    try {
      const response = axios.post(`${import.meta.env.VITE_BACKEND_API}/attendance`, {
        currentDate,
        time: timeDifference,
        user_id,
      })
      // console.log(response.data);
    } catch (error) {
      console.error('Error sending checkout data:', error)
    }
  } else {
    console.log('Cannot calculate time difference: Missing login or logout data')
  }


  return <>
    {/* modal */}
    <Modal
      title="Drop a message"
      centered
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <div className="container">
        <div className="row">
          <div className="col">
            <h6>Select Date</h6>
            <Space direction="vertical" style={{ outline: "none", border: "1px solid #f24e1e" }}>
              <DatePicker onChange={(e) => setMessage(e.target.value)} />

            </Space>
          </div>
          <div className="col">
            <h6>write concern</h6>

            <textarea onChange={(e) => setMessage(e.target.value)} />
          </div>
        </div>
      </div>
    </Modal>
    <Modal
      title="Monthly View"
      centered
      open={isAttendanceOpen}
      onOk={handledOk}
      onCancel={handleCancels}
    >
      <div className="container">
        <div className="row">
          <div className="col-md-3" style={{ display: "flex", justifyContent: "center" }}>
            {/* <h6>Select Date</h6> */}
            {/* <Space direction="vertical" style={{  outline: "none", border: "1px solid #f24e1e" }}>
              <DatePicker onChange={(e) => setMessage(e.target.value)} />

            </Space> */}
            <div className="emp-select-months-year">
              <div className="emp-select-month dflex">
                <select style={{ width: '124px', height: '30px', paddingRight: "12px", color: "#222" }} onChange={handleMonthChange} >
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

            </div>
          </div>
          <div className="col-md-9 d-flex gap-2" style={{ paddingLeft: "1.5rem" }}>

            <button style={{ height: "25px", width: "90px", borderRadius: "10px", background: "#f3f3fb", color: "#72757a", fontSize: "0.8rem", border: "1px solid #dcd2d2",boxShadow:"2px 2px 2px 1px rgba(0, 0, 255, .2)" }}>Late : {totalLate}</button>

            <button style={{ height: "25px", width: "90px", borderRadius: "10px", background: "#f3f3fb", color: "#72757a", fontSize: "0.8rem", border: "1px solid #dcd2d2",boxShadow:"2px 2px 2px 1px rgba(0, 0, 255, .2)" }}>Absent : {totalAbs}</button>

            <button style={{ height: "25px", width: "90px", borderRadius: "10px", background: "#f3f3fb", color: "#72757a", fontSize: "0.8rem", border: "1px solid #dcd2d2",boxShadow:"2px 2px 2px 1px rgba(0, 0, 255, .2)" }}>Half Day : {halfDayCount}</button>

          </div>

        </div>
      </div>
      {/* <div className="col">
            <h6>write concern</h6>

            <textarea onChange={(e) => setMessage(e.target.value)} />
          </div> */}

    </Modal>

    <div className="attendance-container">
      <div className="emp-profile">
        <div className="left-emp-profile">
          <div className="profileImg">
            <img src={userIcon} alt="" />
            <div className="emp-profile-title">
              <h6>{name}</h6>
              <p>{email}</p>
            </div>
            <h4>
              <HiOutlineDotsVertical />
            </h4>
          </div>
          <div className="empBtn">
            <button>+ BOOK LEAVE</button>
          </div>
        </div>
        <div className="right-emp-calender mb-4" style={{ marginTop: "10px" }}>
          <div className="calender-title">
            <h5 style={{ fontSize: "18px", fontWeight: "400" }}>Calender</h5>
            <div className="right-calender-title">
              <h6 style={{ color: "#FF560E", cursor: "pointer" }} onClick={showAttendance}>MONTHLY VIEW</h6>
              <a href="/attendance-list" style={{
                color: "#222"
              }}><h6>FULL CALENDER</h6></a>
              
            </div>
          </div>
          <div className="emp-dates">
            <div>
              <p>Today</p>
              <small>{moment().format('dddd, DD MMMM')}</small>
            </div>
            <div>
              <hr style={{ border: "1px solid #D9D9D9", width: "24vw" }} />
            </div>
            <div>
              <p>Tommorow</p>
              <small>{moment().add(1, 'day').format('dddd, DD MMMM')}</small>
            </div>
          </div>
        </div>
      </div>
      {/* -------emp--punch--cards----- */}

      <div className="emp-cards">


        <div className="emp-card"  >
          <div className="emp-punch-clock my-2 ">
            <h4>Punch Clock</h4>
            <img src={im3} alt="" />
          </div>
          <small>
            Click the button below to Punch In
          </small>
          <hr />

          <div className="emp-punchBtns">
            {filteredPunchin.length > 0 && filteredPunchin[0]?.punchin ? (
              <div className="punch-out-btn" onClick={handlePunchOut}><img src={img5} style={{ marginRight: "5px" }} alt="" />Punch Out</div>

            ) : (
              <div className="punch-in-btn" onClick={handlePunchIn}><img src={img4} style={{ marginRight: "5px" }} alt="" /> Punch In</div>

            )}

          </div>
          <div className="emp-locationBtns">
            <div className="location-id-btn"><img src={img6} alt="" />{userIP}</div>
            <div className="current-location-btn">Check my current location</div>
          </div>
          {/* <div className="empBtn my-2">
            <button>Forget to Punch</button>
          </div> */}
        </div>

        <div className="emp-card " >

          <div className="emp-punch-in-out-details" >
            <h6 className="my-2"><span style={{ color: "#0BC81E" }}>Punch in :</span>    {loading ? (
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : filteredPunchin.length > 0 ? (
              filteredPunchin[0].punchin
            ) : (
              punchin
            )}</h6>

            <h6 className="my-2"><span style={{ color: "#FF0707" }}>Punch Out :</span>
              {filteredPunchOut.length > 0 ? filteredPunchOut[0].punchOut : punchOut}
            </h6>
            <h6 className="my-2">Working Time : {timeDifference} </h6>
            <h6 className="my-2">IP Address : {userIP} </h6>
            <h6 className="my-2">Status : <span style={{ color: "#0BC81E" }}>   {filteredPunchOut.length > 0 ? (
              <span style={{ color: isLate ? 'red' : 'green' }}>
                {filteredPunchOut[0].status}
              </span>
            ) : (
              <span style={{ color: isLate ? 'red' : 'green' }}>
                {hidden ? (isLate ? 'LATE' : 'In Time') : null}
              </span>
            )} </span></h6>
          </div>

        </div>
        <div className="emp-card">
          <div className="emp-leave-balance p-2">
            <p>Leave Balances</p>
            <a href=""><img src={img7} alt="" /></a>
          </div>
          <table class="table">
            <thead>
              <tr>
                <th scope="col">Type</th>
                <th scope="col">Entitlement</th>
                <th scope="col">Used</th>
                <th scope="col">Balance</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Casual</td>
                <td>20h</td>
                <td>40h</td>
                <td>168h</td>
              </tr>
              <tr>
                <td>Casual</td>
                <td>20h</td>
                <td>40h</td>
                <td>168h</td>
              </tr>
              <tr>
                <td>Casual</td>
                <td>20h</td>
                <td>40h</td>
                <td>168h</td>
              </tr>
            </tbody>
          </table>
          <div className="show-other-balances">
            <h6>Show Other Balances</h6>
          </div>
        </div>
      </div>
      <div className="empBtn" style={{ display: 'flex', justifyContent: "flex-start", marginLeft: "10px" }}>
        <button style={{ width: "330px" }} onClick={showModal}>FORGET TO PUNCH?</button>
      </div>
    </div>
  </>;
};

export default EmployeeAttendance;

function getCurrentDateFormatted() {
  const currentDate = new Date()
  const day = currentDate.getDate()
  const month = currentDate.getMonth() + 1
  const year = currentDate.getFullYear()
  return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`
}

function isCheckinLate(checkinTime) {
  // Assuming threshold time is between 10:41:00 AM and 12:00:00 PM
  const startTime = moment('10:40:59 AM', 'hh:mm:ss A')
  const endTime = moment('7:59:00 PM', 'hh:mm:ss A')
  const checkin = moment(checkinTime, 'hh:mm:ss A')
  return checkin.isBetween(startTime, endTime)
}

// Example usage:
const lateCheckin = '08:40:00 PM' // Assuming the check-in time
console.log('LATE', isCheckinLate(lateCheckin)) // Should return true or false based on the check-in time
