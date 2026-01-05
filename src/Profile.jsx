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
                  style={{ margin:'5px',display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 15px', background: '#f8f9fa', border: '1px solid #ddd', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
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
           <div className="payment-card-modern fade-in" style={{ 
  padding: '35px', 
  border: 'none', 
  borderRadius: '24px', 
  background: '#ffffff',
  boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
  maxWidth: '450px',
  margin: '0 auto'
}}>
  <div style={{ textAlign: 'center', marginBottom: '25px' }}>
    <h3 style={{ margin: '0 0 10px 0', color: '#00394f', fontSize: '1.5rem' }}>Secure Checkout</h3>
    <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>Transaction is encrypted and secure</p>
  </div>

  {/* Visual Card Preview */}
  <div style={{
    background: 'linear-gradient(135deg, #3498db 0%, #217dbb 100%)',
    padding: '20px',
    borderRadius: '15px',
    color: 'white',
    marginBottom: '30px',
    boxShadow: '0 10px 20px rgba(52, 152, 219, 0.3)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '160px'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <FaCreditCard size={30} />
      <span style={{ fontSize: '0.8rem', opacity: 0.8, fontWeight: 'bold' }}>CREDIT / DEBIT</span>
    </div>
    <div style={{ fontSize: '1.2rem', letterSpacing: '4px', textAlign: 'center' }}>
      ••••  ••••  ••••  4242
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem' }}>
      <div>
        <span style={{ display: 'block', opacity: 0.7 }}>CARD HOLDER</span>
        <span style={{ fontSize: '0.9rem', textTransform: 'uppercase' }}>{user.parentName}</span>
      </div>
      <div style={{ textAlign: 'right' }}>
        <span style={{ display: 'block', opacity: 0.7 }}>EXPIRES</span>
        <span style={{ fontSize: '0.9rem' }}>MM/YY</span>
      </div>
    </div>
  </div>

  <form className="modern-pay-form" onSubmit={handlePayment} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
    
    {/* Card Number */}
    <div className="pay-input-group">
      <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '600', color: '#444' }}>Card Number</label>
      <div className="input-with-icon" style={{ position: 'relative' }}>
        <FaCreditCard style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#3498db' }} />
        <input 
          type="text" 
          placeholder="4242 4242 4242 4242" 
          required 
          style={{ width: '100%', padding: '14px 14px 14px 45px', borderRadius: '12px', border: '2px solid #edf2f7', fontSize: '1rem', outline: 'none', transition: '0.3s' }} 
        />
      </div>
    </div>

    {/* Expiry and CVV Row */}
    <div className="pay-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '600', color: '#444' }}>Expiry Date</label>
        <input 
          type="text" 
          placeholder="MM / YY" 
          required 
          style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid #edf2f7', fontSize: '1rem', outline: 'none' }} 
        />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '600', color: '#444' }}>CVV</label>
        <input 
          type="text" 
          placeholder="123" 
          required 
          style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid #edf2f7', fontSize: '1rem', outline: 'none' }} 
        />
      </div>
    </div>

    <div style={{ marginTop: '10px' }}>
      <button type="submit" className="final-pay-btn" style={{ 
        width: '100%', 
        padding: '16px', 
        background: '#27ae60', 
        color: '#fff', 
        border: 'none', 
        borderRadius: '14px', 
        fontWeight: '700', 
        fontSize: '1.1rem',
        cursor: 'pointer',
        boxShadow: '0 10px 20px rgba(39, 174, 96, 0.2)',
        transition: '0.3s'
      }}>
        Pay $299.00 Now
      </button>
      
      <button 
        type="button" 
        className="cancel-pay" 
        onClick={() => setShowPayment(false)} 
        style={{ 
          width: '100%', 
          marginTop: '15px', 
          background: 'transparent', 
          border: 'none', 
          color: '#e74c3c', 
          fontWeight: '600',
          cursor: 'pointer',
          fontSize: '0.9rem'
        }}
      >
        Cancel Transaction
      </button>
    </div>
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