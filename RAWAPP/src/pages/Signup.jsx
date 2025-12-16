import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

// Logic Imports
import { registerUser } from "../features/auth/authThunks";
import { auth } from "../firebase/firebaseClient";
import useAuth from "../hooks/useAuth";

// --- Icons ---
const UserIcon = () => (
  <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const MailIcon = () => (
  <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
  </svg>
);

const LockIcon = () => (
  <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const Spinner = () => (
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth(); // Get user from auth hook

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;

      // 2. Update display name
      await updateProfile(user, {
        displayName: form.name
      });

      // 3. Get token
      const token = await user.getIdToken();

      // 4. Send to backend
      const result = await dispatch(registerUser(token));

      if (result.meta.requestStatus === "fulfilled") {
        navigate("/dashboard");
      } else {
        setError(result.payload || "Registration failed on server");
      }
    } catch (err) {
      console.error("Signup error", err);
      if (err.code === "auth/email-already-in-use") setError("Email already registered.");
      else if (err.code === "auth/weak-password") setError("Password too weak.");
      else if (err.code === "auth/invalid-email") setError("Invalid email format.");
      else setError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden selection:bg-green-500 selection:text-black">
      {/* 1. Animated Background Grid */}
      <div className="cyber-grid-bg"></div>

      {/* 2. Scanline Animation */}
      <div className="scanline"></div>

      {/* 3. Floating Particles */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-green-500/10 rounded-full blur-[100px] animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* 4. The Main HUD Card */}
      <div className="hud-card relative z-10 w-full max-w-md p-8 sm:p-10 rounded-xl m-4 shadow-2xl">

        {/* Header */}
        <div className="text-center mb-10">
          <h2
            className="glitch-text text-3xl font-extrabold tracking-tighter text-white mb-2"
            data-text="SYSTEM REGISTRATION"
          >
            SYSTEM REGISTRATION
          </h2>
          <p className="text-green-500/70 text-xs font-mono tracking-widest uppercase">
            // Create New Identity
          </p>
        </div>

        {/* Error Terminal */}
        {error && (
          <div className="mb-6 p-3 bg-red-900/20 border border-red-500/50 rounded text-red-400 text-xs font-mono flex items-start">
            <span className="mr-2">⚠</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Name */}
          <div className="space-y-1 group">
            <label className="text-xs font-mono text-gray-500 group-focus-within:text-green-400 transition-colors">
              CODENAME (FULL NAME)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon />
              </div>
              <input
                type="text"
                name="name"
                className="tech-input w-full pl-10 pr-3 py-3 rounded-t-sm text-white focus:outline-none"
                placeholder="Agent Smith"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1 group">
            <label className="text-xs font-mono text-gray-500 group-focus-within:text-green-400 transition-colors">
              USER_ID (EMAIL)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MailIcon />
              </div>
              <input
                type="email"
                name="email"
                className="tech-input w-full pl-10 pr-3 py-3 rounded-t-sm text-white focus:outline-none"
                placeholder="agent@rawchat.com"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1 group">
            <label className="text-xs font-mono text-gray-500 group-focus-within:text-green-400 transition-colors">
              PASSKEY
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockIcon />
              </div>
              <input
                type="password"
                name="password"
                className="tech-input w-full pl-10 pr-3 py-3 rounded-t-sm text-white focus:outline-none"
                placeholder="••••••••"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-500 text-black font-bold py-3 px-4 rounded-sm transition-all duration-300 transform hover:scale-[1.02] shadow-[0_0_15px_rgba(0,255,65,0.4)] disabled:opacity-50 disabled:cursor-not-allowed font-mono uppercase tracking-wider flex justify-center items-center"
          >
            {loading ? <Spinner /> : "ESTABLISH IDENTITY"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-600 font-mono">
            ALREADY REGISTERED?{" "}
            <Link to="/login" className="text-green-500 hover:text-green-400 underline decoration-green-500/30 underline-offset-4">
              ACCESS_SYSTEM
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
