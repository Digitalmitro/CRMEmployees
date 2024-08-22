
import { useEffect, useState } from 'react'
import { FaListUl } from "react-icons/fa";
import { FaFilter } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
// import '../style/EmpAttendanceList.css'
import { DatePicker, Space } from 'antd';
import axios from 'axios'
import { motion } from 'framer-motion'
import moment from 'moment';
// import "../style/Project.css"
const EmpMonthView = () => {

  const [selectedMonth, setSelectedMonth] = useState('')
  const [date, setDate] = useState("")
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Function to handle the change in the select input
  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value)
  }

  const Profile = localStorage.getItem('user')
  const NewProfile = JSON.parse(Profile)
  const user_id = NewProfile?._id

  const [attendanceData, setAttendanceData] = useState([])
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

  useEffect(() => {
    getData()
  }, [selectedMonth])

  const totalLate = filteredData?.filter((e) => e.status === "LATE").length
  const totalAbs = filteredData?.filter((e) => e.status === "Absent").length
  // Calculate half day count
  const halfDayCount = filteredData?.filter((entry) => {
    if (entry.status === 'Week Off' || entry.status === 'Absent') {
      return false;
    }

    const punchInTime = moment(entry.punchin, 'h:mm:ss A');
    const punchOutTime = moment(entry.punchOut, 'h:mm:ss A');

    const duration = moment.duration(punchOutTime.diff(punchInTime)).asHours();
    return duration < 7 && duration > 0;
  }).length;

  // this one is for antdesign date
  const onChange = (date, dateString) => {
    console.log(date, dateString);
  };
  return (
    <>
      <div className="employee-project-container container">
        {/* <h6 className="py-4" >Attendance List</h6> */}
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

        <div class="tab-content" id="pills-tabContent">
          <div class="tab-pane fade show active table-responsive" id="pills-activeproject-home" role="tabpanel" aria-labelledby="pills-activeproject-home" tabindex="0">
            <div className="project-title my-2">
              <div className="allproject">
                <h6>All Details</h6>
              </div>
              <div className="list-of-days">
                
                <div className="emp-holidays-btn">
                <button style={{ height: "25px", width: "90px", borderRadius: "10px", background: "#f3f3fb", color: "#72757a", fontSize: "0.8rem", border: "1px solid #dcd2d2" }}>Late : {totalLate}</button>
                  <button style={{ height: "25px", width: "90px", borderRadius: "10px", background: "#f3f3fb", color: "#72757a", fontSize: "0.8rem", border: "1px solid #dcd2d2" }}>Absent : {totalAbs}</button>
                  <button style={{ height: "25px", width: "90px", borderRadius: "10px", background: "#f3f3fb", color: "#72757a", fontSize: "0.8rem", border: "1px solid #dcd2d2" }}>Half Day : {halfDayCount}</button>
                </div>
                <div className="sort"  >

                  {/* <button><FaFilter style={{ color: "FF560E", fontSize: "0.8rem" }} /> </button> */}
                    <input
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="search"
                            
                            style={{ height: '20px',height:"5vh", marginLeft: '10px',paddingLeft:"5px",borderRadius:"6px",outline:"none",width:"70%",boxShadow:" 1px 1px 2px 1px gray",border:"none" }}
                        />
                 

                </div>
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
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th scope="col">Date</th>
                  <th scope="col">Punch In</th>
                  <th scope="col">Punch out</th>
                  <th scope="col">Production</th>


                  <th scope="col"><span style={{ marginRight: "2px" }}><svg width="10" height="10" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.3538 1.64712C11.9282 1.22241 11.3515 0.983887 10.7503 0.983887C10.1491 0.983887 9.57237 1.22241 9.1468 1.64712L4.8968 5.89712C4.84189 5.95186 4.80047 6.01862 4.7758 6.09212L3.5258 9.84212C3.49635 9.9302 3.49201 10.0247 3.51327 10.1151C3.53453 10.2055 3.58054 10.2882 3.64616 10.354C3.71177 10.4197 3.7944 10.4658 3.88476 10.4872C3.97513 10.5086 4.06968 10.5044 4.1578 10.4751L7.9078 9.22512C7.98166 9.20059 8.04877 9.15916 8.1038 9.10412L12.3538 4.85412C12.7785 4.42855 13.017 3.85187 13.017 3.25062C13.017 2.64938 12.7785 2.0727 12.3538 1.64712ZM10.9868 7.63512C10.9955 7.75512 10.9998 7.87679 10.9998 8.00012C10.9997 9.00458 10.6971 9.98573 10.1314 10.8157C9.56573 11.6457 8.76316 12.2861 7.82828 12.6535C6.8934 13.0208 5.86956 13.098 4.89016 12.8751C3.91075 12.6522 3.02119 12.1394 2.33737 11.4037C1.65356 10.668 1.20719 9.7433 1.05643 8.75023C0.905677 7.75715 1.05752 6.74169 1.49217 5.83615C1.92682 4.93061 2.62414 4.17697 3.49326 3.67343C4.36239 3.1699 5.36302 2.9398 6.3648 3.01312L7.2488 2.13012C5.98313 1.86102 4.66439 2.00829 3.48926 2.54997C2.31414 3.09164 1.34562 3.9987 0.728165 5.13583C0.110709 6.27296 -0.122591 7.57924 0.0630632 8.85981C0.248718 10.1404 0.843378 11.3266 1.75834 12.2416C2.67331 13.1565 3.85955 13.7512 5.14012 13.9369C6.42068 14.1225 7.72696 13.8892 8.86409 13.2718C10.0012 12.6543 10.9083 11.6858 11.45 10.5107C11.9916 9.33554 12.1389 8.01679 11.8698 6.75112L10.9868 7.63512Z" fill="#959595" />
                  </svg>
                  </span>Status</th>
                  <th scope="col">IP Address</th>
                </tr>
              </thead>
              <tbody>

                {filteredData?.map((res, index) => {
                  return (
                    <tr key={res._id}>
                      <td>{res.currentDate}</td>
                      <td>{res.punchin}</td>
                      <td>{res.punchOut}</td>
                      <td>{res.time}</td>
                      <td
                        style={{
                          
                          color: res.status === 'LATE' ? 'goldenrod' : res.status === 'Week Off' ? 'blue' : res.status === 'Absent' ? 'red' : 'green',
                        }}
                      >
                        {res.status}
                      </td>
                      <td>{res.ip}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

          </div>


        </div>
      </div>
    </>
  )
}

export default EmpMonthView