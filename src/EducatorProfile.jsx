import React, { useState, useEffect } from 'react';
import { FaBullhorn, FaClipboardList, FaUserTie, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

const EducatorProfile = ({ user, onLogout }) => {
  const [students, setStudents] = useState([]);
  const [notice, setNotice] = useState("");
  const [attendance, setAttendance] = useState({});

  useEffect(() => {
    const fetchMyStudents = async () => {
      const q = query(collection(db, "registrations"), where("program", "==", user.program));
      const snap = await getDocs(q);
      setStudents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    fetchMyStudents();
  }, [user.program]);

  const handleSendNotice = async () => {
    if(!notice) return;
    await addDoc(collection(db, "notices"), {
      text: notice,
      program: user.program,
      sender: user.name,
      date: new Date().toISOString()
    });
    alert("Notice sent to all parents in your program!");
    setNotice("");
  };

  const toggleAttendance = (id) => {
    setAttendance(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const saveAttendance = async () => {
    try {
      // Save a record for each student for today
      const attendancePromises = students.map(student => {
        return addDoc(collection(db, "attendance"), {
          childName: student.childName,
          parentName: student.parentName,
          program: user.program,
          status: attendance[student.id] ? "Present" : "Absent",
          date: new Date().toLocaleDateString(),
          timestamp: serverTimestamp(),
          reported: false
        });
      });
      
      await Promise.all(attendancePromises);
      alert("Daily attendance submitted to Administration!");
    } catch (err) {
      alert("Error saving attendance");
    }
  };

  // Function to report a specific issue with a student/parent
  const reportToAdmin = async (student) => {
    const reason = window.prompt(`Reason for reporting ${student.childName}'s parent:`);
    if (reason) {
      await addDoc(collection(db, "attendance"), {
        childName: student.childName,
        parentName: student.parentName,
        program: user.program,
        status: "Reported",
        reportReason: reason,
        date: new Date().toLocaleDateString(),
        timestamp: serverTimestamp(),
        reported: true
      });
      alert("Report sent to Administration.");
    }
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
          <div className="summary-card">
            <h3><FaClipboardList /> Daily Attendance</h3>
            <div className="attendance-list">
              {students.map(s => (
                <div key={s.id} className="attendance-item">
                  <div style={{display: 'flex', flexDirection: 'column'}}>
                    <span>{s.childName}</span>
                    <small style={{fontSize: '0.7rem', color: '#888'}}>Parent: {s.parentName}</small>
                  </div>
                  <div style={{display: 'flex', gap: '10px'}}>
                    <button 
                      className={`pill ${attendance[s.id] ? 'paid' : 'unpaid'}`}
                      onClick={() => toggleAttendance(s.id)}
                    >
                      {attendance[s.id] ? 'Present' : 'Absent'}
                    </button>
                    <button 
                      style={{background: 'none', border: 'none', color: '#ff7675', cursor: 'pointer'}}
                      onClick={() => reportToAdmin(s)}
                      title="Report to Admin"
                    >
                      <FaExclamationTriangle />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button 
              className="activate-trigger-btn" 
              style={{marginTop: '15px'}}
              onClick={saveAttendance}
            >
              Submit Daily Attendance
            </button>
          </div>

          <div className="notice-card educator-note">
            <div className="notice-header">
              <FaBullhorn className="notice-icon" />
              <h3>Program Announcement</h3>
            </div>
            <div className="notice-content">
              <textarea 
                className="parent-textarea" 
                placeholder="Message parents of this program..."
                value={notice}
                onChange={(e) => setNotice(e.target.value)}
              />
              <button className="send-note-btn" onClick={handleSendNotice}>Broadcast Message</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducatorProfile;