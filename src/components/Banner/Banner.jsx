import React, { useState } from 'react'
import { FaDownload, FaPlay, FaSearch, FaTimes } from 'react-icons/fa'
import { bannerAssets } from '../../assets/dummydata'
import video from '../../assets/Video.mp4'
import { FaSpinner } from 'react-icons/fa'

// Toast
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function Banner() {
    const [searchQuery, setSearchQuery] = useState('')
    const [showVideo, setShowVideo] = useState(false)

    const { bannerImage, orbitImages } = bannerAssets

    const handleSearch = (e) => {
        e.preventDefault()
        console.log('Search for ', searchQuery)
    }

    // ✅ Download Alert (Toast)
    const handleDownload = () => {
        toast(
            <div className="flex items-center gap-2 justify-center">
                <FaSpinner className="animate-spin text-[14px]" />
                <span>Downloading...</span>
            </div>,
            {
                position: window.innerWidth < 768 ? 'top-center' : 'top-right',

                autoClose: 1800,
                hideProgressBar: true,
                closeButton: false,
                pauseOnHover: false,
                draggable: false,

                style: {
                    background: 'rgba(245, 158, 11, 0.15)',
                    color: '#fde68a',
                    fontWeight: '500',
                    borderRadius: '10px',
                    padding: '10px 10px',
                    fontSize: '13px',
                    width: '250px',
                    minHeight: '44px',
                    textAlign: 'center',
                    backdropFilter: 'blur(6px)',
                    border: '1px solid rgba(245, 158, 11, 0.35)',

                    
                    marginTop: window.innerWidth < 768 ? '20px' : '0px',
                },

            }
        )
    }



    return (
        <div className="relative">
            <div className="bg-linear-to-br from-amber-900 via-amber-800 to-amber-700 text-white py-16 px-4 sm:px-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-amber-900/20 to-amber-700/10" />

                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
                    {/* Left Content */}
                    <div className="flex-1 space-y-8 relative md:pr-8 text-center md:text-left">
                        <h1 className="text-4xl sm:text-5xl md:text-4xl lg:text-6xl font-bold leading-tight font-serif drop-shadow-md">
                            We're Here <br />
                            <span className="text-transparent bg-linear-to-br from-amber-400 to-amber-300 bg-clip-text ">
                                For Food & Delivery
                            </span>
                        </h1>

                        <p className="text-lg lg:text-xl font-playfair italic text-amber-100 max-w-xl opacity-90 md:mx-0 mx-auto">
                            Best cooks and best delivery guys all at your service. Hot tasty food
                            will reach you in 60 minutes.
                        </p>

                        <form onSubmit={handleSearch} className="relative max-w-2xl md:mx-0 mx-auto">
                            <div className="flex items-center bg-amber-900/30 rounded-xl border-2 border-amber-500/30 shadow-2xl hover:bg-amber-400/50 transition-all duration-300">
                                <div className="pl-6 pr-3 py-4">
                                    <FaSearch className="text-xl text-amber-400/80" />
                                </div>

                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Discover your next favorite meal..."
                                    className="w-full pr-6 py-4 bg-transparent outline-none placeholder-amber-200/70 text-lg font-medium tracking-wide placeholder:text-sm md:placeholder:text-base"
                                />

                                <button
                                    type="submit"
                                    className="mr-4 px-6 py-3 bg-linear-to-r from-amber-400 to-amber-300 rounded-lg font-semibold text-amber-900 hover:from-amber-300 hover:to-amber-200 transition-all duration-300 shadow-lg"
                                >
                                    Search
                                </button>
                            </div>
                        </form>

                        <div className="flex flex-wrap gap-4 justify-center md:justify-start mt-6">
                            {/* Download Button */}
                            <button
                                onClick={handleDownload}
                                className="group flex items-center gap-3 bg-amber-800/30 hover:bg-amber-800/50 px-6 py-3 rounded-xl transition-all duration-300 border-2 border-amber-700/50 hover:border-amber-400 backdrop-blur-sm"
                            >
                                <FaDownload className="text-xl text-amber-400 group-hover:animate-bounce" />
                                <span className="text-lg cursor-pointer">Download App</span>
                            </button>

                            <button
                                onClick={() => setShowVideo(true)}
                                className="cursor-pointer group flex items-center gap-3 bg-linear-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 px-6 py-3 rounded-xl transition-all duration-300 shadow-lg"
                            >
                                <FaPlay className="text-xl text-amber-900" />
                                <span className="text-lg text-amber-900 font-semibold ">
                                    Watch Video
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="flex-1 relative group mt-8 md:mt-0">
                        <div className="relative rounded-full p-1 bg-linear-to-br from-amber-700 via-amber-800 to-amber-400 shadow-2xl z-20
                        w-70 xs:w-[320px] sm:w-90
                        h-70 xs:h-[320px] sm:h-90 mx-auto">
                            <img
                                src={bannerImage}
                                alt="Banner"
                                className="rounded-full border-4 xs:border-8 border-amber-900/50 w-full h-full object-cover object-[center_20%]"
                            />
                        </div>

                        {orbitImages?.map((ImgSrc, index) => (
                            <div
                                key={index}
                                className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 orbit ${index !== 0 ? `orbit-delay-${index * 5}` : ''}`}
                            >
                                <img
                                    src={ImgSrc}
                                    alt={`orbit-${index + 1}`}
                                    className="w-20 xs:w-[100px] sm:w-35
                                    h-20 xs:h-[100px] sm:h-35
                                    rounded-full border border-amber-500/30 shadow-lg p-1 object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Video Modal */}
            {showVideo && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/90 backdrop-blur-lg p-4 ">
                    <button
                        className=" absolute top-6 right-6 text-amber-400 hover:text-amber-300 text-3xl z-10 transition-all "
                        onClick={() => setShowVideo(false)}
                    >
                        <FaTimes />
                    </button>

                    <div className="w-full max-w-4xl">
                        <video
                            controls
                            autoPlay
                            className="w-full aspect-video object-contain rounded-lg shadow-2xl"
                        >
                            <source src={video} type="video/mp4" />
                        </video>
                    </div>
                </div>
            )}

            {/* Toast Container */}
            <ToastContainer />
        </div>
    )
}

export default Banner
