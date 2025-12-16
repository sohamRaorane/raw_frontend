import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

// 1. IMPORT THE MAIN GROUP IMAGE (For the bottom visual)
import agentsImg from "../assets/WhatsApp Image 2025-12-14 at 15.47.35_e5cb377f.jpg";

// 2. IMPORT THE 3 INDIVIDUAL CIVILIAN IMAGES
import ayushCivImg from "../assets/ayush_civ.jpg";
import omCivImg from "../assets/om_civ.jpg";
import sohamCivImg from "../assets/soham_civ.jpg";

export default function Landing() {
  const { user } = useAuth();
  const [loaded, setLoaded] = useState(false);
  const [modalActive, setModalActive] = useState(false);

  useEffect(() => {
    // --- 1. Hero Animation on Load ---
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 300);

    // --- 2. Scroll Animations (Intersection Observer) ---
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
      }
    );

    const scrollElements = document.querySelectorAll(
      ".profile-card, .feature-box"
    );
    scrollElements.forEach((el) => {
      observer.observe(el);
    });

    return () => {
      clearTimeout(timer);
      scrollElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const openModal = (e) => {
    e.preventDefault();
    setModalActive(true);
  };

  const closeModal = () => {
    setModalActive(false);
  };

  return (
    <div className="landing-page">
      {/* Background Doodles */}
      <div className="bg-doodles">
        <i className="fas fa-crosshairs doodle d-1"></i>
        <i className="fas fa-shield-alt doodle d-2"></i>
        <i className="fas fa-user-secret doodle d-3"></i>
        <i className="fas fa-fingerprint doodle d-4"></i>
        <i className="fas fa-file-contract doodle d-5"></i>
        <i className="fas fa-lock doodle d-6"></i>
        <i className="fas fa-satellite doodle d-7"></i>
        <i className="fas fa-microchip doodle d-8"></i>
      </div>

      <nav className="navbar">
        <div className="nav-brand">RAW AGENTS</div>
        <div className="nav-links">
          {user ? (
            <Link to="/dashboard" id="login-btn" className="active">
              DASHBOARD
            </Link>
          ) : (
            <>
              <Link to="/signup" id="signin-btn">
                Sign In
              </Link>
              <Link to="/login" id="login-btn" className="active">
                Log In
              </Link>
            </>
          )}
        </div>
      </nav>

      <section className="hero-section">
        <div className={`hero-content ${loaded ? "loaded" : ""}`}>
          <h1 className="hero-title">
            SECURE. <span className="highlight">UNTRACEABLE.</span> ELITE.
          </h1>
          <p className="hero-subtitle">
            The ultimate encrypted communication network for field operatives.
            <br />
            Your mission is our priority.
          </p>
          {user ? (
            <Link to="/dashboard" className="cta-button">
              ACCESS DASHBOARD
            </Link>
          ) : (
            <Link to="/signup" className="cta-button">
              INITIATE PROTOCOL
            </Link>
          )}
        </div>
      </section>

      <section className="agents-profiles-section">
        <h2 className="section-title">operative status</h2>
        <div className="profiles-container">

          {/* AYUSH CARD */}
          <div className="profile-card hidden-on-scroll">
            <div className="profile-img-wrapper">
              {/* Using specific civilian image */}
              <img src={ayushCivImg} alt="Ayush" className="profile-img" />
              <div className="img-scanner-overlay"></div>
            </div>
            <div className="profile-name">AYUSH</div>
            <div className="profile-marker"></div>
            <div className="profile-codename">"Tez‑tarrār Genius"</div>
            <p>
              Tactical intelligence and rapid strategy deployment. Specializes in
              hostile environment navigation.
            </p>
          </div>

          {/* OM CARD */}
          <div className="profile-card hidden-on-scroll">
            <div className="profile-img-wrapper">
              {/* Using specific civilian image */}
              <img src={omCivImg} alt="Om" className="profile-img" />
              <div className="img-scanner-overlay"></div>
            </div>
            <div className="profile-name">OM</div>
            <div className="profile-marker"></div>
            <div className="profile-codename">"Asli Yoddha"</div>
            <p>
              Heavy weapons specialist and squad leader. Frontline assault and
              defense capabilities.
            </p>
          </div>

          {/* SOHAM CARD */}
          <div className="profile-card hidden-on-scroll">
            <div className="profile-img-wrapper">
              {/* Using specific civilian image */}
              <img src={sohamCivImg} alt="Soham" className="profile-img" />
              <div className="img-scanner-overlay"></div>
            </div>
            <div className="profile-name">SOHAM</div>
            <div className="profile-marker"></div>
            <div className="profile-codename">"System ka Ustad"</div>
            <p>
              Cyber warfare and encryption expert. Controls the digital
              battlefield and comms.
            </p>
          </div>

        </div>
      </section>

      <section className="mid-page-visual">
        <div className="visual-container">
          <img
            src={agentsImg}
            alt="RAW Agents Team"
            className="mid-agents-img"
          />
          <div className="visual-overlay"></div>
        </div>
      </section>

      <section className="features-section">
        <h2 className="section-title">Mission Capabilities</h2>
        <div className="features-grid">
          <div className="feature-box hidden-on-scroll">
            <i className="fas fa-user-secret feature-icon"></i>
            <h3 className="feature-title">Ghost Protocol</h3>
            <p>Untraceable messaging with military-grade end-to-end encryption.</p>
          </div>
          <div className="feature-box hidden-on-scroll">
            <i className="fas fa-bomb feature-icon"></i>
            <h3 className="feature-title">Self-Destruct Comms</h3>
            <p>
              Set timers for messages to vaporize after being read. Leave no
              trace.
            </p>
          </div>
          <div className="feature-box hidden-on-scroll">
            <i className="fas fa-satellite-dish feature-icon"></i>
            <h3 className="feature-title">Tactical Live Intel</h3>
            <p>
              Share real-time coordinates on a secure ops map during active
              missions.
            </p>
          </div>
        </div>
      </section>

      <footer className="footer-section">
        <div className="footer-content">
          <div className="footer-brand">RAW AGENTS</div>
          <div className="footer-links">
            <a href="#">Protocol</a>
            <a href="#">Intel</a>
            <a href="#">Contact</a>
          </div>
          <div className="footer-socials">
            <i className="fab fa-twitter"></i>
            <i className="fab fa-github"></i>
            <i className="fas fa-shield-alt"></i>
          </div>
          <div className="footer-copyright">
            &copy; {new Date().getFullYear()} RAW INTELLIGENCE AGENCY. ALL RIGHTS RESERVED. <br />
            <span className="classified-text">CLASSIFIED // TOP SECRET</span>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <div
        className={`login-modal ${modalActive ? "active" : ""}`}
        id="loginModal"
        onClick={(e) => {
          if (e.target.id === 'loginModal') closeModal();
        }}
      >
        <div className="login-box">
          <i
            className="fas fa-times close-btn"
            id="closeModal"
            onClick={closeModal}
          ></i>
          <h2 className="login-title">ACCESS TERMINAL</h2>
          <form>
            <div className="input-group">
              <label htmlFor="agent-id">AGENT ID //:</label>
              <input
                type="text"
                id="agent-id"
                required
                placeholder="Enter ID..."
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">PASSCODE //:</label>
              <input type="password" id="password" required placeholder="" />
            </div>
            <button type="submit" className="login-submit-btn">
              INITIATE UPLINK
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}