import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Debounce function
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

const EmployeeNotes = () => {
  const Profile = localStorage.getItem('user');
  const NewProfile = JSON.parse(Profile);
  const user_id = NewProfile?._id;
  const [notes, setNotes] = useState('');
  const [apiNotes, setApiNotes] = useState(''); // To store the notes fetched from the API

  useEffect(() => {
    getNotes();
  }, []);

  async function getNotes() {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_API}/notepad/${user_id}`);
      console.log("nts",res.data);
      setApiNotes(res.data.notes.notes); 
      setNotes(res.data.notes.notes); 
    } catch (error) {
      console.log(error);
    }
  }

  // Debounced function for updating notes
  const debouncedSave = useCallback(
    debounce(async (newNotes) => {
      try {
        const payload = {
          notes: newNotes,
          user_id,
        };
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_API}/notepad`, payload);
        console.log(res.data); 
      } catch (error) {
        console.log(error);
      }
    }, 500), // Adjust the debounce delay as needed
    []
);

  function handleChange(e) {
    const newNotes = e.target.value;
    setNotes(newNotes); // Update the state immediately
    debouncedSave(newNotes); // Debounced function call
  }

  const [showToast, setShowToast] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  }, []);

  return (
    <>
      <div className="emp-notes-container">
        <div className="notes-title">
          <h6 style={{fontSize:"1rem",color:"#f24e1e"}}>Notes</h6>
          <div className="notesBtn">
            {notes ? (
              <div style={{display:"flex",alignItems:"center"}} className="alert alert-warning alert-dismissible fade show" role="alert">
                <strong style={{fontSize:"0.9rem"}}>CTRL + F to Filter</strong>
                <button style={{height:"-10px",width:"5px",display:"flex",alignItems:"center",justifyContent:"center"}} type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
              </div>
            ) : ""}
          </div>
        </div>
        <div className="emp-notepad">
          {/* Display notes fetched from API */}
          {/* <div className="notes-display" style={{ marginBottom: "20px", padding: "10px", background: "#e9ecef", boxShadow: "0 0 5px #ccc" }}>
            <h6>Fetched Notes</h6>
            <p>{apiNotes}</p>
          </div> */}
          {/* Textarea for editing notes */}
          <textarea
            type="text"
            rows={20}
            style={{
              width: "100%",
              height: "60vh",
              outline: "none",
              border: "none",
              resize: "none",
              overflowY: "auto",
              padding: "10px",
              background: "#f3f4f5",
              boxShadow: "0 0 7px #616161",
            }}
            value={notes}
            onChange={handleChange}
          ></textarea>
        </div>
      </div>
    </>
  );
};

export default EmployeeNotes;
