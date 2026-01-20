import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaLock } from 'react-icons/fa';
import { useCart } from '../../CartContext/CartContext';
import axios from 'axios';
import { motion } from 'framer-motion'; // Importing Framer Motion

const Checkout = () => {
    // --- Cart and Navigation Hooks ---
    const { cartTotal, cartItems, clearCart } = useCart();
    const navigate = useNavigate();
    const location = useLocation();

    // --- State Management ---
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', phone: '',
        email: '', address: '', city: '',
        zipCode: '', paymentMethod: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // --- API Configuration ---
    const BASE_URL = 'http://localhost:4000/api';
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');

    // --- Payment Confirmation Logic ---
    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        const params = new URLSearchParams(location.search);
        const paymentStatus = params.get('payment_status');
        const sessionId = params.get('session_id');

        if (paymentStatus === 'success' && sessionId) {
            setLoading(true);
            axios.post(`${BASE_URL}/orders/confirm`,
                { sessionId },
                { headers: { Authorization: `Bearer ${token}` } }
            )
                .then(({ data }) => {
                    clearCart();
                    navigate('/myorder', { state: { order: data.order } });
                })
                .catch(() => setError('Payment confirmation failed.'))
                .finally(() => setLoading(false));
        }
    }, [location, navigate, token]);

    // --- Form Input Handler ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // --- Order Submission Logic ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const payload = {
            address: formData,
            items: cartItems.map(item => ({
                menuItem: item.id || item._id,
                quantity: item.quantity,
            })),
            amount: cartTotal
        };

        try {
            const { data } = await axios.post(`${BASE_URL}/orders`,
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (formData.paymentMethod === 'online' && data.checkoutUrl) {
                window.location.href = data.checkoutUrl;
            } else {
                clearCart();
                navigate('/myorder', { state: { order: data.order } });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid Token or Server Error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen bg-gradient-to-b from-[#1a1212] to-[#2a1e1e] text-white py-16 px-4'>
            <div className='mx-auto max-w-4xl'>
                {/* Back to Cart Link */}
                <Link className='flex items-center gap-2 text-amber-400 mb-8' to='/cart'>
                    <FaArrowLeft /> Back to Cart
                </Link>

                <h1 className='text-4xl font-bold text-center mb-8'>Checkout</h1>

                {/* Main Form with Framer Motion Animation */}
                <motion.form
                    initial={{
                        opacity: 0,
                        y: 100,      
                        rotateX: 15, 
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        rotateX: 0,  // Res
                    }}
                    transition={{
                        duration: 1.2, //
                        ease: "easeOut"
                    }}
                    className='grid lg:grid-cols-2 gap-12'
                    onSubmit={handleSubmit}
                >
                    {/* Personal Information Section */}
                    <div className='bg-[#4b3b3b]/80 p-6 rounded-3xl space-y-6'>
                        <h2 className='text-2xl font-bold'>Personal Information</h2>
                        <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} />
                        <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} />
                        <Input label="Phone" name="phone" value={formData.phone} onChange={handleInputChange} />
                        <Input label="Email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
                        <Input label="Address" name="address" value={formData.address} onChange={handleInputChange} />
                        <Input label="City" name="city" value={formData.city} onChange={handleInputChange} />
                        <Input label="Zip Code" name="zipCode" value={formData.zipCode} onChange={handleInputChange} />
                    </div>

                    {/* Payment Details Section */}
                    <div className='bg-[#4b3b3b]/80 p-6 rounded-3xl space-y-6'>
                        <h2 className='text-2xl font-bold'>Payment Details</h2>
                        <div className='space-y-4 mb-6'>
                            {cartItems.map((item, index) => (
                                <div key={index} className='flex justify-between items-center bg-[#3a2b2b] p-3 rounded-lg'>
                                    <span>{item.name} <small className='text-amber-500'>x{item.quantity}</small></span>
                                    <span className='text-amber-300'>₹{((item.price || 0) * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        <PaymentSummary totalAmount={cartTotal} />

                        {/* Payment Method Selector */}
                        <select name='paymentMethod' value={formData.paymentMethod} onChange={handleInputChange} required className='w-full bg-[#3a2b2b]/50 rounded-xl px-4 py-3 border border-amber-500/30 text-white outline-none'>
                            <option value="" className='bg-[#2a1e1e]'>Select Method</option>
                            <option value="cod" className='bg-[#2a1e1e]'>Cash on Delivery</option>
                            <option value="online" className='bg-[#2a1e1e]'>Online Payment</option>
                        </select>

                        {error && <p className='text-red-400 mt-2 font-bold bg-red-900/20 p-2 rounded'>{error}</p>}

                        {/* Submit Button */}
                        <button type='submit' disabled={loading} className='w-full bg-gradient-to-r from-red-600 to-amber-600 py-4 rounded-xl font-bold flex justify-center items-center hover:scale-[1.02] transition-transform'>
                            <FaLock className='mr-2' /> {loading ? 'Processing...' : 'Complete Order'}
                        </button>
                    </div>
                </motion.form>
            </div>
        </div>
    );
};

// --- Sub-component: Form Input ---
const Input = ({ label, name, type = 'text', value, onChange }) => (
    <div>
        <label className='block mb-1 text-sm text-gray-300'>{label}</label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            required
            style={{ WebkitTextFillColor: 'white', transition: 'background-color 5000s ease-in-out 0s' }}
            className='w-full bg-[#3a2b2b]/50 rounded-xl px-4 py-2 border border-transparent focus:border-amber-500 outline-none text-white'
        />
    </div>
);

// --- Sub-component: Payment Summary ---
const PaymentSummary = ({ totalAmount }) => {
    const subtotal = totalAmount || 0;
    const tax = subtotal * 0.05;
    return (
        <div className='space-y-2 border-t border-b border-gray-600 py-4 text-sm'>
            <div className='flex justify-between text-gray-400'><span>Subtotal:</span><span>₹{subtotal.toFixed(2)}</span></div>
            <div className='flex justify-between text-gray-400'><span>Tax (5%):</span><span>₹{tax.toFixed(2)}</span></div>
            <div className='flex justify-between font-bold text-xl text-amber-400 pt-2'><span>Total:</span><span>₹{(subtotal + tax).toFixed(2)}</span></div>
        </div>
    );
};

export default Checkout;