import React, { useState, useEffect } from "react";
import {
  FaUsers, FaChild, FaMoneyBillWave, FaChalkboardTeacher,
  FaSignOutAlt, FaUserShield, FaTrash, FaPlus, FaChartLine,
  FaCalendarCheck, FaExclamationTriangle
} from "react-icons/fa";
import { collection, getDocs, deleteDoc, doc, addDoc, query, orderBy } from "firebase/firestore";
import { db } from "./firebase";

const Administration = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [students, setStudents] = useState([]);
  const [educators, setEducators] = useState([]);
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newEdu, setNewEdu] = useState({ name: "", email: "", program: "infant" });

  useEffect(() => {
    fetchData();
    if (activeTab === "attendance") fetchAttendance();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const studentSnap = await getDocs(collection(db, "registrations"));
      setStudents(studentSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      const eduSnap = await getDocs(collection(db, "educators"));
      setEducators(eduSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const fetchAttendance = async () => {
    const q = query(collection(db, "attendance"), orderBy("timestamp", "desc"));
    const snap = await getDocs(q);
    setAttendanceLogs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  const calculateTotalRevenue = () => {
    const prices = { infant: 450, preschool: 550, afterschool: 300 };
    return students.reduce((sum, s) => sum + (prices[s.program] || 0), 0);
  };

  const handleAddEducator = async (e) => {
    e.preventDefault();
    const generatedPassword = Math.random().toString(36).slice(-8);
    await addDoc(collection(db, "educators"), {
      ...newEdu, password: generatedPassword, role: "educator", createdAt: new Date()
    });
    alert(`Educator Added! Password: ${generatedPassword}`);
    setNewEdu({ name: "", email: "", program: "infant" });
    fetchData();
  };

  const handleDelete = async (coll, id) => {
    if (window.confirm("Delete this record?")) {
      await deleteDoc(doc(db, coll, id));
      activeTab === "attendance" ? fetchAttendance() : fetchData();
    }
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo"><FaUserShield /> <span>KINDER<span>ADMIN</span></span></div>
        <nav className="admin-nav">
          <button className={activeTab === "overview" ? "active" : ""} onClick={() => setActiveTab("overview")}><FaChartLine /> Dashboard</button>
          <button className={activeTab === "students" ? "active" : ""} onClick={() => setActiveTab("students")}><FaChild /> Students</button>
          <button className={activeTab === "educators" ? "active" : ""} onClick={() => setActiveTab("educators")}><FaChalkboardTeacher /> Educators</button>
          <button className={activeTab === "attendance" ? "active" : ""} onClick={() => setActiveTab("attendance")}><FaCalendarCheck /> Attendance</button>
        </nav>
        <button className="admin-logout" onClick={onLogout} style={{marginTop: 'auto'}}><FaSignOutAlt /> Logout</button>
      </aside>

      <main className="admin-main">
        <header className="admin-header"><h1>{activeTab.toUpperCase()}</h1></header>

        {activeTab === "overview" && (
          <div className="admin-stats-grid fade-in">
            <div className="stat-card"><div className="card-icon blue"><FaUsers /></div><div><h3>{students.length}</h3><p>Students</p></div></div>
            <div className="stat-card"><div className="card-icon green"><FaChalkboardTeacher /></div><div><h3>{educators.length}</h3><p>Educators</p></div></div>
            <div className="stat-card"><div className="card-icon red"><FaMoneyBillWave /></div><div><h3>${calculateTotalRevenue()}</h3><p>Revenue</p></div></div>
          </div>
        )}

        {activeTab === "attendance" && (
          <div className="admin-table-container fade-in">
            <table className="modern-table">
              <thead><tr><th>Date</th><th>Student</th><th>Status</th><th>Report</th><th>Action</th></tr></thead>
              <tbody>
                {attendanceLogs.map((log) => (
                  <tr key={log.id} style={log.reported ? { background: '#fff5f5', borderLeft: '5px solid #eb4d4b' } : {}}>
                    <td>{log.date}</td>
                    <td><strong>{log.childName}</strong><br/><small>{log.parentName}</small></td>
                    <td><span className={`pill ${log.status === 'Present' ? 'paid' : 'unpaid'}`}>{log.status}</span></td>
                    <td>{log.reported ? <span style={{color: '#eb4d4b'}}><FaExclamationTriangle/> {log.reportReason}</span> : "-"}</td>
                    <td><button onClick={() => handleDelete("attendance", log.id)} className="delete-btn"><FaTrash /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "students" && (
          <div className="admin-table-container fade-in">
            <table className="modern-table">
              <thead><tr><th>Parent</th><th>Child</th><th>Program</th><th>Action</th></tr></thead>
              <tbody>
                {students.map(s => (
                  <tr key={s.id}><td>{s.parentName}</td><td>{s.childName}</td><td><span className="pill paid">{s.program}</span></td>
                  <td><button onClick={() => handleDelete("registrations", s.id)} className="delete-btn"><FaTrash /></button></td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "educators" && (
          <div className="educator-management fade-in">
            <div className="summary-card" style={{marginBottom: '20px'}}>
              <h3><FaPlus /> Add Educator</h3>
              <form onSubmit={handleAddEducator}>
                <input className="admin-form-row-input" type="text" placeholder="Name" value={newEdu.name} onChange={e => setNewEdu({...newEdu, name: e.target.value})} required />
                <input className="admin-form-row-input" type="email" placeholder="Email" value={newEdu.email} onChange={e => setNewEdu({...newEdu, email: e.target.value})} required />
                <select className="admin-form-row-option" value={newEdu.program} onChange={e => setNewEdu({...newEdu, program: e.target.value})}>
                  <option value="infant">Infant</option><option value="preschool">Preschool</option><option value="afterschool">Afterschool</option>
                </select>
                <button type="submit" className="add-btn">Add</button>
              </form>
            </div>
            <table className="modern-table">
              <thead><tr><th>Name</th><th>Email</th><th>Program</th><th>Pass</th><th>Action</th></tr></thead>
              <tbody>
                {educators.map(edu => (
                  <tr key={edu.id}><td>{edu.name}</td><td>{edu.email}</td><td>{edu.program}</td><td><code>{edu.password}</code></td>
                  <td><button onClick={() => handleDelete('educators', edu.id)} className="delete-btn"><FaTrash /></button></td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};
export default Administration;