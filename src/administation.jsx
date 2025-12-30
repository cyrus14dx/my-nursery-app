import React, { useState, useEffect } from "react";
import {
  FaUsers,
  FaChild,
  FaMoneyBillWave,
  FaChalkboardTeacher,
  FaSignOutAlt,
  FaUserShield,
  FaTrash,
  FaPlus,
  FaChartLine,
} from "react-icons/fa";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
} from "firebase/firestore";
import { db } from "./firebase";

const Administration = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [students, setStudents] = useState([]);
  const [educators, setEducators] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State for new Educator
  const [newEdu, setNewEdu] = useState({
    name: "",
    email: "",
    program: "infant",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Students (Registrations)
      const studentSnap = await getDocs(collection(db, "registrations"));
      const studentList = studentSnap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setStudents(studentList);

      // 2. Fetch Educators
      const eduSnap = await getDocs(collection(db, "educators"));
      const eduList = eduSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setEducators(eduList);
    } catch (err) {
      console.error("Error fetching admin data:", err);
    }
    setLoading(false);
  };

  // Helper to calculate total money (Price based on program)
  const calculateTotalRevenue = () => {
    const prices = { infant: 450, preschool: 550, afterschool: 300 };
    return students.reduce((sum, s) => sum + (prices[s.program] || 0), 0);
  };

  const handleAddEducator = async (e) => {
    e.preventDefault();
    const generatedPassword = Math.random().toString(36).slice(-8);
    try {
      await addDoc(collection(db, "educators"), {
        ...newEdu,
        password: generatedPassword,
        role: "educator", // This ensures they are identified as educators
        createdAt: new Date(),
      });
      alert(
        `Educator Added!\nEmail: ${newEdu.email}\nPassword: ${generatedPassword}`
      );
      setNewEdu({ name: "", email: "", program: "infant" }); // Reset form
      fetchData();
    } catch (err) {
      alert("Error adding educator");
    }
  };

  const handleDelete = async (coll, id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      await deleteDoc(doc(db, coll, id));
      fetchData();
    }
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <FaUserShield />{" "}
          <span>
            KINDER<span>ADMIN</span>
          </span>
        </div>
        <nav className="admin-nav">
          <button
            className={activeTab === "overview" ? "active" : ""}
            onClick={() => setActiveTab("overview")}
          >
            <FaChartLine /> Dashboard
          </button>
          <button
            className={activeTab === "students" ? "active" : ""}
            onClick={() => setActiveTab("students")}
          >
            <FaChild /> Students
          </button>
          <button
            className={activeTab === "educators" ? "active" : ""}
            onClick={() => setActiveTab("educators")}
          >
            <FaChalkboardTeacher /> Educators
          </button>
        </nav>
        <button className="admin-logout" onClick={onLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <h1>
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management
          </h1>
        </header>

        {/* --- OVERVIEW TAB --- */}
        {activeTab === "overview" && (
          <div className="admin-stats-grid fade-in">
            <div className="stat-card">
              <FaUsers className="stat-icon blue" />
              <div>
                <h3>{students.length}</h3>
                <p>Total Students</p>
              </div>
            </div>
            <div className="stat-card">
              <FaChalkboardTeacher className="stat-icon green" />
              <div>
                <h3>{educators.length}</h3>
                <p>Active Educators</p>
              </div>
            </div>
            <div className="stat-card">
              <FaMoneyBillWave className="stat-icon gold" />
              <div>
                <h3>${calculateTotalRevenue()}</h3>
                <p>Monthly Revenue</p>
              </div>
            </div>
          </div>
        )}

        {/* --- STUDENTS TAB --- */}
        {activeTab === "students" && (
          <div className="table-container fade-in">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Parent Name</th>
                  <th>Child Name</th>
                  <th>Program</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id}>
                    <td>{s.parentName}</td>
                    <td>{s.childName}</td>
                    <td>
                      <span className={`tag-${s.program}`}>{s.program}</span>
                    </td>
                    <td>
                      <span className="status-pill">Active</span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDelete("registrations", s.id)}
                        className="delete-btn"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* --- EDUCATORS TAB --- */}
        {activeTab === "educators" && (
          <div className="educator-management fade-in">
            <div className="admin-card">
              <h3>
                <FaPlus /> Add New Educator
              </h3>
              <form onSubmit={handleAddEducator} className="admin-form-row">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={newEdu.name}
                  onChange={(e) =>
                    setNewEdu({ ...newEdu, name: e.target.value })
                  }
                  required  
                  className="admin-form-row-input"
                />
                <input
                  type="email"
                  placeholder="Educator Email"
                  value={newEdu.email}
                  onChange={(e) =>
                    setNewEdu({ ...newEdu, email: e.target.value })
                  }
                  required 
                  className="admin-form-row-input"
                />
                <select
                  value={newEdu.program}
                  onChange={(e) =>
                    setNewEdu({ ...newEdu, program: e.target.value })
                  } className="admin-form-row-option"
                >
                  <option value="infant">Infant Daycare</option>
                  <option value="preschool">Preschool Academy</option>
                  <option value="afterschool">After School</option>
                </select>
                <button type="submit" className="add-btn">
                  Create Account
                </button>
              </form>
            </div>

            <div className="table-container" style={{ marginTop: "20px" }}>
              <table className="modern-table">
                <thead>
  <tr>
    <th>Name</th>
    <th>Email</th> {/* Added this */}
    <th>Program</th>
    <th>Password</th>
    <th>Action</th>
  </tr>
</thead>
<tbody>
  {educators.map(edu => (
    <tr key={edu.id}>
      <td>{edu.name}</td>
      <td>{edu.email}</td> {/* Added this */}
      <td><span className="tag-program">{edu.program}</span></td>
      <td><code>{edu.password}</code></td>
      <td><button onClick={() => handleDelete('educators', edu.id)} className="delete-btn"><FaTrash /></button></td>
    </tr>
  ))}
</tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Administration;
