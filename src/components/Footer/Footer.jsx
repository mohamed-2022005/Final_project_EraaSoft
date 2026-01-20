import React, { useState } from 'react'
import { BiChevronRight } from 'react-icons/bi';
import { FaRegEnvelope } from 'react-icons/fa'
import { socialIcons } from '../../assets/dummydata';

function Footer() {


  const navItems = [
    { name: 'Home', link: '/' },
    { name: 'Menu', link: '/menu' },
    { name: 'About', link: '/about' },
    { name: 'Contact', link: '/contact' },
  ];


  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thanks for subscribing! We'll send update to ${email} `)
    setEmail('');
  }

  return (
    <footer className='bg-[#2a211c] text-amber-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden'>
      <div className='max-w-7xl mx-auto relative z-10'>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-12 '>

          {/* Left Column */}
          <div className='space-y-6'>
            <h2 className='text-4xl sm:text-5xl md:text-5xl font-bold font-sacramento text-amber-400 animate-pulse'>
              Foodie-Frenzy
            </h2>
            <p className='text-amber-200/90 text-sm font-sacramento italic'>
              Where culinary artistry meets doorstep convenience.<br />
              Savor handcrafted perfection, delivered with care.
            </p>

            <form onSubmit={handleSubmit} className='relative mt-4 group'>

              <div className='flex items-center gap-2 mb-2'>
                <FaRegEnvelope className='text-amber-400 animate-pulse' />
                <span className='font-bold text-amber-400'>
                  Get Exclusive Offers
                </span>
              </div>

              <div className='relative flex items-center max-w-md'>
                <input
                  type="email"
                  placeholder=' Enter your email...'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className='w-full px-5 py-3 rounded-xl bg-amber-50/5 border-2 border-amber-400/30 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20 transition-all duration-300 placeholder:text-amber-200/50 pr-32'
                />

                <button
                  type='submit'
                  className='absolute right-1.5 bg-linear-to-br from-amber-300 via-orange-500 to-amber-600 text-white px-6 py-2 rounded-full flex items-center shadow-lg hover:shadow-amber-400/30 overflow-hidden transition-all duration-500'
                >
                  <span className='font-bold text-sm tracking-wide transition-transform duration-300 group-hover:-translate-x-1'>
                    Join Now
                  </span>

                  <BiChevronRight className='text-xl transition-transform duration-300 group-hover:animate-spin shrink-0' />


                  <span className='absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-amber-50/30 to-transparent group-hover:translate-x-full duration-700' />

                </button>
              </div>
            </form>

          </div>


          {/* Moddle Column */}

          <div className='flex justify-center '>
            <div className='space-y-4 '>
              <h3 className='text-xl font-semibold mb-4 border-l-4 border-amber-400 pl-3 font-marriweather italic text-amber-300 '>

                Navigation

              </h3>
              <ul className='space-y-3'>
                {navItems.map(item => (
                  <li key={item.name}>
                    <a href={item.link} className='flex items-center hover:text-amber-400 transition-all group font-lora hover:pl-2 '>

                      <BiChevronRight className='mr-2 text-amber-400 group-hover:animate-bounce ' />
                      <span className='hover:italic'>
                        {item.name}

                      </span>
                    </a>

                  </li>
                ))}

              </ul>

            </div>


          </div>


          {/* Right Column */}

          <div className='flex justify-center md:justify-end '>
            <div className='space-y-4 '>
              <h3 className='text-xl font-semibold mb-4 border-l-4 border-amber-400 pl-3 font-marriweather italic text-amber-300 '>

                Social Connect

              </h3>


              <div className='flex space-x-4 '>
                {socialIcons.map(({ icon: Icon, link, color, label }, idx) => (
                  <a className='text-2xl bg-amber-400/10 p-3 rounded-full hover:bg-amber-400/20 hover:scale-110 transition-all duration-300 relative group ' target='_blank' href={link} key={idx} style={{ color }}>

                    <Icon className='hover:scale-125 transition-transform ' />
                    <span className='absolute -bottom-8 left-1/2 -translate-x-1/2 bg-amber-400  text-black  px-2 py-1  rounded text-xs  font-bold  opacity-0 group-hover:opacity-100 transition-opacity '>
                      {label}

                    </span>

                  </a>
                ))}

              </div>

            </div>

          </div>
        </div>


        {/* Bottom Section */}

        <div className='border-t  border-amber-800 pt-8 mt-8 text-center '>

          <p className='text-amber-400 text-lg mb-2  font-playfair'>



            &copy; 2025 Foodie-Frenzy. All rights reserved.



          </p>


          <div className='group inline-block'>
            <a href="https://hexagondigitalservices.com/" target='_blank' className='text-xl font-sacramento bg-linear-to-r from-amber-400 via-amber-500 to-amber-400 bg-clip-text  text-transparent hover:text-purple-300  transition-all duration-500 '>

              Designed by Hexagon Digital Services
            </a>
          </div>

        </div>
      </div>
    </footer>
  )
}

export default Footer