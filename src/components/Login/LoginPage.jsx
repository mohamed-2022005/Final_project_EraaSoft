import React, { useEffect, useState } from 'react';
import * as Yup from 'yup'; 
import {
  FaArrowRight,
  FaCheckCircle,
  FaExclamationCircle,
  FaEyeSlash,
  FaEye,
  FaLock,
  FaUser,
  FaTimes,
  FaUserPlus
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

function LoginPage({ onLoginSuccess, onClose }) {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  // --- Validation Schema ---
  const loginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });


  useEffect(() => {
    const stored = localStorage.getItem('loginData');
    if (stored) {
      const parsed = JSON.parse(stored);
      setFormData(prev => ({
        ...prev,
        email: parsed.email,
        password: parsed.password,
        rememberMe: true
      }));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // abortEarly: false makes Yup collect ALL errors
      await loginSchema.validate(formData, { abortEarly: false });

      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === formData.email && u.password === formData.password);

      if (!user) {
        setIsError(true);
        setToastMessage('No account found! Please sign up first.');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
        return;
      }

      if (formData.rememberMe) {
        localStorage.setItem('loginData', JSON.stringify({ email: formData.email, password: formData.password }));
      } else {
        localStorage.removeItem('loginData');
      }

      setIsError(false);
      setToastMessage('Login Successful!');
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        if (onLoginSuccess) onLoginSuccess();
      }, 2000);

    } catch (err) {
      setIsError(true);
      // Join all errors with a separator to show them all at once
      setToastMessage(err.inner.map(e => e.message).join(' | '));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000); 
    }
  };

  const handleChange = ({ target: { name, value, type, checked } }) => {
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const toggleShowPassword = () => setShowPassword(prev => !prev);

  const inputClass =
    "w-full bg-transparent border border-amber-500/50 rounded-xl py-3 pl-10 pr-10 text-white placeholder-amber-200/50 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all";

  const iconClass =
    "absolute left-3 top-1/2 -translate-y-1/2 text-amber-500 text-lg";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >

      {/* Toast */}
      <div className={`fixed top-5 right-5 z-100 transition-all duration-500 transform ${showToast ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}>
        <div className={`${isError ? 'bg-red-600' : 'bg-green-600'} text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3`}>
          {isError ? <FaExclamationCircle /> : <FaCheckCircle />}
          <span className="font-medium">{toastMessage}</span>
        </div>
      </div>

      {/* Form */}
      <div
        className="w-112.5 max-w-full mx-2 sm:mx-auto bg-[#2d1b0e] border-2 border-amber-500/60 rounded-[40px] p-4 sm:p-8 relative overflow-hidden shadow-[0_10px_40px_rgba(255,223,0,0.2)]"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 z-50 text-amber-500/70 hover:text-amber-500 transition-all transform hover:scale-110 pointer-events-auto"
        >
          <FaTimes />
        </button>

        <h2 className="text-center text-amber-500 text-2xl font-bold mb-8">
          Foodie-Frenzy
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>

          {/* Email */}
          <div className="relative">
            <FaUser className={iconClass} />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* Password */}
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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500 hover:text-amber-400"
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>

          {/* Remember Me */}
          <div className="flex items-center">
            <label className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="w-5 h-5 rounded border-amber-500 bg-transparent text-amber-600 focus:ring-amber-500 focus:ring-offset-0"
              />
              <span className="ml-3 text-amber-100/90 group-hover:text-amber-400 transition-colors">
                Remember me
              </span>
            </label>
          </div>
          
          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-[#2d1b0e] font-black py-4 rounded-xl flex items-center justify-center gap-2 transform active:scale-95 transition-all shadow-lg mt-4"
          >
            Sign In <FaArrowRight className="text-sm" />
          </button>

        </form>

        <div className='text-center '>
          <Link to='/signup' onClick={onClose} className='inline-flex items-center gap-2 text-amber-400 hover:text-amber-600 transition-colors pt-5 '>
            <FaUserPlus/>
            Create New Account
          </Link>
        </div>

      </div>
    </div>
  );
}

export default LoginPage;