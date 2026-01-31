import React, { useState } from 'react';
import * as Yup from 'yup';
import {
  FaArrowRight,
  FaCheckCircle,
  FaExclamationCircle,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaUser,
  FaTimes,
  FaUserPlus
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

function SignUpPage() {
  // --- UI State Management ---
  const [showToast, setShowToast] = useState(false);
  const [toastMessages, setToastMessages] = useState([]); 
  const [isError, setIsError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // --- Form Data State ---
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  // --- Validation Schema ---
  const signUpSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be 6+ chars")
      .matches(/[a-zA-Z]/, "Password must contain letters")
      .matches(/[0-9]/, "Password must contain numbers")
      .required("Password is required"),
  });

  // --- Input Change Handler ---
  const handleChange = ({ target: { name, value } }) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- Form Submission Logic ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1. Run Yup Validation (abortEarly: false collects ALL errors)
      await signUpSchema.validate(formData, { abortEarly: false });

      const users = JSON.parse(localStorage.getItem('users') || '[]');

      // Check if account already exists
      const userExists = users.some(u => u.email === formData.email);
      if (userExists) {
        setIsError(true);
        setToastMessages(['This account already exists!']);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
        return;
      }

      // Add new user to storage
      users.push(formData);
      localStorage.setItem('users', JSON.stringify(users));

      // Success Message
      setIsError(false);
      setToastMessages(['Sign Up Successful!']);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        navigate('/login');
      }, 2000);

    } catch (err) {
      setIsError(true);
      if (err.inner) {
        const errors = err.inner.map(e => e.message);
        setToastMessages(errors);
      } else {
        setToastMessages([err.message]);
      }

      setShowToast(true);
      setTimeout(() => setShowToast(false), 3500); 
    }
  };

  const toggleShowPassword = () => setShowPassword(prev => !prev);

  // --- Styled Class Constants ---
  const inputClass = "w-full bg-transparent border border-amber-500/50 rounded-xl py-3 pl-10 pr-10 text-white placeholder-amber-200/50 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all";
  const iconClass = "absolute left-3 top-1/2 -translate-y-1/2 text-amber-500 text-lg";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a120b] p-4">

      {/* Toast Notification */}
      <div className={`fixed top-5 right-5 z-100 transition-all duration-500 transform ${showToast ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}>
        <div className={`${isError ? 'bg-red-600' : 'bg-green-600'} text-white px-6 py-3 rounded-xl shadow-2xl flex items-start gap-3 max-w-md`}>
          <div className="mt-1">
            {isError ? <FaExclamationCircle className="shrink-0" /> : <FaCheckCircle className="shrink-0" />}
          </div>
          <div className="flex flex-col gap-1">
            {toastMessages.map((msg, index) => (
              <div key={index} className="font-medium text-sm leading-tight border-b border-white/10 last:border-0 pb-1 last:pb-0">
                • {msg}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sign Up Card */}
      <div className="w-112.5 max-w-full bg-[#1a120b] border-2 border-[#663717] rounded-[40px] p-6 sm:p-8 relative overflow-hidden shadow-[0_10px_40px_rgba(255,223,0,0.1)]">

        <button
          onClick={() => navigate('/login')}
          className="absolute right-6 top-6 z-50 text-amber-500/70 hover:text-amber-500 transition-all transform hover:scale-110"
        >
          <FaTimes />
        </button>

        <h2 className="text-center text-amber-500 text-2xl font-bold mb-8  tracking-wider">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>

          <div className="relative">
            <FaUser className={iconClass} />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div className="relative">
            <FaUserPlus className={iconClass} />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div className="relative">
            <FaLock className={iconClass} />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={inputClass}
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500 hover:text-amber-400 transition-colors"
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-[#1a120b] font-black py-4 rounded-xl flex items-center justify-center gap-2 transform active:scale-95 transition-all shadow-lg mt-4"
          >
            Sign Up <FaArrowRight className="text-sm" />
          </button>
        </form>

        <div className="text-center pt-5">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-600 transition-colors font-medium"
          >
            <FaArrowRight /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;