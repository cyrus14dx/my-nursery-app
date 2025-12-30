import React, { useState, useEffect } from "react";
import {
  FaGamepad,
  FaMusic,
  FaPalette,
  FaBus,
  FaAppleAlt,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaTwitter,
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaBaby,
  FaSchool,
  FaClock,
  FaCheckCircle,
  FaUser,
  FaLock,
  FaPaperPlane,
  FaChild,
  FaCreditCard,
} from "react-icons/fa";
// Added query, where, and getDocs to imports
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import nurseryImage1 from "./assets/img1.png";
import nurseryImage2 from "./assets/girl.jpg";
import nurseryImage3 from "./assets/boy-holding-green-container.jpg";
import "./App.css";
import { db } from "./firebase";
import Administration from "./administation.jsx";
// --- Navbar Component ---
const Navbar = ({ user, onLogout }) => {
  const [isActive, setIsActive] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navBar ${scrolled ? "scrolled" : ""}`}>
      <a href="#" className="logo">
        Kid<span>Kinder</span>
      </a>
      <div className={`navLinks ${isActive ? "active" : ""}`}>
        <a href="#home">Home</a>
        <a href="#services">Services</a>
        <a href="#programs">Programs</a>
        {!user ? (
          <a href="#register" className="nav-cta">
            Enroll Now
          </a>
        ) : (
          <button onClick={onLogout} className="nav-cta logout-nav">
            Logout
          </button>
        )}
      </div>
      <div className="hamburger" onClick={() => setIsActive(!isActive)}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  );
};
const ProfilePage = ({ user }) => {
  const [showPayment, setShowPayment] = useState(false);

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
            <span
              className={`status-badge ${
                showPayment ? "processing" : "pending"
              }`}
            >
              ● Account Pending Activation
            </span>
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

            {!showPayment && (
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
              <form
                className="modern-pay-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Payment Processed!");
                }}
              >
                <div className="pay-input-group">
                  <label>Card Number</label>
                  <div className="input-with-icon">
                    <FaCreditCard />
                    <input
                      type="text"
                      placeholder="xxxx xxxx xxxx xxxx"
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="final-pay-btn">
                  Confirm & Pay
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
          <div className="notice-card educator-note">
            <div className="notice-header">
              <FaGraduationCap className="notice-icon" />
              <h3>Educator's Notice</h3>
            </div>
            <div className="notice-content">
              <span className="notice-date">Today, 09:15 AM</span>
              <p>
                Welcome to the family! Once your account is activated, your
                child's primary educator will post daily activity reports, nap
                schedules, and meal updates here.
              </p>
              <div className="priority-tag">Information</div>
            </div>
          </div>

          <div className="notice-card parent-note">
            <div className="notice-header">
              <FaPaperPlane className="notice-icon" />
              <h3>Parent's Note to Staff</h3>
            </div>
            <div className="notice-content">
              <p className="note-placeholder">
                Have specific instructions for today (e.g., medicine, early
                pickup)?
              </p>
              <textarea
                className="parent-textarea"
                placeholder="Type a message to the teachers..."
                rows="3"
              ></textarea>
              <button className="send-note-btn">Update Teachers</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Header Component ---
const Header = () => (
  <header className="nursery-header" id="home">
    <div className="header-content">
      <span className="badge">Welcome to Kinder</span>
      <h1>
        Where Tiny Steps Lead to <span className="highlight">Big Dreams</span>
      </h1>
      <p className="intro-text">
        At <strong>Kinder</strong>, we believe every child deserves a magical
        start. Our nursery provides a nurturing environment where safety meets
        fun.
      </p>
    </div>
    <div className="header-image">
      <img src={nurseryImage1} alt="Nursery Play" className="floating-img" />
    </div>
  </header>
);

// --- Services Component ---
const Service = () => {
  const servicesData = [
    { title: "Play Ground", icon: <FaGamepad />, color: "#FF7675" },
    { title: "Music & Dance", icon: <FaMusic />, color: "#74B9FF" },
    { title: "Arts & Crafts", icon: <FaPalette />, color: "#55E6C1" },
    { title: "Safe Transport", icon: <FaBus />, color: "#FAD390" },
    { title: "Healthy Food", icon: <FaAppleAlt />, color: "#58B19F" },
    { title: "Education", icon: <FaGraduationCap />, color: "#A29BFE" },
  ];

  return (
    <section className="services-section" id="services">
      <div className="section-title">
        <h2>
          Why Choose <span>Us?</span>
        </h2>
      </div>
      <div className="services-container">
        {servicesData.map((item, index) => (
          <div key={index} className="service-card">
            <div className="service-icon" style={{ color: item.color }}>
              {item.icon}
            </div>
            <div className="service-info">
              <h3>{item.title}</h3>
              <p>
                Holistic development through play-based learning and expert
                care.
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// --- Programs Component ---
const Programs = () => {
  const plans = [
    {
      title: "Infant Daycare",
      icon: <FaBaby />,
      price: "450",
      age: "6 Months - 2 Years",
      color: "#eb4d4b",
      features: [
        "Organic Meals Included",
        "Individual Nap Schedules",
        "Tummy Time Play",
        "Daily Digital Reports",
      ],
    },
    {
      title: "Preschool Academy",
      icon: <FaSchool />,
      price: "550",
      age: "3 - 5 Years",
      color: "#17a2b8",
      features: [
        "Full Hot Lunch",
        "Phonics & STEM",
        "Potty Training Support",
        "Outdoor Exploration",
      ],
    },
    {
      title: "After School",
      icon: <FaClock />,
      price: "300",
      age: "6 - 12 Years",
      color: "#f0932b",
      features: [
        "Homework Assistance",
        "Healthy Evening Snacks",
        "Music Workshops",
        "Safe Bus Pick-up",
      ],
    },
  ];

  return (
    <section className="programs-section" id="programs">
      <div className="section-title">
        <span className="badge">Education Levels</span>
        <h2>
          Our Specialized <span>Programs</span>
        </h2>
      </div>
      <div className="programs-container">
        {plans.map((plan, index) => (
          <div key={index} className="program-card">
            <div
              className="program-header"
              style={{ "--accent": plan.color, backgroundColor: plan.color }}
            >
              <div className="program-icon">{plan.icon}</div>
              <h3>{plan.title}</h3>
              <div className="age-tag">{plan.age}</div>
            </div>
            <div className="program-body">
              <div className="program-price">
                <span className="currency">$</span>
                <span className="amount">{plan.price}</span>
                <span className="month">/Month</span>
              </div>
              <ul className="program-list">
                {plan.features.map((f, i) => (
                  <li key={i}>
                    <FaCheckCircle style={{ color: plan.color }} /> {f}
                  </li>
                ))}
              </ul>
              <a
                href="#register"
                className="program-btn"
                style={{ backgroundColor: plan.color }}
              >
                Enroll Now
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// --- Gallery Component ---
const Gallery = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [nurseryImage1, nurseryImage2, nurseryImage3];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <section className="gallery-section" id="gallery">
      <div className="section-title">
        <h2>
          Our <span>Gallery</span>
        </h2>
      </div>
      <div className="slideshow-container">
        {images.map((img, index) => (
          <div
            key={index}
            className={`slide ${index === currentIndex ? "active" : ""}`}
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}
        <div className="dots">
          {images.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentIndex ? "active" : ""}`}
              onClick={() => setCurrentIndex(index)}
            ></span>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Teachers Component ---
