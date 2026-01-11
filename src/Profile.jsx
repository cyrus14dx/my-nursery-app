import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaCreditCard,
  FaCheckCircle,
  FaBullhorn,
  FaExclamationTriangle,
} from "react-icons/fa";
import { collection, query, where, onSnapshot } from "firebase/firestore"; // Changed to onSnapshot
import { db } from "./firebase";

const ProfilePage = ({ user }) => {
  const [showPayment, setShowPayment] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const [expiryDate, setExpiryDate] = useState(null);
  const [notices, setNotices] = useState([]);

  // 1. REAL-TIME FETCH: Private and Broadcast Notices
  useEffect(() => {
    if (!user.id || !user.program) return;

    // We listen to all notices in the program
    const q = query(
      collection(db, "notices"),
      where("program", "==", user.program)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allNotices = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

      // Filter locally: Show if it's a broadcast OR if it's private to THIS user.id
      const myFilteredNotices = allNotices
        .filter(n => n.type === "broadcast" || n.recipientId === user.id)
        .sort((a, b) => new Date(b.date) - new Date(a.date)); // Newest first

      setNotices(myFilteredNotices);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [user.program, user.id]);

  // 2. SUBSCRIPTION CHECK: Runs on load
  useEffect(() => {
    const savedExpiry = localStorage.getItem(`expiry_${user.id}`);
    if (savedExpiry) {
      const expiry = new Date(savedExpiry);
      const now = new Date();

      if (now < expiry) {
        setIsActivated(true);
        setExpiryDate(expiry.toLocaleDateString());
      } else {
        setIsActivated(false);
        setExpiryDate(null);
        localStorage.removeItem(`expiry_${user.id}`); // Clear expired data
      }
    }
  }, [user.id]);

  // 3. PAYMENT HANDLER: Sets 30-day access
  const handlePayment = (e) => {
    e.preventDefault();
    
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setDate(today.getDate() + 30); // 30 days from now

    const expiryString = nextMonth.toISOString();

    setIsActivated(true);
    setExpiryDate(nextMonth.toLocaleDateString());
    
    // Save to localStorage for persistence
    localStorage.setItem(`expiry_${user.id}`, expiryString);
    
    setShowPayment(false);
    alert("Payment Successful! Your 30-day subscription is active.");
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
              <p>Child: <strong>{user.childName}</strong></p>
            </div>
          </div>
          
          <div className="status-container">
            {isActivated ? (
              <span className="status-badge activated">
                <FaCheckCircle /> Subscription Active
              </span>
            ) : (
              <span className="status-badge pending">
                <FaExclamationTriangle /> Subscription Expired
              </span>
            )}
          </div>
        </div>

        <div className="profile-main-grid">
          {/* Billing Info */}
          <div className="summary-card">
            <h3>Enrollment & Billing</h3>
            <div className="summary-item">
              <span>Program:</span> <strong>{user.program?.toUpperCase()}</strong>
            </div>
            
            {isActivated ? (
              <div className="summary-item expiry-info">
                <span>Next Billing Date:</span> <strong style={{color: '#27ae60'}}>{expiryDate}</strong>
              </div>
            ) : (
              <div className="renewal-notice">
                <p>Access expired. Please renew to view teacher messages.</p>
                <button className="activate-trigger-btn" onClick={() => setShowPayment(true)}>
                  Renew Subscription (DZD 450.00)
                </button>
              </div>
            )}
          </div>

          {/* Payment UI */}
{showPayment && (
  <div className="payment-overlay">
    <div className="payment-card-modern fade-in">
      <div className="payment-header">
        <h3>Secure Checkout</h3>
        <p>Complete your transaction securely</p>
      </div>

      <form className="modern-pay-form" onSubmit={handlePayment}>
        <div className="pay-input-group">
          <label>Cardholder Name</label>
          <input type="text" placeholder="John Doe" required />
        </div>

        <div className="pay-input-group">
          <label>Card Number</label>
          <div className="input-with-icon">
            <FaCreditCard />
            <input type="text" placeholder="0000 0000 0000 0000" required />
          </div>
        </div>

        <div className="pay-row">
          <div className="pay-input-group">
            <label>Expiry Date</label>
            <input type="text" placeholder="MM/YY" required />
          </div>
          <div className="pay-input-group">
            <label>CVC</label>
            <input type="text" placeholder="123" required />
          </div>
        </div>

        <button type="submit" className="final-pay-btn">
          Confirm & Pay
        </button>
        
        <button type="button" className="cancel-pay" onClick={() => setShowPayment(false)}>
          Back to Summary
        </button>
      </form>
      
      <div className="trust-badges">
        <span> SSL Encrypted</span>
        <span> Secured by Stripe</span>
      </div>
    </div>
  </div>
)}
        </div>

        {/* --- Communication Center --- */}
        <div className="notice-board-grid fade-in" style={{ marginTop: '30px' }}>
          <div className="admin-card">
            <h3><FaBullhorn /> Educator Updates</h3>
            <div className="notices-container" style={{ maxHeight: '400px', overflowY: 'auto', padding: '10px' }}>
              {isActivated ? (
                notices.length > 0 ? (
                  notices.map((n) => (
                    <div key={n.id} className={`notice-item ${n.type === 'private' ? 'private-msg' : ''}`} 
                         style={{ borderLeft: n.type === 'private' ? '5px solid #f1c40f' : '5px solid #3498db', marginBottom: '10px', padding: '15px', background: '#f9f9f9', borderRadius: '8px'}}>
                      <div className="notice-meta" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#666' }}>
                        <span><strong>Teacher {n.sender}</strong></span>
                        <span>{new Date(n.date).toLocaleDateString()}</span>
                      </div>
                      <p className="notice-text" style={{ margin: '10px 0' }}>{n.text}</p>
                      {n.type === 'private' && (
                        <span style={{ fontSize: '0.7rem', background: '#f1c40f', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                          PRIVATE MESSAGE
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="empty-msg">No notices for your program yet.</p>
                )
              ) : (
                <div className="locked-content" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                  <FaExclamationTriangle size={30} />
                  <p>Please renew your subscription to view educator messages.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;