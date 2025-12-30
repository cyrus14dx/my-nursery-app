import React, { useState, useEffect } from 'react';
import { 
  FaUsers, FaChild, FaMoneyBillWave, FaChalkboardTeacher, 
  FaSignOutAlt, FaSearch, FaCheckCircle, FaUserShield, FaTrash 
} from 'react-icons/fa';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebase';

const Administration = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data from Firebase
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "registrations"));
        const data = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setStudents(data);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Calculation Logic
  const stats = {
    total: students.length,
    revenue: students.filter(s => s.isActivated).reduce((acc, s) => {
        const prices = { infant: 450, preschool: 550, afterschool: 300 };
        return acc + (prices[s.program?.toLowerCase()] || 0);
    }, 0),
    pending: students.filter(s => !s.isActivated).length
  };

  const handleDelete = async (id) => {
    if(window.confirm("Delete this record permanently?")) {
        await deleteDoc(doc(db, "registrations", id));
        setStudents(students.filter(s => s.id !== id));
    }
  };

  return (
    <div className="admin-layout">
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <FaUserShield /> <span>KINDER<span>ADMIN</span></span>
        </div>
        <nav className="admin-nav">
          <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}><FaUsers /> Dashboard</button>
          <button className={activeTab === 'students' ? 'active' : ''} onClick={() => setActiveTab('students')}><FaChild /> Students</button>
          <button className={activeTab === 'finance' ? 'active' : ''} onClick={() => setActiveTab('finance')}><FaMoneyBillWave /> Transactions</button>
        </nav>
        <button className="admin-logout" onClick={onLogout}><FaSignOutAlt /> Logout</button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-main">
        <header className="admin-header">
          <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
          <div className="admin-user-info">Logged in as Administrator</div>
        </header>

        {loading ? <div className="loader">Loading...</div> : (
          <div className="admin-view">
            
            {/* OVERVIEW CARDS */}
            {activeTab === 'overview' && (
              <div className="stats-grid">
                <div className="card-stat">
                  <div className="card-icon blue"><FaUsers /></div>
                  <div className="card-data"><span>Total Students</span><h3>{stats.total}</h3></div>
                </div>
                <div className="card-stat">
                  <div className="card-icon green"><FaMoneyBillWave /></div>
                  <div className="card-data"><span>Total Revenue</span><h3>${stats.revenue}</h3></div>
                </div>
                <div className="card-stat">
                  <div className="card-icon red"><FaCheckCircle /></div>
                  <div className="card-data"><span>Pending Payment</span><h3>{stats.pending}</h3></div>
                </div>
              </div>
            )}

            {/* DATA TABLE (For Students & Finance) */}
            {(activeTab === 'students' || activeTab === 'finance') && (
              <div className="table-container fade-in">
                <table className="modern-table">
                  <thead>
                    <tr>
                      <th>Parent</th>
                      <th>Child</th>
                      <th>Program</th>
                      <th>{activeTab === 'finance' ? 'Fee' : 'Status'}</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(s => (
                      <tr key={s.id}>
                        <td>{s.parentName}</td>
                        <td>{s.childName}</td>
                        <td className="tag-program">{s.program}</td>
                        <td>
                          {activeTab === 'finance' ? `$${(s.program === 'infant' ? 450 : s.program === 'preschool' ? 550 : 300)}` : 
                          <span className={`pill ${s.isActivated ? 'paid' : 'unpaid'}`}>{s.isActivated ? 'Active' : 'Pending'}</span>}
                        </td>
                        <td>
                          <button className="delete-btn" onClick={() => handleDelete(s.id)}><FaTrash /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Administration;