const Teachers = () => {
  const teachersData = [
    {
      name: "Julia Smith",
      role: "Music Teacher",
      img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    },
    {
      name: "Jhon Doe",
      role: "Language Teacher",
      img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    },
    {
      name: "Mollie Ross",
      role: "Dance Teacher",
      img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    },
    {
      name: "Donald John",
      role: "Art Teacher",
      img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    },
  ];

  return (
    <section className="teachers-section" id="teachers">
      <div className="section-title">
        <h2>
          Meet <span>Our Teachers</span>
        </h2>
      </div>
      <div className="teachers-grid">
        {teachersData.map((teacher, index) => (
          <div key={index} className="teacher-card">
            <div className="teacher-img-container">
              <img src={teacher.img} alt={teacher.name} />
              <div className="social-overlay">
                <FaTwitter />
                <FaFacebookF />
                <FaLinkedinIn />
              </div>
            </div>
            <h3>{teacher.name}</h3>
            <p>{teacher.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

// --- Register Component ---
const Register = ({ onRegisterSuccess }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    parentName: "",
    childName: "",
    email: "",
    program: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- SPECIAL ADMIN OVERRIDE ---
    // If these credentials are used, take them straight to admin
    if (
      isLogin &&
      formData.email === "admin@kinder.com" &&
      formData.password === "admin123"
    ) {
      onRegisterSuccess({
        email: "admin@kinder.com",
        parentName: "Administrator",
        isAdmin: true,
      });
      return;
    }

    if (!isLogin) {
      // REGISTRATION LOGIC
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      try {
        await addDoc(collection(db, "registrations"), {
          parentName: formData.parentName,
          childName: formData.childName,
          email: formData.email,
          program: formData.program,
          password: formData.password,
          submittedAt: new Date(),
        });
        onRegisterSuccess(formData);
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        alert("Error connecting to database.");
      }
    } else {
      // REGULAR LOGIN LOGIC
      try {
        const q = query(
          collection(db, "registrations"),
          where("email", "==", formData.email)
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          alert("Email not found. Please register first!");
          return;
        }

        let userFound = null;
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.password === formData.password) {
            userFound = data;
          }
        });

        if (userFound) {
          onRegisterSuccess(userFound);
        } else {
          alert("Wrong password or email.");
        }
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        alert("Login failed. Check your connection.");
      }
    }
  };

  return (
    <section className="register-section" id="register">
      <div className="register-container">
        <div className="register-info">
          <span className="badge">
            {isLogin ? "Member Area" : "Enrollment 2025"}
          </span>
          <h2>
            {isLogin ? "Access Your" : "Enroll Your"} <span>Child</span>
          </h2>
          <p className="description">
            {isLogin
              ? "Log in to track your child's daily activities, view reports, and manage your account."
              : "Join our community of happy parents. Our enrollment process is simple and secure."}
          </p>
          {!isLogin && (
            <div className="benefits-list">
              <div className="step">
                <FaCheckCircle /> Certified expert caretakers
              </div>
              <div className="step">
                <FaCheckCircle /> Real-time activity tracking
              </div>
              <div className="step">
                <FaCheckCircle /> Nutritious organic meal plans
              </div>
            </div>
          )}
        </div>

        <div className="register-card">
          <div className="form-toggle">
            <button
              className={!isLogin ? "active" : ""}
              onClick={() => setIsLogin(false)}
              type="button"
            >
              Register
            </button>
            <button
              className={isLogin ? "active" : ""}
              onClick={() => setIsLogin(true)}
              type="button"
            >
              Log In
            </button>
          </div>

          <form className="register-form" onSubmit={handleSubmit}>
            {!isLogin ? (
              <>
                <div className="input-row">
                  <div className="input-group">
                    <FaUser className="input-icon" />
                    <input
                      type="text"
                      name="parentName"
                      placeholder="Parent Name"
                      value={formData.parentName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="input-group">
                    <FaChild className="input-icon" />
                    <input
                      type="text"
                      name="childName"
                      placeholder="Child Name"
                      value={formData.childName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="input-group">
                  <FaEnvelope className="input-icon" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="input-group">
                  <FaSchool className="input-icon" />
                  <select
                    name="program"
                    className="input-select"
                    value={formData.program}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>
                      Select a Program
                    </option>
                    <option value="infant">Infant Daycare (6m - 2y)</option>
                    <option value="preschool">
                      Preschool Academy (3y - 5y)
                    </option>
                    <option value="afterschool">After School (6y - 12y)</option>
                  </select>
                </div>
                <div className="input-row">
                  <div className="input-group">
                    <FaLock className="input-icon" />
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="input-group">
                    <FaLock className="input-icon" />
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="input-group">
                  <FaEnvelope className="input-icon" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="input-group">
                  <FaLock className="input-icon" />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            )}
            <button type="submit" className="register-btn">
              {isLogin ? "Sign In" : "Complete Registration"}
            </button>
            <p className="switch-text">
              {isLogin ? "New to Kinder?" : "Already have an account?"}
              <span onClick={() => setIsLogin(!isLogin)}>
                {" "}
                {isLogin ? "Register here" : "Login here"}
              </span>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

// --- Footer Component ---
const Footer = () => (
  <footer className="main-footer" id="contact">
    <div className="footer-top">
      <div className="footer-col brand-info">
        <h2 className="footer-logo">
          {" "}
          Kid<span>Kinder</span>
        </h2>
        <p>
          Empowering the next generation through playful learning and certified
          expert care.
        </p>
        <div className="social-links-modern">
          <a href="#">
            <FaFacebookF />
          </a>
          <a href="#">
            <FaTwitter />
          </a>
          <a href="#">
            <FaInstagram />
          </a>
          <a href="#">
            <FaLinkedinIn />
          </a>
        </div>
      </div>

      <div className="footer-col">
        <h3>Contact Info</h3>
        <div className="contact-card-mini">
          <div className="c-info">
            <FaMapMarkerAlt className="c-icon-main" />{" "}
            <div>
              <span>Location</span>
              <p>123 Education Lane, NY</p>
            </div>
          </div>
          <div className="c-info">
            <FaPhoneAlt className="c-icon-main" />{" "}
            <div>
              <span>Phone</span>
              <p>+1 (555) 000-1234</p>
            </div>
          </div>
          <div className="c-info">
            <FaEnvelope className="c-icon-main" />{" "}
            <div>
              <span>Email</span>
              <p>hello@kidkinder.com</p>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-col message-col">
        <h3>Send a Message</h3>
        <form
          className="modern-contact-form"
          onSubmit={(e) => e.preventDefault()}
        >
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Email Address" required />
          <textarea placeholder="How can we help?" rows="3" required></textarea>
          <button type="submit" className="send-msg-btn">
            Send Message <FaPaperPlane />
          </button>
        </form>
      </div>
    </div>
    <div className="footer-bottom-bar">
      <p>&copy; {new Date().getFullYear()} KidKinder Nursery.</p>
    </div>
  </footer>
);

// --- MAIN APP COMPONENT ---
export default function App() {
  const [userProfile, setUserProfile] = useState(null);

  const handleRegisterSuccess = (data) => {
    setUserProfile(data);
    window.scrollTo(0, 0);
  };

  const handleLogout = () => {
    setUserProfile(null);
  };
  if (userProfile?.email === "admin@kinder.com") {
    return <Administration onLogout={() => setUserProfile(null)} />;
  }
  return (
    <div className="App">
      <Navbar user={userProfile} onLogout={handleLogout} />

      {userProfile ? (
        <ProfilePage user={userProfile} onLogout={handleLogout} />
      ) : (
        <>
          <Header />
          <Service />
          <Programs />
          <Gallery />
          <Teachers />
          <Register onRegisterSuccess={handleRegisterSuccess} />
        </>
      )}

      <Footer />
    </div>
  );
}
