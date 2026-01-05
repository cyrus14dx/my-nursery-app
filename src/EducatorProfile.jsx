import React, { useState, useEffect } from 'react';
import { FaBullhorn, FaClipboardList, FaUserTie, FaExclamationTriangle } from 'react-icons/fa';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

const EducatorProfile = ({ user, onLogout }) => {
  const [students, setStudents] = useState([]);
  const [msg, setMsg] = useState("");
  const [target, setTarget] = useState("all");
  const [attendance, setAttendance] = useState({});

  useEffect(() => {
    const fetchStudents = async () => {
      const q = query(collection(db, "registrations"), where("program", "==", user.program));
      const snap = await getDocs(q);
      setStudents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    fetchStudents();
  }, [user.program]);

  const handleSend = async () => {
    if(!msg) return;
    const recipientName = target === "all" ? "All Parents" : students.find(s => s.id === target)?.parentName;
    await addDoc(collection(db, "notices"), {
      text: msg, program: user.program, sender: user.name,
      recipient: recipientName, targetId: target, date: new Date().toISOString()
    });
    alert("Message Sent!");
    setMsg("");
  };

  const saveAttendance = async () => {
    const promises = students.map(s => addDoc(collection(db, "attendance"), {
      childName: s.childName, parentName: s.parentName, program: user.program,
      status: attendance[s.id] ? "Present" : "Absent",
      date: new Date().toLocaleDateString(), timestamp: serverTimestamp(), reported: false
    }));
    await Promise.all(promises);
    alert("Attendance sent to Admin!");
  };

  const reportParent = async (student) => {
    const reason = window.prompt(`Report ${student.childName}'s parent for:`);
    if (reason) {
      await addDoc(collection(db, "attendance"), {
        childName: student.childName, parentName: student.parentName, program: user.program,
        status: "Flagged", reportReason: reason, reported: true,
        date: new Date().toLocaleDateString(), timestamp: serverTimestamp()
      });
      alert("Admin has been notified.");
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
            <div><h2>Welcome, {user.name}</h2><p>Program: <strong>{user.program}</strong></p></div>
          </div>
        </div>

        <div className="profile-main-grid">
          <div className="summary-card">
            <h3><FaClipboardList /> Daily Attendance</h3>
            <div className="attendance-list">
              {students.map(s => (
                <div key={s.id} className="attendance-item">
                  <span>{s.childName}</span>
                  <div style={{display:'flex', gap:'10px'}}>
                    <button className={`pill ${attendance[s.id] ? 'paid' : 'unpaid'}`} onClick={() => setAttendance(p => ({...p, [s.id]: !p[s.id]}))}>
                      {attendance[s.id] ? 'Present' : 'Absent'}
                    </button>
                    <button onClick={() => reportParent(s)} style={{color:'#eb4d4b', border:'none', background:'none'}}><FaExclamationTriangle/></button>
                  </div>
                </div>
              ))}
            </div>
            <button className="activate-trigger-btn" onClick={saveAttendance}>Submit Attendance</button>
          </div>

          <div className="notice-card educator-note">
            <div className="notice-header"><FaBullhorn /> <h3>Messaging</h3></div>
            <div className="notice-content">
              <select value={target} onChange={e => setTarget(e.target.value)} style={{width:'100%', padding:'10px', borderRadius:'8px', marginBottom:'10px'}}>
                <option value="all">Broadcast to All</option>
                {students.map(s => <option key={s.id} value={s.id}>{s.childName} ({s.parentName})</option>)}
              </select>
              <textarea className="parent-textarea" placeholder="Your message..." value={msg} onChange={e => setMsg(e.target.value)} />
              <button className="send-note-btn" onClick={handleSend}>Send Message</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EducatorProfile;