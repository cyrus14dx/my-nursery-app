import React, { useState, useEffect } from 'react';
import { FaBullhorn, FaClipboardList, FaUserTie, FaCheckCircle, FaUserCircle } from 'react-icons/fa';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

const EducatorProfile = ({ user, onLogout }) => {
  const [students, setStudents] = useState([]);
  const [notice, setNotice] = useState("");
  const [selectedRecipient, setSelectedRecipient] = useState("all"); // 'all' or specific student ID
  const [attendance, setAttendance] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchMyStudents = async () => {
      const q = query(collection(db, "registrations"), where("program", "==", user.program));
      const snap = await getDocs(q);
      const studentData = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setStudents(studentData);
      
      const initialStatus = {};
      studentData.forEach(s => {
        initialStatus[s.id] = true;
      });
      setAttendance(initialStatus);
    };
    fetchMyStudents();
  }, [user.program]);

  // Attendance Save Logic
  const handleSaveAttendance = async () => {
    setIsSaving(true);
    try {
      const today = new Date().toLocaleDateString();
      const absentStudents = students.filter(s => !attendance[s.id]);

      if (absentStudents.length === 0) {
        alert("All students marked as Present.");
      } else {
        const promises = absentStudents.map(student => 
          addDoc(collection(db, "absences"), {
            studentName: student.childName,
            parentId: student.parentId || "N/A",
            program: user.program,
            date: today,
            timestamp: serverTimestamp(),
            markedBy: user.name,
            reason: "" 
          })
        );
        await Promise.all(promises);
        alert(`Attendance saved! ${absentStudents.length} absence(s) reported to Admin.`);
      }
    } catch (err) {
      alert("Failed to save attendance.");
    }
    setIsSaving(false);
  };

  // --- UPDATED: Handle Send Notice ---
  const handleSendNotice = async () => {
    if(!notice) return;

    try {
      const noticeData = {
        text: notice,
        program: user.program,
        sender: user.name,
        date: new Date().toISOString(),
        timestamp: serverTimestamp(),
        // If 'all', type is broadcast. If ID, type is private.
        type: selectedRecipient === "all" ? "broadcast" : "private",
        recipientId: selectedRecipient === "all" ? null : selectedRecipient
      };

      await addDoc(collection(db, "notices"), noticeData);
      
      const successMsg = selectedRecipient === "all" 
        ? "Broadcast sent to all parents!" 
        : "Private message sent to the parent!";
      
      alert(successMsg);
      setNotice("");
      setSelectedRecipient("all");
    } catch (err) {
      console.error(err);
      alert("Error sending message.");
    }
  };

  const toggleAttendance = (id) => {
    setAttendance(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="educator-dashboard">
      <nav className="navBar scrolled">
        <span className="logo">Educator<span>Portal</span></span>
        <button onClick={onLogout} className="nav-cta">Logout</button>
      </nav>

      <div className="profile-container" style={{marginTop: '100px'}}>
        <div className="profile-header">
          <div className="user-meta">
            <div className="user-avatar"><FaUserTie /></div>
            <div>
              <h2>Welcome, {user.name}</h2>
              <p>Specialist: <strong>{user.program.toUpperCase()}</strong></p>
            </div>
          </div>
        </div>

        <div className="profile-main-grid">
          {/* Attendance Section */}
          <div className="summary-card">
            <h3><FaClipboardList /> Daily Attendance</h3>
            <div className="attendance-list">
              {students.map(s => (
                <div key={s.id} className="attendance-item">
                  <span>{s.childName}</span>
                  <button 
                    className={`pill ${attendance[s.id] ? 'paid' : 'unpaid'}`}
                    onClick={() => toggleAttendance(s.id)}
                  >
                    {attendance[s.id] ? 'Present' : 'Absent'}
                  </button>
                </div>
              ))}
            </div>
            <button className="activate-trigger-btn" style={{marginTop: '15px'}} onClick={handleSaveAttendance} disabled={isSaving}>
               {isSaving ? "Saving..." : "Save Attendance"}
            </button>
          </div>

          {/* --- UPDATED: Notice Section with Recipient Selection --- */}
          <div className="notice-card educator-note">
            <div className="notice-header">
              <FaBullhorn className="notice-icon" />
              <h3>Communications</h3>
            </div>
            <div className="notice-content">
              
              <label style={{fontSize: '0.9rem', marginBottom: '5px', display: 'block'}}>Send To:</label>
              <select 
                className="admin-form-row-option" 
                style={{width: '100%', marginBottom: '15px', padding: '10px'}}
                value={selectedRecipient}
                onChange={(e) => setSelectedRecipient(e.target.value)}
              >
                <option value="all">📢 All Parents ({user.program})</option>
                <optgroup label="Specific Student Parent">
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      👤 Parent of: {s.childName}
                    </option>
                  ))}
                </optgroup>
              </select>

              <textarea 
                className="parent-textarea" 
                placeholder={selectedRecipient === 'all' ? "Message all parents..." : "Send private message..."}
                value={notice}
                onChange={(e) => setNotice(e.target.value)}
              />
              <button className="send-note-btn" onClick={handleSendNotice}>
                {selectedRecipient === 'all' ? "Broadcast Message" : "Send Private Message"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducatorProfile;