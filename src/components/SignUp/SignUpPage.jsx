import React, { useState } from 'react';
import { FaArrowRight, FaCheckCircle, FaExclamationCircle, FaEye, FaEyeSlash, FaLock, FaUser, FaTimes, FaUserPlus } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

function SignUpPage() {
  // --- UI State Management ---
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isError, setIsError] = useState(false); 
  const [showPassword, setShowPassword] = useState(false);
  
  // --- Form Data State ---
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  // --- Input Change Handler ---
  const handleChange = ({ target: { name, value } }) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- Form Submission Logic ---
  const handleSubmit = (e) => {
    e.preventDefault();

    // Fetch existing users from local storage
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    // Check if account already exists
    const userExists = users.some(u => u.email === formData.email);
    if (userExists) {
      setIsError(true);
      setToastMessage('This account already exists!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
      return; 
    }

    // Add new user to storage
    users.push(formData);
    localStorage.setItem('users', JSON.stringify(users));

    // Handle successful registration
    setIsError(false);
    setToastMessage('Sign Up Successful!');
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      navigate('/login');
    }, 2000);
  };

  const toggleShowPassword = () => setShowPassword(prev => !prev);

  // --- Styled Class Constants ---
  const inputClass = "w-full bg-transparent border border-amber-500/50 rounded-xl py-3 pl-10 pr-10 text-white placeholder-amber-200/50 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all";
  const iconClass = "absolute left-3 top-1/2 -translate-y-1/2 text-amber-500 text-lg";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a120b] p-4">
      
      {/* Dynamic Toast Notification */}
      {showToast && (
        <div className="fixed top-5 right-5 z-100 transition-all duration-500 transform opacity-100">
          <div className={`${isError ? 'bg-red-600' : 'bg-green-600'} text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3`}>
            {isError ? <FaExclamationCircle /> : <FaCheckCircle />}
            <span className="font-medium">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Sign Up Card */}
      <div
        className="w-112.5 max-w-full bg-[#1a120b] border-2 border-[#663717] rounded-[40px] p-6 sm:p-8 relative overflow-hidden shadow-[0_10px_40px_rgba(255,223,0,0.1)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close/Back Button */}
        <button
          onClick={() => navigate('/login')}
          className="absolute right-6 top-6 z-50 text-amber-500/70 hover:text-amber-500 transition-all transform hover:scale-110 pointer-events-auto"
        >
          <FaTimes />
        </button>

        <h2 className="text-center text-amber-500 text-2xl font-bold mb-8">
          Create Account
        </h2>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username Input */}
          <div className="relative">
            <FaUser className={iconClass} />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          {/* Email Input */}
          <div className="relative">
            <FaUserPlus className={iconClass} />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          {/* Password Input with Visibility Toggle */}
          <div className="relative">
            <FaLock className={iconClass} />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={inputClass}
              required
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500 hover:text-amber-400"
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-[#1a120b] font-black py-4 rounded-xl flex items-center justify-center gap-2 transform active:scale-95 transition-all shadow-lg mt-4"
          >
            Sign Up <FaArrowRight className="text-sm" />
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-5">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-600 transition-colors"
          >
            <FaArrowRight /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;