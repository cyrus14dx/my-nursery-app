import React, { useState, useEffect, useRef } from "react";
import {
  FaUser,
  FaCreditCard,
  FaCheckCircle,
  FaBullhorn,
  FaExclamationTriangle,
  FaPrint,
  FaLock
} from "react-icons/fa";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "./firebase";

const ProfilePage = ({ user }) => {
  const [showPayment, setShowPayment] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const [expiryDate, setExpiryDate] = useState(null);
  const [notices, setNotices] = useState([]);

  // Fetch Notices from Firebase
  useEffect(() => {
    if (!user.id || !user.program) return;

    // Listen for notices matching the student's program
    const q = query(
      collection(db, "notices"),
      where("program", "==", user.program),
      orderBy("date", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allNotices = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      
      // Filter logic: Show if it's a Broadcast OR if it's Private but intended for this specific parent/student
      const myFilteredNotices = allNotices.filter(n => 
        n.recipientType === "Broadcast" || n.targetId === user.id
      );
      
      setNotices(myFilteredNotices);
    });

    return () => unsubscribe();
  }, [user.program, user.id]);

  // Check Local Storage for Activation
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
    
    const paymentRecord = {
      date: new Date().toLocaleDateString(),
      amount: "$299.00",
      ref: `TRX-${Math.floor(Math.random() * 1000000)}`
    };
    localStorage.setItem(`last_payment_${user.id}`, JSON.stringify(paymentRecord));

    setShowPayment(false);
    alert("Payment Successful! Profile Activated.");
  };

  const handlePrintReceipt = () => {
    const lastPay = JSON.parse(localStorage.getItem(`last_payment_${user.id}`));
    if (!lastPay) return alert("No recent payment found.");

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head><title>Receipt - ${user.childName}</title></head>
        <body style="font-family: sans-serif; padding: 40px;">
          <h2 style="color: #eb4d4b;">KinderCare Receipt</h2>
          <hr/>
          <p><strong>Parent:</strong> ${user.parentName}</p>
          <p><strong>Student:</strong> ${user.childName}</p>
          <p><strong>Transaction:</strong> ${lastPay.ref}</p>
          <p><strong>Amount:</strong> ${lastPay.amount}</p>
          <p><strong>Valid Until:</strong> ${expiryDate}</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <section className="profile-section">
      <div className="profile-container">
        
        {/* Header Section */}
        <div className="profile-header">
          <div className="user-meta">
            <div className="user-avatar"><FaUser /></div>
            <div>
              <h2>Welcome, {user.parentName}</h2>
              <p>Child: <strong>{user.childName}</strong> | Program: <strong>{user.program}</strong></p>
            </div>
          </div>
          <div className="status-container">
             <span className={`status-badge ${isActivated ? 'activated' : 'pending'}`}>
                {isActivated ? <><FaCheckCircle /> Account Active</> : "● Payment Pending"}
             </span>
          </div>
        </div>

        {/* Billing and Activation Grid */}
        <div className="profile-main-grid" style={{ gridTemplateColumns: showPayment ? '1fr 1fr' : '1fr' }}>
          
          <div className="summary-card">
            <h3>Enrollment Summary</h3>
            <div className="summary-item">
              <span>Program Type</span>
              <strong className="capitalize">{user.program}</strong>
            </div>
            <div className="summary-item">
              <span>Monthly Fee</span>
              <strong>$299.00</strong>
            </div>
            
            {isActivated ? (
              <div className="expiry-info fade-in">
                <p style={{ color: '#27ae60', fontWeight: 'bold' }}>✓ Subscription active until {expiryDate}</p>
                <button onClick={handlePrintReceipt} className="final-pay-btn" style={{background: '#636e72'}}>
                  <FaPrint /> Print Receipt
                </button>
              </div>
            ) : (
              <button className="activate-trigger-btn" onClick={() => setShowPayment(true)}>
                Activate & Pay Now
              </button>
            )}
          </div>

          {showPayment && (
            <div className="payment-card-modern fade-in">
              <h3 style={{textAlign: 'center', marginBottom: '20px'}}>Secure Payment</h3>
              <form onSubmit={handlePayment}>
                <div className="pay-input-group">
                  <label>Card Number</label>
                  <div className="input-with-icon">
                    <FaCreditCard />
                    <input type="text" placeholder="4242 4242 4242 4242" required />
                  </div>
                </div>
                <div className="pay-row">
                   <div className="pay-input-group">
                     <label>Expiry</label>
                     <input type="text" placeholder="MM/YY" required />
                   </div>
                   <div className="pay-input-group">
                     <label>CVV</label>
                     <input type="text" placeholder="123" required />
                   </div>
                </div>
                <button type="submit" className="final-pay-btn">Confirm Payment</button>
                <button type="button" className="cancel-pay" onClick={() => setShowPayment(false)}>Cancel</button>
              </form>
            </div>
          )}
        </div>

        {/* NOTICES SECTION - Connected to Educator */}
        <div className="notice-board-grid">
          <div className="notice-card parent-note" style={{width: '100%'}}>
            <div className="notice-header">
              <FaBullhorn className="notice-icon" />
              <h3>Messages from {user.program} Educators</h3>
            </div>
            
            <div className="notices-container" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {!isActivated ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <FaLock size={40} style={{ color: '#ccc', marginBottom: '15px' }} />
                  <p style={{ color: '#777' }}>Please activate your account to view messages and updates from your child's teacher.</p>
                </div>
              ) : notices.length > 0 ? (
                notices.map((n) => (
                  <div key={n.id} className="fade-in" style={{ 
                    padding: '15px', 
                    background: n.recipientType === 'Private' ? '#fff9db' : '#f1f2f6', 
                    borderRadius: '12px', 
                    marginBottom: '15px',
                    borderLeft: n.recipientType === 'Private' ? '5px solid #f1c40f' : '5px solid #74B9FF'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{fontWeight: 'bold', fontSize: '0.9rem'}}>Teacher {n.sender}</span>
                      <span className="notice-date">{new Date(n.date).toLocaleDateString()}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.95rem', color: '#2d3436' }}>{n.text}</p>
                    {n.recipientType === 'Private' && (
                      <span className="priority-tag" style={{background: '#f1c40f', color: '#000'}}>Private Message</span>
                    )}
                  </div>
                ))
              ) : (
                <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>No updates at this time.</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ProfilePage;