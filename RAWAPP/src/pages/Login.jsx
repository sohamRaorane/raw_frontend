import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

// Logic Imports
import { loginUser } from "../features/auth/authThunks";
import useAuth from "../hooks/useAuth";
import { auth, googleProvider } from "../firebase/firebaseClient";

// --- Icons ---
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

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const Spinner = () => (
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, user } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLoginSuccess = async (user) => {
    try {
      const token = await user.getIdToken();
      const resultAction = await dispatch(loginUser(token));
      if (loginUser.fulfilled.match(resultAction)) {
        navigate("/dashboard");
      } else {
        const errMsg = resultAction.payload || "Authentication failed";
        setError(typeof errMsg === 'string' ? errMsg : JSON.stringify(errMsg));
      }
    } catch (err) {
      console.error("Token error", err);
      setError("Token retrieval failed");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      await handleLoginSuccess(userCredential.user);
    } catch (err) {
      setError("Google protocol terminated.");
      console.error("Google login error", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email.includes("@")) {
      setError("Invalid Email Syntax.");
      return;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
      await handleLoginSuccess(userCredential.user);
    } catch (err) {
      if (err.code === "auth/invalid-email") setError("Invalid email format.");
      else if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password") setError("Incorrect credentials.");
      else if (err.code === "auth/user-not-found") setError("User Identity not found.");
      else setError("System Error. Retry.");
      console.error("Firebase login error", err);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden selection:bg-green-500 selection:text-black">

      {/* 1. Animated Background Grid */}
      <div className="cyber-grid-bg"></div>

      {/* 2. Scanline Animation */}
      <div className="scanline"></div>

      {/* 3. Floating Particles (Optional CSS blobs) */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-green-500/10 rounded-full blur-[100px] animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* 4. The Main HUD Card */}
      <div className="hud-card relative z-10 w-full max-w-md p-8 sm:p-10 rounded-xl m-4 shadow-2xl">

        {/* Header with Glitch Effect */}
        <div className="text-center mb-10">
          <h2
            className="glitch-text text-4xl font-extrabold tracking-tighter text-white mb-2"
            data-text="SYSTEM LOGIN"
          >
            SYSTEM LOGIN
          </h2>
          <p className="text-green-500/70 text-xs font-mono tracking-widest uppercase">
            // Secure Connection v2.0
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
            <div className="flex justify-between">
              <label className="text-xs font-mono text-gray-500 group-focus-within:text-green-400 transition-colors">
                PASSKEY
              </label>
              <Link to="/forgot-password" className="text-xs font-mono text-green-600 hover:text-green-400">
                [RESET?]
              </Link>
            </div>
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
            {loading ? <Spinner /> : "INITIALIZE SESSION"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-800"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-2 bg-black text-gray-600 text-[10px] font-mono uppercase">
              OR ACCESS VIA
            </span>
          </div>
        </div>

        {/* Google Auth */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-700 hover:border-gray-500 rounded bg-transparent text-gray-300 hover:text-white transition-all font-mono text-xs"
        >
          <GoogleIcon />
          GOOGLE PROTOCOL
        </button>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-600 font-mono">
            NO ACCESS?{" "}
            <Link to="/signup" className="text-green-500 hover:text-green-400 underline decoration-green-500/30 underline-offset-4">
              CREATE_IDENTITY
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
