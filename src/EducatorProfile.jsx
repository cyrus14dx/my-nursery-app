import React, { useState, useEffect } from 'react';
import { FaBullhorn, FaClipboardList, FaUserTie, FaCheckCircle } from 'react-icons/fa';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
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
            <button className="activate-trigger-btn" style={{marginTop: '15px'}}>Save Attendance</button>
          </div>

          {/* Notice Section */}
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