import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaCreditCard,
  FaGraduationCap,
  FaPaperPlane,
  FaCheckCircle,
} from "react-icons/fa";

const ProfilePage = ({ user }) => {
  const [showPayment, setShowPayment] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const [expiryDate, setExpiryDate] = useState("");

  const handlePayment = (e) => {
    e.preventDefault();
    
    // 1. Set Activation State
    setIsActivated(true);
    setShowPayment(false);

    // 2. Calculate Expiry Date (Current date + 1 Month)
    const today = new Date();
    const nextMonth = new Date(today.setMonth(today.getMonth() + 1));
    
    // Format date to: Month Day, Year (e.g., Jan 30, 2026)
    const formattedDate = nextMonth.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    
    setExpiryDate(formattedDate);
    alert("Payment Successful! Your account is now active.");
  };

  return (
    <section className="profile-section">
      <div className="profile-container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="user-meta">
            <div className="user-avatar">
              <FaUser />
            </div>
            <div>
              <h2>Welcome, {user.parentName}</h2>
              <p>Member since {new Date().getFullYear()}</p>
            </div>
          </div>
          
          <div className="status-container">
            {isActivated ? (
              <span className="status-badge activated">
                <FaCheckCircle /> Account Activated
              </span>
            ) : (
              <span className={`status-badge ${showPayment ? "processing" : "pending"}`}>
                ● Account Pending Activation
              </span>
            )}
          </div>
        </div>

        <div className="profile-main-grid">
          {/* Summary Card */}
          <div className="summary-card">
            <h3>Enrollment Summary</h3>
            <div className="summary-item">
              <span>Child Name:</span> <strong>{user.childName}</strong>
            </div>
            <div className="summary-item">
              <span>Selected Program:</span> <strong>{user.program}</strong>
            </div>
            
            {/* Show Expiry Date if Activated */}
            {isActivated && (
              <div className="summary-item expiry-info">
                <span>Valid Until:</span> <strong style={{color: '#27ae60'}}>{expiryDate}</strong>
              </div>
            )}

            {!isActivated && !showPayment && (
              <button
                className="activate-trigger-btn"
                onClick={() => setShowPayment(true)}
              >
                Pay to Activate Account
              </button>
            )}
          </div>

          {/* Payment Form */}
          {showPayment && (
            <div className="payment-card-modern fade-in">
              <h3>Secure Checkout</h3>
              <form className="modern-pay-form" onSubmit={handlePayment}>
                <div className="pay-input-group">
                  <label>Card Number</label>
                  <div className="input-with-icon">
                    <FaCreditCard />
                    <input type="text" placeholder="xxxx xxxx xxxx xxxx" required />
                  </div>
                </div>
                <button type="submit" className="final-pay-btn">
                  Confirm & Pay $299.00
                </button>
                <button
                  type="button"
                  className="cancel-pay"
                  onClick={() => setShowPayment(false)}
                >
                  Cancel
                </button>
              </form>
            </div>
          )}
        </div>

        {/* --- Communication Center --- */}
        <div className="notice-board-grid fade-in">
             {/* ... (rest of your notice board code) ... */}
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;