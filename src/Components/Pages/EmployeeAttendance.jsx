import React, { useState, useEffect } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import img2 from "../../assets/Vector.png";
import im3 from "../../assets/Vector3.png";
import userIcon from "../../assets/usericon.png";
import img4 from "../../assets/Vector4.png";
import img5 from "../../assets/Vector5.png";
import img6 from "../../assets/Vector6.png";
import img7 from "../../assets/helpicon.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Push from "push.js";
import DM from "../../assets/logo.png";
import {
  Modal,
  Button,
  Form,
  Input,
  Row,
  Col,
  DatePicker,
  message,
  TimePicker,
  Space,
} from "antd";

const userToken = localStorage.getItem("userToken");
const Profile = localStorage.getItem("user");
const NewProfile = JSON.parse(Profile);
const name = NewProfile?.name;
const email = NewProfile?.email;
const user_id = NewProfile?._id;

const EmployeeAttendance = () => {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAttendanceOpen, setIsAttendance] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [callApi, setCallApi] = useState(false);
  const [loading, setLoading] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState("");
  const toggle = () => setIsOpen(!isOpen);

  const [concernData, setConcernData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [userIP, setUserIP] = useState(null);
  const [data, setData] = useState([]);
  const [form] = Form.useForm();
  const [form1] = Form.useForm();

  const [punchStatus, setPunchStatus] = useState("");
  const [isPunchInDone, setIsPunchInDone] = useState(false);
  const [Punchmessage, setPunchMessage] = useState("");
  const [showFinalPunchOut, setshowFinalPunchOut] = useState("");
  const [todaysAttendance, setTodaysAttendence] = useState();
  const [attendanceInfo, setAttendanceInfo] = useState({
    firstPunchIn: null,
    LastpunchOut: null,
    totalWorkingTime: null,
    workStatus: null,
    status: null,
  });

  const [punchDate, setPunchDate] = useState("");

  const showLeaveModal = () => {
    setIsModalVisible(true);
  };
  const handleLeaveCancel = () => {
    setIsModalVisible(false);
  };

  const disabledDate = (current) => {
    console.log("current", current);
    // Can not select today and future dates
    return current && current >= moment().startOf("day");
  };

  const handleLeaveSubmit = async (values) => {
    try {
      const { leaveConcern, date } = values;

      const formattedDate = moment(date.$d).format("MMMM Do YYYY");
      console.log("date", formattedDate);

      // const user_id =user_id;
      const payload = {
        name: name,
        email: email,
        message: leaveConcern,
        date: formattedDate,
        status: "pending",
        concernType: "Leave Application",
        user_id,
      };
      // Send POST request to the server
      await axios.post(`${import.meta.env.VITE_BACKEND_API}/concern`, payload, {
        headers: { token: userToken },
      });
      setCallApi(!callApi);
      message.success("Concern Created and associated with Admin");
      form.resetFields();
      setIsModalVisible(false);
    } catch (error) {
      message.error("Failed to create concern");
      console.error(error);
    }
  };

  const checkPunchStatus = async () => {
    await axios
      .get(`${import.meta.env.VITE_BACKEND_API}/attendance/status/${user_id}`, {
        headers: { token: userToken },
      })
      .then((res) => {
        console.log(res.data);
        setIsPunchInDone(res.data.isPunchedIn);
      })
      .catch((e) => {
        console.log(e.response);
      });
  };

  const showModal = () => {
    setIsModalOpen(true);
  };
  const showAttendance = () => {
    setIsAttendance(true);
  };
  const handleOk = async () => {
    setIsModalOpen(false);
    // postConcernData();
  };
  const handledOk = async () => {
    setIsAttendance(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleCancels = () => {
    setIsAttendance(false);
  };

  const handleChange = (date, dateString) => {
    console.log(date, dateString);
  };
  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  function handleLoading() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 750);
  }

  async function getData() {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_API}/attendance/${user_id}`
      );
      setAttendanceData(res.data?.attendance);
    } catch (err) {
      console.log(err);
    }
  }

  async function getEmpAttendanceData() {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_API}/attendancelist/${user_id}`
      );
      // setAttendanceData(res.data?.attendance);
      console.log("attendencelist", res.data);
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    getEmpAttendanceData();
  }, []);

  async function getTodayAttendance() {
    const currentDate = new Date().toISOString();
    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_API
        }/todays-attendence?user_id=${user_id}&currentDate=${currentDate}`,
        { headers: { token: userToken } }
      );
      setTodaysAttendence(res?.data);

      const convertToIST = (utcDate) => {
        const date = new Date(utcDate);
        // Convert to IST (UTC+5:30)
        date.setHours(date.getHours());
        date.setMinutes(date.getMinutes());
        return date;
      };

      const formatTime = (date) => {
        return new Intl.DateTimeFormat("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }).format(date);
      };

      if (res?.data) {
        const workingStatus = res?.data?.workStatus;
        const status = res?.data?.status;
        setAttendanceInfo((prev) => ({ ...prev, workStatus: workingStatus }));
        setAttendanceInfo((prev) => ({ ...prev, status: status }));
        const punchesList = res.data?.punches;
        if (punchesList?.length > 0) {
          const showPunchIn = punchesList[0]?.punchIn;
          const punchInData = convertToIST(showPunchIn);
          const formattedPunchIn = formatTime(punchInData);
          // setfirstPunchIn(formattedPunchIn)
          setAttendanceInfo((prev) => ({
            ...prev,
            firstPunchIn: formattedPunchIn,
          }));

          if (punchesList[punchesList.length - 1]?.punchOut) {
            let showPunchOut = convertToIST(
              punchesList[punchesList.length - 1]?.punchOut
            );
            const formatedPunchOut = formatTime(showPunchOut);

            setAttendanceInfo((prev) => ({
              ...prev,
              LastpunchOut: formatedPunchOut,
            }));
            // setIsPunchInDone(true)
          } else {
            setAttendanceInfo((prev) => ({ ...prev, LastpunchOut: "" }));
          }
        }

        const totalWorkingTimeMinutes = res.data?.totalWorkingTime; // Example value in minutes
        const hours = Math.floor(totalWorkingTimeMinutes / 60); // Calculate hours
        const minutes = Math.round(totalWorkingTimeMinutes % 60);
        const formatedWorkingTime = `${
          hours < 1 ? "00" : hours < 10 ? "0" + hours : hours
        }h   ${minutes}m`;
        setAttendanceInfo((prev) => ({
          ...prev,
          totalWorkingTime: formatedWorkingTime,
        }));
      } else {
        console.log("no data available");
      }

      // setAttendanceData(res.data?.attendance);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getTodayAttendance();
  }, []);

  useEffect(() => {
    checkPunchStatus();
  }, [isPunchInDone]);

  const getIp = async () => {
    // Fetch user's IP address
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    setUserIP(data.ip);
  };

  const getConcernData = async () => {
    try {
      const ConcernRes = await axios.get(
        `${import.meta.env.VITE_BACKEND_API}/concern/${user_id}`,
        {
          headers: { token: userToken },
        }
      );
      setConcernData(ConcernRes.data.reverse());
    } catch (err) {
      console.log(err);
    }
  };

  // const postConcernData = async () => {
  //   const payload = {
  //     name,
  //     email,
  //     message: Punchmessage,
  //     date: punchDate,
  //     punchType: punchStatus,
  //     status: "Pending",
  //     user_id,
  //   };
  //   try {
  //     const res = await axios.post(
  //       `${import.meta.env.VITE_BACKEND_API}/concern`,
  //       payload,
  //       {
  //         headers: {
  //           token: userToken,
  //         },
  //       }
  //     );
  //     toast.info(res.data, {});
  //     getConcernData();
  //   } catch (error) {
  //     console.log(err);
  //   }
  // };

  const onFinish1 = async (values) => {
    const { ConcernDate, ActualPunchIn, ActualPunchOut, ConcernMessage } =
      values;

    // if no punchin is selected
    const defaultPunchIn = NewProfile?.type === "Day" ? "10:30 AM" : "08:00 PM";
    const defaultPunchOut =
      NewProfile?.type === "Day" ? "07:30 PM" : "05:00 AM";

    const formattedActualPunchIn = ActualPunchIn
      ? moment(ActualPunchIn.$d).format("h:mm:ss a")
      : moment(defaultPunchIn, "hh:mm A").format("h:mm:ss a");
    const formattedActualPunchOut = ActualPunchOut
      ? moment(ActualPunchOut.$d).format("h:mm:ss a")
      : moment(defaultPunchOut, "hh:mm A").format("h:mm:ss a");

    const payload = {
      name,
      email,
      concernType: "Regularization Request",
      message: ConcernMessage,
      shiftType: NewProfile?.type,
      ActualPunchIn: formattedActualPunchIn,
      ActualPunchOut: formattedActualPunchOut,
      date: moment(ConcernDate.$d).format("MMMM Do YYYY"),
      status: "Pending",
      // ConcernDate: moment(ConcernDate.$d).format("MMMM Do YYYY"),
      user_id,
    };
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/concern`,
        payload,
        {
          headers: {
            token: userToken,
          },
        }
      );
      Push.create(`Hey ${name}`, {
        body: `You have successfully Raised Concern`,
        icon: `${DM}`,
      });
      message.info(res.data.message);
      const noti = {
        message: `${NewProfile?.name} Raised a Concern`,
        Status: false,
        currentDate: moment().format("MMMM Do YYYY, h:mm:ss a"),
        Date: moment().format("MMMM Do YYYY, h:mm:ss a"),
      };
      form1.resetFields();
      try {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_API}/notification`,
          noti
        ); // Assuming your API response has a message field
      } catch (err) {
        console.log(err);
      }
      getConcernData();
      setCallApi(!callApi);
      handleOk();
    } catch (error) {
      console.error(error);
      message.error("An error occurred while submitting the form");
    }
  };

  const handlePunchIn = async () => {
    const istTime = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    });
    const istDate = new Date(istTime);
    const currentTime = istDate.toISOString();

    setPunchin(currentTime);

    let isLate;
    if (attendanceInfo.firstPunchIn === null) {
      isLate = checkinTime(currentTime);
      console.log("IS LATE -->", isLate);
    }

    const currentDate = istDate.toISOString();

    // Build the request payload
    const payload = {
      userName: name,
      userEmail: email,
      shiftType: NewProfile?.type,
      punches: [
        {
          punchIn: currentTime,
        },
      ],
      currentDate,
      ip: userIP,
      user_id,
    };

    // Conditionally add the status field if isLate is defined
    if (isLate !== undefined) {
      payload.status = isLate ? "Late" : "On Time";
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/attendance`,
        payload
      );
      checkPunchStatus();
      getTodayAttendance();

      setHidden(true);
      handleLoading();
    } catch (error) {
      console.error("Error sending checkin data:", error);
    }
  };

  const handlePunchOut = async () => {
    const istTime = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    });
    // Convert to ISO 8601 format by parsing and formatting it
    const istDate = new Date(istTime);
    const currentTime = istDate.toISOString();
    setPunchin(currentTime);

    const currentDate = istDate.toISOString();
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_API}/punchout`,
        {
          punchOut: currentTime,
          currentDate,
          shiftType: NewProfile?.type,
          user_id,
        }
      );
      checkPunchStatus();
      // setAttendanceInfo(prev => ({ ...prev, LastpunchOut: formatedPunchOut }));

      getTodayAttendance();

      setHidden(false);
      getData();
    } catch (error) {
      console.error("Error sending checkout data:", error);
    }
    getData();
    setCheckoutClicked(true);
  };

  // const [date, setDate] = useState("");
  const [halfDayToday, setHalfDayToday] = useState(false);
  //model
  const [msgDate, setMsgDate] = useState("");
  const [leaveConcern, setleaveConcern] = useState("");

  const groupedDatas = Object.values(
    attendanceData?.reduce((acc, curr) => {
      // Group entries by currentDate
      const currentDate = curr.currentDate;
      if (!acc[currentDate]) {
        acc[currentDate] = {
          currentDate,
          userName: "",
          userEmail: "",
          punchin: "",
          punchOut: "",
          time: "",
          status: "",
          ip: "",
        };
      }

      // Merge punchin, punchOut, status, and ip
      if (curr.userName) {
        acc[currentDate].userName = curr.userName;
      }
      if (curr.userEmail) {
        acc[currentDate].userEmail = curr.userEmail;
      }
      if (curr.punchin) {
        acc[currentDate].punchin = curr.punchin;
      }
      if (curr.punchOut) {
        acc[currentDate].punchOut = curr.punchOut;
      }
      if (curr.time) {
        acc[currentDate].time = curr.time;
      }
      if (curr.status) {
        acc[currentDate].status = curr.status;
      }
      if (curr.ip) {
        acc[currentDate].ip = curr.ip;
      }

      return acc;
    }, {})
  );
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
            ip: "",
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
            ip: "",
          });
        }
      }
    }
  });
  // Merge the original data with the added weekend and weekday entries
  const finalDatas = [...groupedDatas, ...weekendEntriess, ...weekdayEntriess];
  // Sort the data by currentDate
  finalDatas.sort(
    (a, b) =>
      moment(a.currentDate, "MMM Do YY").valueOf() -
      moment(b.currentDate, "MMM Do YY").valueOf()
  );

  const totalLate = finalDatas?.filter((e) => e.status === "LATE").length;
  const totalAbs = finalDatas?.filter((e) => e.status === "Absent").length;
  // Calculate half day count

  const halfDayCount = finalDatas?.filter((entry) => {
    if (entry.status === "Week Off" || entry.status === "Absent") {
      return false;
    }

    const punchInTime = moment(entry.punchin, "h:mm:ss A");
    const punchOutTime = moment(entry.punchOut, "h:mm:ss A");
    console.log("count", entry.punchin, entry.punchOut);
    const duration = moment.duration(punchOutTime.diff(punchInTime)).asHours();
    console.log("duraction", duration);
    return duration < 7 && duration > 0;
  }).length;

  // location tracker
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [locationPermission, setLocationPermission] = useState(false);
  const [iframe, setIframe] = useState(false);

  const [percent, setPercent] = useState(29);

  const status = percent === 100 ? "success" : percent <= 29 ? "red" : "active";
  const color = percent === 100 ? "#52c41a" : percent <= 29 ? "red" : "#ffc107";

  const [hide, setHide] = useState(false);

  const [punchin, setPunchin] = useState("");
  const [punchOut, setPunchOut] = useState("");

  const [timeDifferenceMinutes, setTimeDifferenceMinutes] = useState(0);

  const [checkoutClicked, setCheckoutClicked] = useState(false);

  const currentDate = moment().format("MMM Do YY");
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setLocationPermission(true);
        },
        (error) => {
          console.log("Error getting location:", error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };
  // Add missing weekend days between the data
  const weekendEntries = [];
  const weekdayEntries = [];

  const groupedData = Object.values(
    attendanceData.reduce((acc, curr) => {
      // Group entries by currentDate
      const currentDate = curr.currentDate;
      // console.log("Current:", curr);
      if (!acc[currentDate]) {
        acc[currentDate] = {
          currentDate,
          userName: "",
          userEmail: "",
          punchin: "",
          punchOut: "",
          time: "",
          status: "",
          ip: "",
        };
      }

      // Merge punchin, punchOut, status, and ip
      if (curr.userName) {
        acc[currentDate].userName = curr.userName;
      }
      if (curr.userEmail) {
        acc[currentDate].userEmail = curr.userEmail;
      }
      if (curr.punchin) {
        acc[currentDate].punchin = curr.punchin;
      }
      if (curr.punchOut) {
        acc[currentDate].punchOut = curr.punchOut;
      }
      if (curr.time) {
        acc[currentDate].time = curr.time;
      }
      if (curr.status) {
        acc[currentDate].status = curr.status;
      }
      if (curr.ip) {
        acc[currentDate].ip = curr.ip;
      }

      return acc;
    }, {})
  );
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
            ip: "",
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
            ip: "",
          });
        }
      }
    }
  });
  // Merge the original data with the added weekend and weekday entries
  const finalData = [...groupedData, ...weekendEntries, ...weekdayEntries];
  // Sort the data by currentDate
  finalData.sort(
    (a, b) =>
      moment(a.currentDate, "MMM Do YY").valueOf() -
      moment(b.currentDate, "MMM Do YY").valueOf()
  );
  // // Filter the data based on the selected month and date
  // const filteredData = finalData.filter((entry) => {
  //   // Check if the entry's currentDate includes the selected month
  //   if (!entry.currentDate.includes(selectedMonth)) {
  //     return false;
  //   }
  //   // Check if the entry's currentDate matches the selected date
  //   const formattedDate = moment(date).format("MMM Do YY");
  //   if (date && entry.currentDate === formattedDate) {
  //     return true;
  //   }
  //   // If no date is selected, return true to include all entries for the selected month
  //   return !date;
  // });

  const calculateTimeDifference = (time1, time2) => {
    const format = "hh:mm:ss A";
    const time1Date = new Date("2000-01-01 " + time1);
    const time2Date = new Date("2000-01-01 " + time2);

    // Get the difference in milliseconds
    let difference = Math.abs(time2Date - time1Date);

    // Convert milliseconds to hours, minutes, seconds
    let hours = Math.floor(difference / 3600000);
    difference -= hours * 3600000;
    let minutes = Math.floor(difference / 60000);
    difference -= minutes * 60000;
    let seconds = Math.floor(difference / 1000);

    return `${hours}:${minutes}:${seconds}`;
  };

  let filteredPunchin = [];
  if (data) {
    filteredPunchin = data.filter(
      (entry) =>
        entry.hasOwnProperty("punchin") &&
        !entry.hasOwnProperty("punchOut") &&
        entry.currentDate === currentDate
    );
  }
  // console.log(
  //   "punchin",
  //   filteredPunchin.length > 0 ? filteredPunchin : "No data available"
  // );
  let filteredPunchOut = [];
  if (data) {
    filteredPunchOut = data
      .filter(
        (entry) =>
          entry.hasOwnProperty("punchOut") &&
          !entry.hasOwnProperty("punchin") &&
          entry.currentDate === currentDate
      )
      .map((entry) => ({ ...entry, currentDate: getCurrentDateFormatted() }));
  }
  // console.log(data);
  // console.log(
  //   "punchout",
  //   filteredPunchOut.length > 0 ? filteredPunchOut : "No data available"
  // );
  let filteredTime = [];
  if (data) {
    filteredTime = data
      .filter((entry) => entry.hasOwnProperty("time"))
      .map((entry) => ({ ...entry, currentDate: getCurrentDateFormatted() }));
  }
  // console.log(
  //   "time",
  //   filteredTime.length > 0 ? filteredTime[0].time : "No data available"
  // );
  // console.log("test");
  // const isLate =
  // filteredPunchin.length > 0 && isCheckinLate(filteredPunchin[0].punchin);
  let timeDifference = null;
  if (filteredPunchin.length > 0 && filteredPunchOut.length > 0) {
    // Assuming filteredPunchin and filteredPunchOut are arrays containing login and logout times respectively
    timeDifference = calculateTimeDifference(
      filteredPunchin[0].punchin,
      filteredPunchOut[0].punchOut
    );
    // console.log("Time Difference (minutes):", timeDifference);
    const currentDate = moment().format("MMM Do YY");
    try {
      const response = axios.post(
        `${import.meta.env.VITE_BACKEND_API}/attendance`,
        {
          currentDate,
          time: timeDifference,
          user_id,
        }
      );
      // console.log(response.data);
    } catch (error) {
      console.error("Error sending checkout data:", error);
    }
  }

  const isTodayHalfDay = (punchin, punchOut) => {
    const today = moment().startOf("day"); // Start of today (midnight)
    const punchInTime1 = moment(punchin, "h:mm:ss A");
    const punchOutTime1 = moment(punchOut, "h:mm:ss A");
    console.log("time1 ", punchInTime1, punchOutTime1);
    const duration1 = moment
      .duration(punchOutTime1.diff(punchInTime1))
      .asHours();
    // const duration = moment.duration(punchOutTime1.diff(punchInTime1)).asHours();
    console.log("today ", duration1);
    // Check if both punch-in and punch-out are from today
    if (duration1 < 7 && duration1 > 0) {
      // Check if the duration is less than 7 hours
      return true;
    }
    return false; // Not a half-day if the punches are not from today
  };
  // Usage example
  const punchinDay = filteredPunchin[0]?.punchin;
  const punchOutDay = filteredPunchOut[0]?.punchOut;
  // const isHalfDayToday = punchinDay && punchOutDay && isTodayHalfDay(punchinDay, punchOutDay);
  // console.log("ehejhg", punchinDay, punchOutDay)
  // if (isHalfDayToday) {
  //   setHalfDayToday(true)
  //   console.log("half day.");
  // } else {
  //   console.log("full day.");
  // }

  useEffect(() => {
    getData();
    // getAttData();
    getIp();
    getLocation();

    if (punchin && punchOut)
      setTimeDifferenceMinutes(calculateTimeDifference(punchin, punchOut));
    if (!userToken) return navigate("/login");
  }, [
    userToken,
    punchin,
    punchOut,
    currentDate,
    timeDifferenceMinutes,
    userIP,
    selectedMonth,
  ]);

  // useEffect(() => {
  //   getData();
  // }, []);

  //   useEffect(() => {
  //  localStorage.setItem("isPunchInDone", JSON.stringify(isPunchInDone))
  //   }, [handlePunchOut]);

  // useEffect(() => {
  //   const storePunchBoolean = JSON.parse(localStorage.getItem("isPunchInDone"));
  //   if (storePunchBoolean !== null) {
  //     setIsPunchInDone(storePunchBoolean);
  //   }
  // }, [isPunchInDone]);

  useEffect(() => {
    getConcernData();
  }, [callApi]);

  return (
    <>
      {/* modal */}
      <Modal
        title="Drop a message"
        centered
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form1} layout="vertical" onFinish={onFinish1}>
          <Row gutter={16}>
            <Col span={11}>
              <Form.Item
                name="ConcernDate"
                label="Concern Date"
                rules={[
                  {
                    required: true,
                    message: "Enter Concern Date",
                  },
                ]}
              >
                <DatePicker
                  placeholder="Select Concern Date"
                  disabledDate={disabledDate}
                  format="YYYY-MM-DD"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={11}>
              <Form.Item
                name="ActualPunchIn"
                label="Actual In Time"
                rules={[
                  {
                    message: "Enter In Time",
                  },
                ]}
              >
                <TimePicker
                  placeholder="Select Actual In Time"
                  defaultValue={
                    NewProfile?.type === "Day"
                      ? moment("10:30 AM", "hh:mm:ss A")
                      : moment("08:00 PM", "hh:mm:ss A")
                  }
                  format="hh:mm A"
                />
              </Form.Item>
            </Col>
            <Col span={11}>
              <Form.Item
                name="ActualPunchOut"
                label="Actual Out Time"
                rules={[
                  {
                    message: "Enter Out Time",
                  },
                ]}
              >
                <TimePicker
                  placeholder="Select Actual Out Time"
                  defaultValue={
                    NewProfile?.type === "Day"
                      ? moment("07:30 PM", "hh:mm A")
                      : moment("05:00 AM", "hh:mm:ss A")
                  }
                  format="hh:mm A"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={11}>
              <Form.Item
                name="ConcernMessage"
                label="Your Concern"
                rules={[
                  {
                    required: true,
                    message: "Write your Concern",
                  },
                ]}
              >
                <Input.TextArea placeholder="Write your Concern" />
              </Form.Item>
            </Col>
          </Row>

          <Space className="text-center d-flex my-4 gap-4">
            <Button type="primary" htmlType="submit" className="buttonFilled">
              Submit
            </Button>
            <Button type="button" className="buttonLine" onClick={handleCancel}>
              Cancel
            </Button>
          </Space>
        </Form>
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
            <div
              className="col-md-3"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <div className="emp-select-months-year">
                <div className="emp-select-month dflex">
                  <select
                    style={{
                      width: "124px",
                      height: "30px",
                      paddingRight: "12px",
                      color: "#222",
                    }}
                    onChange={handleMonthChange}
                  >
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
            <div
              className="col-md-9 d-flex gap-2"
              style={{ paddingLeft: "1.5rem" }}
            >
              <button
                style={{
                  height: "25px",
                  width: "90px",
                  borderRadius: "10px",
                  background: "#f3f3fb",
                  color: "#72757a",
                  fontSize: "0.8rem",
                  border: "1px solid #dcd2d2",
                  boxShadow: "2px 2px 2px 1px rgba(0, 0, 255, .2)",
                }}
              >
                Late : {totalLate}
              </button>

              <button
                style={{
                  height: "25px",
                  width: "90px",
                  borderRadius: "10px",
                  background: "#f3f3fb",
                  color: "#72757a",
                  fontSize: "0.8rem",
                  border: "1px solid #dcd2d2",
                  boxShadow: "2px 2px 2px 1px rgba(0, 0, 255, .2)",
                }}
              >
                Absent : {totalAbs}
              </button>

              <button
                style={{
                  height: "25px",
                  width: "90px",
                  borderRadius: "10px",
                  background: "#f3f3fb",
                  color: "#72757a",
                  fontSize: "0.8rem",
                  border: "1px solid #dcd2d2",
                  boxShadow: "2px 2px 2px 1px rgba(0, 0, 255, .2)",
                }}
              >
                Half Day : {halfDayCount}
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* bOOK lEAVE  */}
      <Modal
        title="Book Leave"
        visible={isModalVisible}
        onCancel={handleLeaveCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleLeaveSubmit}>
          <Form.Item
            name="leaveConcern"
            label="Reason for leave"
            rules={[
              { required: true, message: "Please enter your Concern Leave" },
            ]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: "Please select a date" }]}
          >
            <DatePicker 
             disabledDate={(current) => {
              // Disable all dates before today
              return current && current < moment().startOf('day');
            }}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <div className="attendance-container  my-4">
        <div className="emp-profile gap-4">
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
            <div className="empBtn" onClick={showLeaveModal}>
              <button>+ BOOK LEAVE</button>
            </div>

            <div
              className="empBtn my-4"
              style={{ background: "green !important" }}
            >
              <button onClick={showModal}>Forget to Punch</button>
            </div>
          </div>
          <div className="emp-card mt-2">
            <div className="emp-punch-clock my-2 ">
              <h4>Punch Clock</h4>
              <img src={im3} alt="" />
            </div>
            <small>Click the button below to Punch In</small>
            <hr />

            <div className="emp-punchBtns">
              {isPunchInDone ? (
                <div className="punch-out-btn" onClick={handlePunchOut}>
                  <img src={img5} style={{ marginRight: "5px" }} alt="" />
                  Punch Out
                </div>
              ) : (
                <div className="punch-in-btn" onClick={handlePunchIn}>
                  <img src={img4} style={{ marginRight: "5px" }} alt="" /> Punch
                  In
                </div>
              )}
            </div>
            <div className="emp-locationBtns">
              <div className="location-id-btn">
                <img src={img6} alt="" />
                {userIP}
              </div>
              <div className="current-location-btn">
                Check my current location
              </div>
            </div>
          </div>

          <div className="emp-card mt-2 ">
            <div className="emp-punch-in-out-details">
              <h6 className="my-2">
                <span style={{ color: "#0BC81E" }}>Punch in :</span>{" "}
                {attendanceInfo.firstPunchIn && (
                  <span>{attendanceInfo.firstPunchIn}</span>
                )}
                {/* {loading ? (
                  <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : filteredPunchin.length > 0 ? (
                  filteredPunchin[0].punchin
                ) : (
                  punchin
                )} */}
              </h6>

              <h6 className="my-2">
                <span style={{ color: "#FF0707" }}>Punch Out :</span>
                {<span>{attendanceInfo.LastpunchOut}</span>}
              </h6>
              <h6 className="my-2">
                Working Time :{" "}
                {attendanceInfo.totalWorkingTime !== null &&
                  attendanceInfo.totalWorkingTime}{" "}
              </h6>
              <h6 className="my-2">IP Address : {userIP} </h6>
              <h6 className="my-2">
                Status :{" "}
                <span
                  style={{
                    color:
                      attendanceInfo.status === "On Time" ? "#0BC81E" : "red",
                  }}
                >
                  {" "}
                  {attendanceInfo.status}{" "}
                </span>
                <span style={{ color: "#0BC81E" }}>
                  {/* {" "}
                  {filteredPunchOut.length > 0 ? (
                    <span style={{ color: isLate ? "red" : "green" }}>
                      {filteredPunchOut[0].status} {halfDayToday ?? "Half Day"}
                    </span>
                  ) : (
                    // <span style={{ color: isLate ? "red" : "green" }}>
                    //   {hidden ? (isLate ? "LATE" : "In Time") : null}
                    // </span>
                  )}{" "} */}
                </span>
              </h6>
              <h6 classNAme="my-3">
                {" "}
                Work Status :{" "}
                <span
                  style={{
                    color:
                      attendanceInfo.workStatus === "Full Day"
                        ? "#0BC81E"
                        : "red",
                  }}
                >
                  {" "}
                  {attendanceInfo?.workStatus}{" "}
                </span>
              </h6>
            </div>
          </div>
          {/* </div> */}
          {/* -------emp--punch--cards----- */}

          {/* <div className="emp-cards mb-5"  style={{ marginTop: "10px" }}> */}
          <div className="right-emp-calender mb-4 my-2">
            <h6 className="my-3">Calender</h6>
            <div className="emp-dates">
              <div>
                <p>Today</p>
                <small>{moment().format("dddd, DD MMMM")}</small>
              </div>
              <div>
                <hr style={{ border: "1px solid #D9D9D9" }} />
              </div>
              <div>
                <p>Tommorow</p>
                <small>{moment().add(1, "day").format("dddd, DD MMMM")}</small>
              </div>
            </div>
            <div className="calender-title">
              <div className="right-calender-title">
                <h6
                  style={{
                    color: "#FF560E",
                    cursor: "pointer",
                    padding: "0px 2rem",
                  }}
                  onClick={showAttendance}
                >
                  MONTHLY VIEW
                </h6>
                <a
                  href="/attendance-list"
                  style={{
                    color: "#222",
                  }}
                >
                  <h6>FULL CALENDER</h6>
                </a>
              </div>
            </div>
          </div>
          <div className=" concernGrid mb-4 mt-3">
            <div className="emp-leave-balance p-2">
              <h6 style={{ color: "coral" }}>Raised Concern</h6>
              <a href="">
                <img src={img7} alt="" />
              </a>
            </div>
            <table class="table">
              <thead>
                <tr>
                  <th scope="col" style={{ color: "blue" }}>
                    Concern Type
                  </th>
                  <th scope="col">Date</th>
                  <th scope="col">Approval</th>
                  <th scope="col">Concern details</th>
                  {/* <th scope="col">Balance</th> */}
                </tr>
              </thead>
              <tbody>
                {concernData?.map((concern) => {
                  return (
                    <tr>
                      <td
                        style={{
                          color:
                            concern.punchType === "Punch Out"
                              ? "blue"
                              : concern.punchType ===
                                ("Leave Application" || "Leave")
                              ? "red"
                              : "green",
                        }}
                      >
                        {concern.punchType}
                      </td>
                      <td>{concern.date}</td>
                      <td
                        style={{
                          color:
                            concern.status === "Approved"
                              ? "green"
                              : concern.status === "Denied" && "red",
                        }}
                      >
                        {concern.status}
                      </td>
                      <td>{concern.message}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div
          className="empBtn"
          style={{
            display: "flex",
            justifyContent: "flex-start",
            marginLeft: "10px",
          }}
        ></div>
      </div>
    </>
  );
};

export default EmployeeAttendance;

function getCurrentDateFormatted() {
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();
  return `${year}-${month < 10 ? "0" + month : month}-${
    day < 10 ? "0" + day : day
  }`;
}

const checkinTime = (currentTime) => {
  // Convert currentTime to local time from UTC if it's in UTC
  const punchInDate = moment(currentTime);

  if (NewProfile?.type === "Day") {
    const lateStart = moment(punchInDate).hours(10).minutes(40).seconds(0); // 10:40 AM
    return punchInDate.isSameOrAfter(lateStart);
  } else if (NewProfile?.type === "Night") {
    // Night shift: allow punch-in from 7:00 PM to 8:10 AM next day
    const shiftStart = moment(punchInDate).hours(19).minutes(0).seconds(0); // 7:00 PM
    const lateStart = moment(punchInDate).hours(20).minutes(10).seconds(0); // Late start at 8:10 PM
    const lateEnd = moment(punchInDate)
      .add(1, "day")
      .hours(8)
      .minutes(10)
      .seconds(0); // 8:10 AM next day

    console.log("SHIFT START -->", shiftStart.format());
    console.log("LATE START -->", lateStart.format());
    console.log("LATE END -->", lateEnd.format());

    // Punch is late if it's after 8:10 PM or after the shift end time (8:10 AM next day)
    const isLate =
      punchInDate.isAfter(lateStart) && punchInDate.isBefore(lateEnd);
    console.log("IS LATE -->", isLate);

    return isLate;
  }

  return false;
};
