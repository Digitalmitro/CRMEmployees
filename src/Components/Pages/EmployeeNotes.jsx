import React, { useState, useEffect } from 'react'
import axios from 'axios'

const EmployeeNotes = () => {
    const Profile = localStorage.getItem('user')
    const NewProfile = JSON.parse(Profile)
    const name = NewProfile?.name
    const email = NewProfile?.email
    const user_id = NewProfile?._id
    const [notes, setNotes] = useState('')
  
    useEffect(() => {
      getNotes()
    }, [])
  
    async function getNotes() {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_API}/notepad/${user_id}`)
        console.log(res.data.notes)
        setNotes(res.data.notes.notes)
      } catch (error) {
        console.log(error)
      }
    }
  
    async function handleChange(e) {
      const newNotes = e.target.value
      setNotes(newNotes) // Update the state immediately
  
      try {
        // Send a request to update the notes
        const payload = {
          notes: newNotes,
          user_id,
        }
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_API}/notepad`, payload)
        console.log(res.data) // Log the response if needed
      } catch (error) {
        console.log(error)
      }
    }
  
    const [showToast, setShowToast] = useState(true)
    useEffect(() => {
      setTimeout(() => {
        setShowToast(false)
      }, 3000)
    }, [])
    return (

        <>
            <div className="emp-notes-container">
                <div className="notes-title">
                    <h6 style={{fontSize:"1rem",color:"#f24e1e"}}>Notes</h6>
                    <div className="notesBtn">
                        {notes ? (<div style={{display:"flex",alignItems:"center"}} class="alert alert-warning alert-dismissible fade show" role="alert">
                            <strong style={{fontSize:"0.9rem"}}>CTRL + F to Filter</strong>
                            <button style={{height:"-10px",width:"5px",display:"flex",alignItems:"center",justifyContent:"center"}} type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>) : ""}
                    </div>
                </div>
                <div className="emp-notepad">
                    <textarea type="text" rows={20} style={{ width: "100%", height: "60vh", outline: "none", border: "none", resize: "none", overflowY: "auto", padding: "10px",background:"#f3f4f5",boxShadow:"0 0 7px #616161" }} value={notes}
                        onChange={handleChange}></textarea>
                </div>
            </div>
        </>
    )
}

export default EmployeeNotes