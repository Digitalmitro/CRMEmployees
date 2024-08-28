import React from "react";
import { GoArrowUp } from "react-icons/go";
import moment from 'moment'
import attendanceimg from '../../assets/finger-print-12.png'
import callbackImg from '../../assets/callback-12.png'
import transferImg from '../../assets/transfer-img.png'
import salesImg from '../../assets/sales-img.png'
import projectImg from '../../assets/project-12.png'
const Dashboard = () => {
  return (
    <>
      <div className=" dashboard container d-flex flex-wrap  align-items-center justify-content-start my-3 gap-3" >
        
      <div className="Emp-Dash grid8 d-flex align-items-center " style={{boxShadow:" 0 0 5px rgb(179, 170, 170)",justifyContent:"center",width:"200px",borderRadius:"20px",transition:"all 0.3s ease-in-out" }}>
         <a href="/attendance-list" style={{
          color:"#222"
         }}>
         <div>
         <div style={{textAlign:"center",padding:"20px",height:"96px"}}>
         <img src={attendanceimg} alt="" style={{width:"70px" ,height:"70px",textAlign:"center"}}/>
         </div>
          <div className="gridtext d-flex align-items-center justify-content-center" style={{color:"#222"}}>
          <h5 style={{fontSize:"0.9rem"}}>Attendace  List: {moment().format('MMMM')}</h5>
          {/* <span>(+84.7%  <GoArrowUp /> )</span> */}
          </div>
         
          
          </div>
         </a>
          </div>
          
          <div className="Emp-Dash grid4 d-flex align-items-center "style={{boxShadow:" 0 0 5px rgb(179, 170, 170)",justifyContent:"center",width:"200px",borderRadius:"20px",transition:"all 0.3s ease-in-out" }}>
          <a href="/callbacks" style={{
          color:"#222"
         }}>
          <div>
        
          <div style={{textAlign:"center",padding:"20px"}}>
         <img src={callbackImg} alt="" style={{width:"65px", height:"60px",textAlign:"center"}}/>
         </div>
          <div className="gridtext d-flex align-items-center justify-content-center">
            
          <h6 style={{fontSize:"0.9rem"}}>All Callback: 914</h6>
          <span>(+84.7%  <GoArrowUp /> )</span>
          </div>
         
          </div>
          </a>
          </div>
       
       
          <div className="Emp-Dash grid5 d-flex  align-items-center " style={{boxShadow:" 0 0 5px rgb(179, 170, 170)",justifyContent:"center",width:"200px",borderRadius:"20px",transition:"all 0.3s ease-in-out" }}>
          <a href="/employee-sales" style={{
          color:"#222"
         }}> 
          <div>
          <div style={{textAlign:"center",padding:"20px"}}>
         <img src={salesImg} alt="" style={{width:"60px", height:"60px",textAlign:"center"}}/>
         </div>
          <div className="gridtext d-flex  align-items-center justify-content-center">
          <h6 style={{fontSize:"0.9rem"}}>All Sales: 43</h6>
          <span>(+84.7%  <GoArrowUp /> )</span>
          </div>
           
          
          </div>
          </a>
          </div>

          <div className="Emp-Dash grid6 d-flex   align-items-center "style={{boxShadow:" 0 0 5px rgb(179, 170, 170)",justifyContent:"center",width:"200px",borderRadius:"20px",transition:"all 0.3s ease-in-out" }}>
          <a href="/transfers" style={{
          color:"#222"
         }}>
          <div>
          <div style={{textAlign:"center",padding:"20px"}}>
         <img src={transferImg} alt="" style={{width:"80px", height:"60px",textAlign:"center"}}/>
         </div>
          <div className="gridtext d-flex  align-items-center justify-content-center">
          <h6 style={{fontSize:"0.9rem"}}>All Transfer: 43</h6>
          <span>(+84.7%  <GoArrowUp /> )</span>
          </div>
          
       
          
          </div>
          </a>
          </div>
         
          <div className="Emp-Dash grid8 d-flex align-items-center " style={{boxShadow:" 0 0 5px rgb(179, 170, 170)",justifyContent:"center",width:"200px",borderRadius:"20px",transition:"all 0.3s ease-in-out" }}>
          <a href="/project-lists" style={{
          color:"#222"
         }}>
          <div>
          <div style={{textAlign:"center",padding:"20px"}}>
         <img src={projectImg} alt="" style={{width:"50px", height:"50px",textAlign:"center"}}/>
         </div>
          <div className="gridtext d-flex align-items-center justify-content-center">
          <h6 style={{fontSize:"0.9rem"}}>Projects</h6>
          {/* <span>(+84.7%  <GoArrowUp /> )</span> */}
          </div>
          
          
          </div>
          </a>
          </div>
      
      </div>
 
    </>
  );
};

export default Dashboard;
