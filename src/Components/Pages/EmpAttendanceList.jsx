import { useEffect, useState } from "react";
import { FaListUl } from "react-icons/fa";
import { FaFilter } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
// import '../style/EmpAttendanceList.css'
import { DatePicker, Space } from "antd";
import axios from "axios";
import { motion } from "framer-motion";
import moment from "moment";
// import "../style/Project.css"
const EmpAttendanceList = () => {
  const [date, setDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [attendanceList, setAttendanceList] = useState([]);
  const [absentCount, setAbsentCount] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [CompleteEndLate, setCompleteEndLate] = useState(0);
  const [completeEndHalfDay, setcompleteEndHalfDay] = useState(0);

  const Profile = localStorage.getItem("user");
  const NewProfile = JSON.parse(Profile);
  const user_id = NewProfile?._id;

  async function getEmpAttendanceData() {
    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_API
        }/attendancelist/${user_id}?month=${selectedMonth}${
          date ? `&date=${date}` : ""
        }`
      );
      setAttendanceList(res?.data?.data?.reverse());
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getEmpAttendanceData();
  }, [selectedMonth, date]);

  const formatTime = (date) => {
    const dateIst = new Date(date);
    dateIst.setHours(dateIst.getHours());
    dateIst.setMinutes(dateIst.getMinutes());
    return new Intl.DateTimeFormat("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(dateIst);
  };

  const formatTotalWorkingTime = (time) => {
    const totalWorkingTimeMinutes = time;
    const hours = Math.floor(totalWorkingTimeMinutes / 60);
    const minutes = Math.round(totalWorkingTimeMinutes % 60);
    return `${hours < 10 ? "0" + hours : hours}h ${
      minutes < 10 ? "0" + minutes : minutes
    }m`;
  };

  const filteredAttendanceList = attendanceList.filter((entry) => {
    const entryDate = moment(entry.currentDate).format("YYYY-MM-DD");
    const entryMonth = moment(entry.currentDate).month() + 1;

    if (selectedMonth && date) {
      return (
        entryMonth === selectedMonth &&
        entryDate === moment(date).format("YYYY-MM-DD")
      );
    }
    if (selectedMonth) {
      return entryMonth === selectedMonth;
    }
    if (date) {
      return entryDate === moment(date).format("YYYY-MM-DD");
    }
    return true;
  });

  const isWeekday = (date) => {
    const day = moment(date).day();
    return day >= 1 && day <= 5;
  };

  useEffect(() => {
    const calculateAbsences = () => {
      const absentDates = new Set();
      const today = moment().startOf("day");

      const selectedStart = moment()
        .set("month", selectedMonth - 1)
        .startOf("month");
      const selectedEnd = moment.min(
        today,
        selectedStart.clone().endOf("month")
      );

      for (
        let m = selectedStart;
        m.isSameOrBefore(selectedEnd, "day");
        m.add(1, "day")
      ) {
        if (isWeekday(m)) {
          const formattedDate = m.format("YYYY-MM-DD");
          const isAbsent = !attendanceList.some(
            (entry) =>
              moment(entry.currentDate).format("YYYY-MM-DD") === formattedDate
          );

          if (isAbsent) {
            absentDates.add(formattedDate);
          }
        }
      }

      setAbsentCount(absentDates.size);
    };

    calculateAbsences();
  }, [attendanceList, selectedMonth]);

  useEffect(() => {
    const calculateTotals = () => {
      let totalLate = 0;
      let totalHalfDay = 0;

      filteredAttendanceList.forEach((entry) => {
        if (entry.status === "Late") {
          totalLate += 1;
        }
        if (entry.workStatus === "Half Day") {
          totalHalfDay += 1;
        }
      });

      setCompleteEndLate(totalLate);
      setcompleteEndHalfDay(totalHalfDay);
    };

    calculateTotals();
  }, [filteredAttendanceList]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleMonthChange = (event) => {
    const month = parseInt(event.target.value, 10); // Convert selected month to a number
    setSelectedMonth(month);
  };

  return (
    <>
      <div className="employee-project-container container">
        {/* <h6 className="py-4" >Attendance List</h6> */}
        <div className="emp-select-months-year">
          <div className="emp-select-month">
            <select
              style={{
                width: "124px",
                height: "30px",
                paddingRight: "12px",
                color: "#222",
              }}
              onChange={handleMonthChange} // Make sure the month is updated as a number
            >
              <option value="">Select Month</option>
              <option value="1">Jan</option>
              <option value="2">Feb</option>
              <option value="3">Mar</option>
              <option value="4">Apr</option>
              <option value="5">May</option>
              <option value="6">Jun</option>
              <option value="7">Jul</option>
              <option value="8">Aug</option>
              <option value="9">Sep</option>
              <option value="10">Oct</option>
              <option value="11">Nov</option>
              <option value="12">Dec</option>
            </select>
          </div>
          <div
            className="emp-select-month"
            style={{ width: "123px", paddingRight: "0.2rem", height: "34px" }}
          >
            <input
              onChange={(e) => setDate(e.target.value)}
              style={{ width: "118px", height: "30px", color: "#222" }}
              type="date"
            />
          </div>
        </div>
        <hr />

        <div class="tab-content" id="pills-tabContent">
          <div
            class="tab-pane fade show active table-responsive"
            id="pills-activeproject-home"
            role="tabpanel"
            aria-labelledby="pills-activeproject-home"
            tabindex="0"
          >
            <div className="project-title my-2">
              <div className="allproject">
                <h6>All Details</h6>
              </div>
              {!date && (
                <div className="list-of-days">
                  <div className="emp-holidays-btn">
                    <button
                      style={{
                        height: "25px",
                        width: "300px",
                        borderRadius: "10px",
                        background: "#f3f3fb",
                        color: "#72757a",
                        fontSize: "0.8rem",
                        border: "1px solid #dcd2d2",
                      }}
                    >
                      Late :{CompleteEndLate}
                    </button>
                    <button
                      style={{
                        height: "25px",
                        width: "300px",
                        borderRadius: "10px",
                        background: "#f3f3fb",
                        color: "#72757a",
                        fontSize: "0.8rem",
                        border: "1px solid #dcd2d2",
                      }}
                    >
                      Absent :{absentCount}
                    </button>
                    <button
                      style={{
                        height: "25px",
                        width: "330px",
                        borderRadius: "10px",
                        background: "#f3f3fb",
                        color: "#72757a",
                        fontSize: "0.8rem",
                        border: "1px solid #dcd2d2",
                      }}
                    >
                      Half Day :{completeEndHalfDay}
                    </button>
                  </div>
                  {/* <div className="sort">
                    <input
                      value={searchTerm}
                      onChange={handleSearchChange}
                      placeholder="search"
                      style={{
                        height: "20px",
                        height: "5vh",
                        marginLeft: "10px",
                        paddingLeft: "5px",
                        borderRadius: "6px",
                        outline: "none",
                        width: "70%",
                        boxShadow: " 1px 1px 2px 1px gray",
                        border: "none",
                      }}
                    />
                  </div> */}
                </div>
              )}
            </div>
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th scope="col">Date</th>
                  <th scope="col">Punch In</th>
                  <th scope="col">Punch out</th>
                  <th scope="col">Production</th>

                  <th scope="col">
                    <span style={{ marginRight: "2px" }}>
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12.3538 1.64712C11.9282 1.22241 11.3515 0.983887 10.7503 0.983887C10.1491 0.983887 9.57237 1.22241 9.1468 1.64712L4.8968 5.89712C4.84189 5.95186 4.80047 6.01862 4.7758 6.09212L3.5258 9.84212C3.49635 9.9302 3.49201 10.0247 3.51327 10.1151C3.53453 10.2055 3.58054 10.2882 3.64616 10.354C3.71177 10.4197 3.7944 10.4658 3.88476 10.4872C3.97513 10.5086 4.06968 10.5044 4.1578 10.4751L7.9078 9.22512C7.98166 9.20059 8.04877 9.15916 8.1038 9.10412L12.3538 4.85412C12.7785 4.42855 13.017 3.85187 13.017 3.25062C13.017 2.64938 12.7785 2.0727 12.3538 1.64712ZM10.9868 7.63512C10.9955 7.75512 10.9998 7.87679 10.9998 8.00012C10.9997 9.00458 10.6971 9.98573 10.1314 10.8157C9.56573 11.6457 8.76316 12.2861 7.82828 12.6535C6.8934 13.0208 5.86956 13.098 4.89016 12.8751C3.91075 12.6522 3.02119 12.1394 2.33737 11.4037C1.65356 10.668 1.20719 9.7433 1.05643 8.75023C0.905677 7.75715 1.05752 6.74169 1.49217 5.83615C1.92682 4.93061 2.62414 4.17697 3.49326 3.67343C4.36239 3.1699 5.36302 2.9398 6.3648 3.01312L7.2488 2.13012C5.98313 1.86102 4.66439 2.00829 3.48926 2.54997C2.31414 3.09164 1.34562 3.9987 0.728165 5.13583C0.110709 6.27296 -0.122591 7.57924 0.0630632 8.85981C0.248718 10.1404 0.843378 11.3266 1.75834 12.2416C2.67331 13.1565 3.85955 13.7512 5.14012 13.9369C6.42068 14.1225 7.72696 13.8892 8.86409 13.2718C10.0012 12.6543 10.9083 11.6858 11.45 10.5107C11.9916 9.33554 12.1389 8.01679 11.8698 6.75112L10.9868 7.63512Z"
                          fill="#959595"
                        />
                      </svg>
                    </span>
                    Status
                  </th>
                  <th scope="col">IP Address</th>
                  <th scope="col">Work Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendanceList?.map((res, index) => {
                  const firstPunchIn =
                    res.punches[0]?.punchIn &&
                    formatTime(res.punches[0].punchIn);

                  const lastPunchout = res.punches[res.punches.length - 1]
                    ?.punchOut
                    ? res.punches[res?.punches.length - 1]?.punchOut
                    : res.punches[res?.punches.length - 2]?.punchOut &&
                      res.punches[res?.punches?.length - 2].punchOut;

                  const formattedCuurentDate = moment(res.currentDate).format(
                    "MMM-Do-YYYY"
                  );

                  return (
                    <tr key={res._id}>
                      <td>{formattedCuurentDate}</td>

                      <td>{firstPunchIn}</td>
                      <td>
                        {" "}
                        {lastPunchout
                          ? formatTime(lastPunchout)
                          : "Punch Out not Done"}
                      </td>
                      <td>
                        {res?.totalWorkingTime
                          ? formatTotalWorkingTime(res.totalWorkingTime)
                          : "0"}
                      </td>
                      <td
                        style={{
                          color:
                            res.status === "LATE"
                              ? "goldenrod"
                              : res.status === "Week Off"
                              ? "blue"
                              : res.status === "Absent"
                              ? "red"
                              : "green",
                        }}
                      >
                        {res.status}
                      </td>
                      <td>{res.ip}</td>
                      <td>{res.workStatus}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmpAttendanceList;
