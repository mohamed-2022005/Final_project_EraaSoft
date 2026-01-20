import React, { useState } from 'react'
import { cardData, additionalData } from '../../assets/dummydata'
import { useCart } from '../../CartContext/CartContext'
import { FaFire, FaHeart, FaPlus, FaStar } from 'react-icons/fa'
import { HiMinus, HiPlus } from 'react-icons/hi'
import FloatingParticle from '../FloatingParticle/FloatingParticle'

function SpecialOffer() {
    const [showAll, setShowAll] = useState(false)
    const initialData = [...cardData, ...additionalData] // Combine all food assets

    const { addToCart, updateQuantity, removeFromCart, cartItems } = useCart()

    return (
        <div className='bg-linear-to-b from-[#2a1212] to-[#2a1e1e] text-white py-16 px-4 font-[Poppins]'>
            <div className='max-w-7xl mx-auto'>
                
                {/* --- Section Header --- */}
                <div className='text-center mb-14'>
                    <h1 className='text-5xl font-bold mb-4 bg-linear-to-r from-amber-400 to-red-500 bg-clip-text text-transparent font-[Playfair_Display] italic'>
                        Today&apos;s <span className='text-stroke-gold'>Special</span> Offers
                    </h1>
                    <p className='text-lg text-gray-300 max-w-3xl mx-auto tracking-wide leading-relaxed'>
                        Savor the extraordinary with our culinary masterpieces crafted to perfection.
                    </p>
                </div>

                {/* --- Food Cards Grid --- */}
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
                    {(showAll ? initialData : initialData.slice(0, 4)).map((ittem, index) => {

                        // Sync with Shopping Cart state
                        const cartItem = cartItems.find(ci => ci.id === ittem.id)
                        const quantity = cartItem ? cartItem.quantity : 0

                        return (
                            <div
                                key={`${ittem.id}-${index}`}
                                className='relative group bg-[#4b3b3b] rounded-3xl overflow-hidden shadow-2xl transform hover:-translate-y-4 transition-all duration-500 hover:shadow-red-900/40 border-2 border-transparent hover:border-amber-500/20'
                            >
                                {/* Food Image & Rating Badge */}
                                <div className='relative h-72 overflow-hidden'>
                                    <img
                                        src={ittem.image}
                                        alt={ittem.title}
                                        className='w-full h-full object-cover brightness-90 group-hover:brightness-110 transition-all duration-500'
                                    />
                                    <div className='absolute inset-0 bg-linear-to-b from-transparent to-black/90' />

                                    <div className='absolute bottom-4 right-4 left-4 flex items-center justify-between bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full'>
                                        <span className='flex items-center gap-2 text-amber-400'>
                                            <FaStar className='text-xl' />
                                            <span className='font-bold'>{ittem.rating}</span>
                                        </span>
                                        <span className='flex items-center gap-2 text-red-400'>
                                            <FaHeart className='text-xl animate-heartbeat' />
                                            <span className='font-bold'>{ittem.hearts}</span>
                                        </span>
                                    </div>
                                </div>

                                {/* Card Details & Actions */}
                                <div className='p-6 relative z-10'>
                                    <h2 className='text-2xl font-bold mb-2 bg-linear-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent font-[Playfair_Display] italic'>
                                        {ittem.title}
                                    </h2>

                                    <p className='text-gray-300 mb-5 text-sm leading-relaxed tracking-wide'>
                                        {ittem.description}
                                    </p>

                                    <div className='flex items-center justify-between gap-4'>
                                        <span className='text-2xl font-bold text-amber-400 flex-1'>
                                            {ittem.price}
                                        </span>

                                        {/* Toggle between Add button and Quantity controls */}
                                        {quantity > 0 ? (
                                            <div className='flex items-center gap-3'>
                                                <button
                                                    onClick={() => quantity > 1 ? updateQuantity(ittem.id, quantity - 1) : removeFromCart(ittem.id)}
                                                    className='w-8 h-8 rounded-full bg-amber-900/40 flex items-center justify-center hover:bg-amber-800/50 transition-all duration-200 active:scale-95'
                                                >
                                                    <HiMinus className='w-4 h-4 text-amber-100' />
                                                </button>
                                                <span className='w-8 text-center text-amber-100 font-cinzel'>{quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(ittem.id, quantity + 1)}
                                                    className='w-8 h-8 rounded-full bg-amber-900/40 flex items-center justify-center hover:bg-amber-800/50 transition-all duration-200 active:scale-95'
                                                >
                                                    <HiPlus className='w-4 h-4 text-amber-100' />
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => addToCart({
                                                    ...ittem,
                                                    name: ittem.title,
                                                    price: typeof ittem.price === 'string' ? parseFloat(ittem.price.replace(/[^\d.]/g, '')) : ittem.price
                                                }, 1)}
                                                className='flex items-center gap-2 bg-amber-700 px-4 py-2 rounded-xl hover:bg-amber-600 transition-all'
                                            >
                                                <FaPlus />
                                                <span>Add</span>
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Visual hover effect */}
                                <div className='opacity-0 group-hover:opacity-100'>
                                    <FloatingParticle />
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* --- Toggle "Show More" Button --- */}
                <div className='mt-12 flex justify-center'>
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className='relative group flex items-center gap-3 bg-linear-to-r from-red-700 to-amber-700 text-white px-8 py-4 rounded-2xl font-bold text-xl uppercase tracking-wider transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-amber-500/30 overflow-hidden'
                    >
                        <FaFire className='text-xl animate-pulse' />
                        <span>{showAll ? 'Show Less' : 'Show More'}</span>
                        <div className='absolute right-0 top-0 h-full w-1 bg-amber-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200' />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SpecialOffer