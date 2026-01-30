import React, { useEffect, useState } from 'react'
import { GiChefToque, GiForkKnifeSpoon } from 'react-icons/gi'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  FiHome, FiBook, FiStar, FiPhone, FiShoppingCart, 
  FiKey, FiLogOut, FiX, FiMenu, FiPackage,
} from 'react-icons/fi'

import { useCart } from '../../CartContext/CartContext'
import LoginPage from '../Login/LoginPage'

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(localStorage.getItem('loginData')))
  
  const { totalItems } = useCart()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    setShowLoginModal(location.pathname === '/login')
    setIsAuthenticated(Boolean(localStorage.getItem('loginData')))
  }, [location.pathname])

  const handleLoginSuccess = () => {
    localStorage.setItem('loginData', JSON.stringify({ loggedIn: true }))
    setIsAuthenticated(true)
    setShowLoginModal(false)
    navigate('/')
  }

  const handleLogout = () => {
    localStorage.removeItem('loginData')
    setIsAuthenticated(false)
    navigate('/')
  }

  const navLinks = [
    { name: 'Home', to: '/', icon: <FiHome /> },
    { name: 'Menu', to: '/menu', icon: <FiBook /> },
    { name: 'About', to: '/about', icon: <FiStar /> },
    { name: 'Contact', to: '/contact', icon: <FiPhone /> },
    ...(isAuthenticated ? [{ name: 'My Order', to: '/myorder', icon: <FiPackage /> }] : [])
  ];

  return (
    <nav className="bg-[#2D1B0E] border-b-8 border-amber-900/30 sticky top-0 z-50 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)]">
      
      {/* Decorative Elements */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-full max-w-7xl px-4 pointer-events-none">
        <div className="h-1.5 bg-linear-to-r from-transparent via-amber-600/50 to-transparent" />
        <div className="flex justify-between px-6">
          <GiForkKnifeSpoon className="text-amber-500/40 -mt-4 rotate-45" size={32} />
          <GiForkKnifeSpoon className="text-amber-500/40 -mt-4 rotate-45" size={32} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16 md:h-20 lg:h-24">

          {/* Logo Section */}
          <NavLink to="/" className="flex items-center gap-3 group relative">
            <div className="absolute -inset-4 bg-amber-500/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition" />
            <GiChefToque className="relative text-3xl lg:text-5xl text-amber-500 group-hover:rotate-12 transition" />
            <span className="relative inline-block text-2xl lg:text-4xl font-semibold bg-linear-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent after:content-[''] after:absolute after:left-2 after:-bottom-2 after:h-1 after:w-full after:bg-[#6f4a1c] after:rounded-full">
              Foodie Frenzy
            </span>
          </NavLink>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.to}
                className={({ isActive }) =>
                  `group px-3 py-2 rounded-3xl border-2 flex items-center gap-2 transition 
                  ${isActive ? 'border-amber-600/50 bg-amber-900/20' : 'border-amber-900/30 hover:border-amber-600/50 hover:bg-amber-900/20'}`
                }
              >
                <span className="text-amber-500">{link.icon}</span>
                <span className="relative text-amber-100">
                  {link.name}
                  <span className="absolute left-0 -bottom-1 h-0.5 bg-amber-400 rounded-full transition-all duration-300 w-0 group-hover:w-full" />
                </span>
              </NavLink>
            ))}

            <NavLink to="/cart" className="relative p-2 border-2 border-amber-900/30 rounded-xl hover:border-amber-500 transition-colors">
              <FiShoppingCart className="text-amber-100 text-xl" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 text-xs bg-amber-600 text-amber-100 rounded-full flex items-center justify-center animate-bounce">
                  {totalItems}
                </span>
              )}
            </NavLink>

            <button 
              onClick={isAuthenticated ? handleLogout : () => setShowLoginModal(true)} 
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-[#2D1B0E] rounded-2xl font-bold flex items-center gap-2 transition-transform active:scale-95"
            >
              {isAuthenticated ? <><FiLogOut /> Logout</> : <><FiKey /> Login</>}
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-amber-400 border-2 border-amber-600/50 rounded-lg bg-amber-900/20 active:scale-90 transition"
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-[#2D1B0E] border-t border-amber-900/30 px-4 py-6 animate-in slide-in-from-top duration-300">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition
                  ${isActive ? 'border-amber-600/50 bg-amber-900/20' : 'border-amber-900/30'}`
                }
              >
                <span className="text-amber-500 text-xl">{link.icon}</span>
                <span className="text-amber-100 font-medium">{link.name}</span>
              </NavLink>
            ))}

            <div className="flex gap-2">
              <NavLink to="/cart" onClick={() => setIsOpen(false)} className="flex-1 flex items-center justify-center p-3 border-2 border-amber-900/30 rounded-xl">
                <div className="relative">
                  <FiShoppingCart className="text-2xl text-amber-500" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-3 bg-amber-600 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{totalItems}</span>
                  )}
                </div>
              </NavLink>
              
              <button
                onClick={isAuthenticated ? handleLogout : () => { setShowLoginModal(true); setIsOpen(false); }}
                className="flex-2 py-3 bg-amber-500 text-[#2d1b0e] rounded-xl font-bold flex items-center justify-center gap-2"
              >
                {isAuthenticated ? <><FiLogOut /> Logout</> : <><FiKey /> Login</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-100 p-4" onClick={() => setShowLoginModal(false)}>
          <div className="bg-[#2D1B0E] rounded-2xl p-6 w-full max-w-xl relative border border-amber-600/30 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute top-4 right-4 text-amber-400 hover:text-amber-300 transition"
              onClick={() => setShowLoginModal(false)}
            >
              <FiX size={28} />
            </button>
            <LoginPage onLoginSuccess={handleLoginSuccess} onClose={() => setShowLoginModal(false)} />
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar