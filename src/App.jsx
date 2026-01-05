/* eslint-disable no-unused-vars */
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
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import nurseryImage1 from "./assets/img1.png";
import nurseryImage2 from "./assets/girl.jpg";
import nurseryImage3 from "./assets/boy-holding-green-container.jpg";
import "./App.css";
import { db } from "./firebase";

// Components
import Administration from "./administation";
import EducatorProfile from "./EducatorProfile";
import ProfilePage from "./Profile";
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

// --- Header Component ---
const Header = () => (
  <header className="nursery-header" id="home">
    <div className="header-content">
      <span className="badge">Welcome to kidKinder</span>
      <h1>
        Where Tiny Steps Lead to <span className="highlight">Big Dreams</span>
      </h1>
      <p className="intro-text">
        At <strong>kidKinder</strong>, we believe every child deserves a magical
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
    { title: "Play Ground", icon: <FaGamepad />, color: "#FF7675", description:"A safe and fun outdoor space where children play, explore, and develop their physical skills through guided activities." },
    { title: "Music & Dance", icon: <FaMusic />, color: "#74B9FF", description:"Fun music and movement sessions that help children express themselves, build confidence, and improve coordination." },
    { title: "Arts & Crafts", icon: <FaPalette />, color: "#55E6C1",description:"Creative activities that encourage imagination, fine motor skills, and self-expression through drawing, painting, and crafting." },
    { title: "Safe Transport", icon: <FaBus />, color: "#FAD390", description:"Reliable and secure transportation to ensure children travel safely between home and the nursery with trained staff supervision." },
    { title: "Healthy Food", icon: <FaAppleAlt />, color: "#58B19F", description:"Nutritious, balanced meals prepared to support children’s growth, energy, and overall well-being." },
    { title: "Education", icon: <FaGraduationCap />, color: "#A29BFE", description:"Age-appropriate learning programs that support early literacy, numeracy, and social development in a caring environment." },
  ];

  return (
    <section className="services-section" id="services">
      <div className="section-title">
        <h2>
          What We <span>Offer?</span>
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
                {item.description}
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
      name: "Larbi Youcef",
      role: "Daycare",
      img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    },
    {
      name: "Amine Kerada",
      role: "Preschool",
      img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    },
    {
      name: "Meddad abelrrehman",
      role: "Daycare",
      img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    },
    {
      name: "Djilali ilyas",
      role: "After School",
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

    // 1. ADMIN CHECK
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

    try {
      if (isLogin) {
        // 2. CHECK EDUCATORS BY EMAIL
        const eduQ = query(
          collection(db, "educators"),
          where("email", "==", formData.email)
        );
        const eduSnap = await getDocs(eduQ);

        if (!eduSnap.empty) {
          const eduData = eduSnap.docs[0].data();
          if (eduData.password === formData.password) {
            onRegisterSuccess({
              ...eduData,
              id: eduSnap.docs[0].id,
              role: "educator",
            });
            return;
          }
        }

        // 3. CHECK REGISTRATIONS (Parents)
        const parentQ = query(
          collection(db, "registrations"),
          where("email", "==", formData.email)
        );
        const parentSnap = await getDocs(parentQ);

        if (!parentSnap.empty) {
          const parentData = parentSnap.docs[0].data();
          if (parentData.password === formData.password) {
            onRegisterSuccess({
              ...parentData,
              id: parentSnap.docs[0].id,
              role: "parent",
            });
            return;
          }
        }
        alert("Invalid Email or Password");
      } else {
        // --- FIXED REGISTRATION LOGIC ---
        if (formData.password !== formData.confirmPassword) {
          alert("Passwords do not match!");
          return;
        }

        if (!formData.program) {
          alert("Please select a program!");
          return;
        }

        const newParent = {
          parentName: formData.parentName,
          childName: formData.childName,
          email: formData.email,
          program: formData.program,
          password: formData.password,
          role: "parent",
          createdAt: new Date().toISOString(),
        };

        // Save to Firebase
        const docRef = await addDoc(collection(db, "registrations"), newParent);

        // Send to Profile Page immediately
        onRegisterSuccess({ ...newParent, id: docRef.id });
        alert("Registration Successful!");
      }
    } catch (error) {
      console.error("Firebase Error:", error);
      alert("Error connecting to database.");
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
              <p>14 , tiaret </p>
            </div>
          </div>
          <div className="c-info">
            <FaPhoneAlt className="c-icon-main" />{" "}
            <div>
              <span>Phone</span>
              <p>+213554093528</p>
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

  // Helper function to render the correct view
  const renderView = () => {
    // 1. If not logged in, show Landing Page
    if (!userProfile) {
      return (
        <>
          <Navbar user={null} onLogout={handleLogout} />
          <Header />
          <Service />
          <Programs />
          <Gallery />
          <Teachers />
          <Register onRegisterSuccess={handleRegisterSuccess} />
          <Footer />
        </>
      );
    }

    // 2. If Admin
    if (userProfile.isAdmin || userProfile.email === "admin@kinder.com") {
      return <Administration onLogout={handleLogout} />;
    }

    // 3. If Educator
    if (userProfile.role === "educator") {
      return <EducatorProfile user={userProfile} onLogout={handleLogout} />;
    }

    // 4. Default: Parent Profile Page
    return (
      <>
        <Navbar user={userProfile} onLogout={handleLogout} />
        <ProfilePage user={userProfile} onLogout={handleLogout} />
        <Footer />
      </>
    );
  };

  return <div className="App">{renderView()}</div>;
}
