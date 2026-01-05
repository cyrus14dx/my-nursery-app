import React, { useState, useEffect, useRef } from "react";
import {
  FaUser,
  FaCreditCard,
  FaCheckCircle,
  FaBullhorn,
  FaExclamationTriangle,
  FaPrint,
  FaHistory
} from "react-icons/fa";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

const ProfilePage = ({ user }) => {
  const [showPayment, setShowPayment] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const [expiryDate, setExpiryDate] = useState(null);
  const [notices, setNotices] = useState([]);
  
  // Ref for the receipt content
  const receiptRef = useRef();

  useEffect(() => {
    if (!user.id || !user.program) return;
    const q = query(collection(db, "notices"), where("program", "==", user.program));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allNotices = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      const myFilteredNotices = allNotices
        .filter(n => n.type === "broadcast" || n.recipientId === user.id)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      setNotices(myFilteredNotices);
    });
    return () => unsubscribe();
  }, [user.program, user.id]);

  useEffect(() => {
    const savedExpiry = localStorage.getItem(`expiry_${user.id}`);
    if (savedExpiry) {
      const expiry = new Date(savedExpiry);
      if (new Date() < expiry) {
        setIsActivated(true);
        setExpiryDate(expiry.toLocaleDateString());
      }
    }
  }, [user.id]);

  const handlePayment = (e) => {
    e.preventDefault();
    const nextMonth = new Date();
    nextMonth.setDate(nextMonth.getDate() + 30);
    const expiryString = nextMonth.toISOString();

    setIsActivated(true);
    setExpiryDate(nextMonth.toLocaleDateString());
    localStorage.setItem(`expiry_${user.id}`, expiryString);
    
    // Store a simple payment record
    const paymentRecord = {
      date: new Date().toLocaleDateString(),
      amount: "$299.00",
      ref: `TRX-${Math.floor(Math.random() * 1000000)}`
    };
    localStorage.setItem(`last_payment_${user.id}`, JSON.stringify(paymentRecord));

    setShowPayment(false);
    alert("Payment Successful!");
  };

  // --- NEW: Print Function ---
  const handlePrintReceipt = () => {
    const lastPay = JSON.parse(localStorage.getItem(`last_payment_${user.id}`));
    if (!lastPay) return alert("No recent payment found.");

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head><title>Payment Receipt</title></head>
        <body style="font-family: sans-serif; padding: 40px; line-height: 1.6;">
          <h2 style="color: #3498db;">Official Payment Receipt</h2>
          <hr/>
          <p><strong>Parent Name:</strong> ${user.parentName}</p>
          <p><strong>Student Name:</strong> ${user.childName}</p>
          <p><strong>Program:</strong> ${user.program.toUpperCase()}</p>
          <p><strong>Transaction ID:</strong> ${lastPay.ref}</p>
          <p><strong>Date:</strong> ${lastPay.date}</p>
          <p><strong>Amount Paid:</strong> ${lastPay.amount}</p>
          <p><strong>Status:</strong> Paid / Active</p>
          <hr/>
          <p style="font-size: 0.8rem;">Thank you for your enrollment. This is a computer-generated receipt.</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <section className="profile-section">
      <div className="profile-container">
        
        <div className="profile-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
          <div className="user-meta" style={{ display: 'flex', gap: '15px' }}>
            <div className="user-avatar" style={{ fontSize: '2.5rem', color: '#3498db' }}><FaUser /></div>
            <div>
              <h2 style={{ margin: 0 }}>Welcome, {user.parentName}</h2>
              <p style={{ margin: 0, color: '#666' }}>ID: {user.id}</p>
            </div>
          </div>
          <div className="status-container">
             <span className={`status-badge ${isActivated ? 'activated' : 'pending'}`} style={{ padding: '8px 15px', borderRadius: '20px', fontWeight: 'bold', background: isActivated ? '#e8f8f0' : '#fef5e7', color: isActivated ? '#27ae60' : '#f39c12' }}>
                {isActivated ? <><FaCheckCircle /> Active</> : "● Inactive"}
             </span>
          </div>
        </div>

        <div className="profile-main-grid" style={{ display: 'grid', gridTemplateColumns: showPayment ? '1fr 1fr' : '1fr', gap: '20px' }}>
          {/* Enrollment & Billing Card */}
          <div className="summary-card" style={{ padding: '20px', border: '1px solid #eee', borderRadius: '12px', background: '#fff' }}>
            <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Enrollment & Billing</h3>
            <p><strong>Program:</strong> {user.program?.toUpperCase()}</p>
            
            {isActivated ? (
              <div style={{ marginTop: '20px' }}>
                <p style={{ color: '#27ae60' }}><strong>Access Valid Until:</strong> {expiryDate}</p>
                <button 
                  onClick={handlePrintReceipt}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 15px', background: '#f8f9fa', border: '1px solid #ddd', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  <FaPrint /> Print Last Receipt
                </button>
              </div>
            ) : (
              <button className="activate-trigger-btn" style={{ background: '#3498db', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }} onClick={() => setShowPayment(true)}>
                Pay $299.00 to Activate
              </button>
            )}
          </div>

          {/* Payment Form */}
          {showPayment && (
            <div className="payment-card-modern" style={{ padding: '20px', border: '2px solid #3498db', borderRadius: '12px', background: '#f4faff' }}>
              <h3>Secure Payment</h3>
              <form onSubmit={handlePayment}>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem' }}>Card Details</label>
                  <div style={{ position: 'relative' }}>
                    <FaCreditCard style={{ position: 'absolute', left: '10px', top: '12px', color: '#999' }} />
                    <input type="text" placeholder="4242 4242 4242 4242" required style={{ width: '100%', padding: '10px 10px 10px 35px', borderRadius: '5px', border: '1px solid #ccc' }} />
                  </div>
                </div>
                <button type="submit" style={{ width: '100%', padding: '12px', background: '#27ae60', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Pay Now
                </button>
                <button type="button" onClick={() => setShowPayment(false)} style={{ width: '100%', marginTop: '10px', background: 'transparent', border: 'none', color: '#e74c3c', cursor: 'pointer' }}>Cancel</button>
              </form>
            </div>
          )}
        </div>

        {/* Notices Section */}
        <div className="notice-board-grid" style={{ marginTop: '30px' }}>
          <div className="admin-card" style={{ padding: '20px', background: '#fff', borderRadius: '12px', border: '1px solid #eee' }}>
            <h3><FaBullhorn /> Educator Updates</h3>
            <div className="notices-container" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {isActivated ? (
                notices.map((n) => (
                  <div key={n.id} style={{ borderLeft: n.type === 'private' ? '5px solid #f1c40f' : '5px solid #3498db', padding: '15px', background: '#f9f9f9', borderRadius: '8px', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#666' }}>
                      <span><strong>Teacher {n.sender}</strong></span>
                      <span>{new Date(n.date).toLocaleDateString()}</span>
                    </div>
                    <p>{n.text}</p>
                    {n.type === 'private' && <span style={{ fontSize: '0.7rem', background: '#f1c40f', padding: '2px 6px', borderRadius: '4px' }}>PRIVATE</span>}
                  </div>
                ))
              ) : (
                <p style={{ textAlign: 'center', padding: '20px', color: '#999' }}><FaExclamationTriangle /> Please renew your subscription to see messages.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;