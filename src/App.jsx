import { createContext, useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './Components/Pages/EmployeeDashboard'
import Header from './Components/Pages/Header'
import Sidebar from './Components/Pages/Sidebar'
import Inbox from './Components/Pages/Inbox'
import BreadcrumbsComponent from './Components/Pages/BreadcrumbsComponents'
import EmployeeAttendance from './Components/Pages/EmployeeAttendance'

import Cookies from "js-cookie";
import Login from './Components/Pages/Login'
import EmployeeProjects from './Components/Pages/EmployeeProjects'
import CallbackTable from './Components/Pages/CallbackTable'
import CallbackView from './Components/Pages/CallbackView'
import ProjectSubMenu from './Components/Pages/ProjectSubMenu'
import CallbackViewEdit from './Components/Pages/CallbackViewEdit'
import ProjectList from './Components/Pages/ProjectList'
import Transfers from './Components/Pages/Transfers'
import TransferView from './Components/Pages/TransferView'
import TransferViewEdit from './Components/Pages/TransferViewEdit'
import EmployeeSales from './Components/Pages/EmployeeSales'
import SalesView from './Components/Pages/SalesView'
import SalesViewEdit from './Components/Pages/SalesViewEdit'
import EmpAttendanceList from './Components/Pages/EmpAttendanceList'
import EmployeeNotes from './Components/Pages/EmployeeNotes'
import EmpMsg from './Components/Pages/EmpMsg'
import Doccs from './Components/Pages/Doccs'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const MyContext = createContext()
function App() {
  const [breadcrumbs, setBreadcrumbs] = useState([{ label: 'Dashboard', path: '/' }]);
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [activeButton,setActiveButton]=useState(0)

  const userToken = localStorage.getItem('userToken');
console.log("userToken", userToken )
  const value = {
    
    activeButton,
    setActiveButton,
    toggleSidebar,
    setToggleSidebar,
    breadcrumbs,
    setBreadcrumbs,
  };

  
  // useEffect(()=>{
  //   alert(toggleSidebar)
  // },[toggleSidebar])


  return (
   <>
    <MyContext.Provider value={value}>
    {userToken ? (
       <>
        <ToastContainer />
        <Header />
        <div className="main d-flex">
          <div className={`sidebar-wrapper ${toggleSidebar === true ? "toggle" : ""} `}>
            <Sidebar />
          </div>
          <div className={`main-content ${toggleSidebar === true ? "toggle" : ""}`} style={{marginLeft:"-2rem"}}>
            <BreadcrumbsComponent breadcrumbs={breadcrumbs}  />
            <Routes>
              <Route path={"/"} element={<Dashboard />} />
              <Route path={"/inbox"} element={<Inbox />} />
              <Route path="/attendance" element={<EmployeeAttendance />} />
              <Route path="/attendance-list" element={<EmpAttendanceList />} />
              <Route path="/projects" element={<EmployeeProjects />} />
              <Route path="/callbacks" element={<CallbackTable />} />

              <Route path="/callback-view/:id" element={<CallbackView />} />

              <Route path="/projects/:id" element={<ProjectList />} />
              <Route path="/callback_status/:id" element={<CallbackViewEdit />} />

              <Route path="/project-lists" element={<ProjectSubMenu />} />

              <Route path="/transfers" element={<Transfers />} />
              <Route path="/transfer-view/:id" element={<TransferView />} />
              <Route path="/transfer_status/:id" element={<TransferViewEdit />} />

              <Route path="/employee-sales" element={<EmployeeSales />} />
              <Route path="/view_sale/:id" element={<SalesView />} />
              <Route path="/sales_status/:id" element={<SalesViewEdit />} />

              <Route path="/employee-notes" element={<EmployeeNotes />} />

              <Route path="/employee-msg" element={<EmpMsg />} />

              <Route path="/doccuments/:id" element={<Doccs />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </div> 
       </>
    ):(
      <Routes>
      <Route path="*" element={<Navigate to="/login" replace />} />
     <Route path="/login" element={<Login />} />
   </Routes>
  )}

    </MyContext.Provider>
   </>
  )
}
export default App
export { MyContext }