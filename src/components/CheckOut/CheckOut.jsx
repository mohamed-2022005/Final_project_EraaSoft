import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaLock } from 'react-icons/fa';
import { useCart } from '../../CartContext/CartContext'; 
import axios from 'axios';
import { motion } from 'framer-motion';

const Checkout = () => {
    const { cartTotal, cartItems } = useCart(); 
    const navigate = useNavigate();
    const location = useLocation();

    const [formData, setFormData] = useState({
        firstName: '', lastName: '', phone: '',
        email: '', address: '', city: '',
        zipCode: '', paymentMethod: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const BASE_URL = 'http://localhost:4000/api';

    // --- Helper: Get Auth Token from LocalStorage ---
    const getAuthToken = () => {
        const loginData = JSON.parse(localStorage.getItem('loginData') || '{}');
        return loginData.token || localStorage.getItem('token'); 
    };

    // --- Effect: Handle Payment Confirmation on Success Redirect ---
    useEffect(() => {
        const token = getAuthToken();
        const params = new URLSearchParams(location.search);
        const paymentStatus = params.get('payment_status');
        const sessionId = params.get('session_id');

        if (paymentStatus === 'success' && sessionId) {
            setLoading(true);
            axios.post(`${BASE_URL}/orders/confirm`,
                { sessionId },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then(() => {
                localStorage.removeItem('cart');
                window.location.href = '/myorder'; 
            })
            .catch(() => setError('Payment confirmation failed.'))
            .finally(() => setLoading(false));
        }
    }, [location]);

    // --- Handler: Update Form Data on Input Change ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // --- Handler: Process Order Submission and Payment ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = getAuthToken(); 

        if (!token) {
            setError("You must be logged in to place an order.");
            return;
        }

        setLoading(true);
        setError(null);

        const payload = {
            ...formData,
            subtotal: cartTotal,
            tax: cartTotal * 0.05,
            total: cartTotal + (cartTotal * 0.05),
            items: cartItems.map(item => ({
                _id: item.id, 
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                imageUrl: item.image || item.imageUrl || ""
            }))
        };

        try {
            const { data } = await axios.post(`${BASE_URL}/orders`,
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (formData.paymentMethod === 'online' && data.checkoutUrl) {
                window.location.href = data.checkoutUrl;
            } else {
                localStorage.removeItem('cart');
                navigate('/myorder', { state: { order: data.order } });
                window.location.reload(); 
            }
        } catch (err) {
            console.error("Order Error:", err.response?.data);
            setError(err.response?.data?.message || 'Invalid Token or Server Error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen bg-linear-to-b from-[#1a1212] to-[#2a1e1e] text-white py-16 px-4'>
            <div className='mx-auto max-w-4xl'>
                <Link className='flex items-center gap-2 text-amber-400 mb-8' to='/cart'>
                    <FaArrowLeft /> Back to Cart
                </Link>

                <h1 className='text-4xl font-bold text-center mb-8'>Checkout</h1>

                <motion.form
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className='grid lg:grid-cols-2 gap-12'
                    onSubmit={handleSubmit}
                >
                    {/* Section: Customer Personal Information */}
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

                    {/* Section: Order Summary and Payment Options */}
                    <div className='bg-[#4b3b3b]/80 p-6 rounded-3xl space-y-6'>
                        <h2 className='text-2xl font-bold'>Order Summary</h2>
                        <div className='space-y-4 mb-6'>
                            {cartItems.map((item, index) => (
                                <div key={item.id || index} className='flex justify-between items-center bg-[#3a2b2b] p-3 rounded-lg'>
                                    <span>{item.name} <small className='text-amber-500'>x{item.quantity}</small></span>
                                    <span className='text-amber-300'>₹{((item.price || 0) * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        <PaymentSummary totalAmount={cartTotal} />

                        <select name='paymentMethod' value={formData.paymentMethod} onChange={handleInputChange} required className='w-full bg-[#3a2b2b]/50 rounded-xl px-4 py-3 border border-amber-500/30 text-white outline-none'>
                            <option value="" className='bg-[#2a1e1e]'>Select Method</option>
                            <option value="cod" className='bg-[#2a1e1e]'>Cash on Delivery</option>
                            <option value="online" className='bg-[#2a1e1e]'>Online Payment</option>
                        </select>

                        {error && <p className='text-red-400 mt-2 font-bold bg-red-900/20 p-2 rounded'>{error}</p>}

                        <button type='submit' disabled={loading} className='w-full bg-linear-to-r from-red-600 to-amber-600 py-4 rounded-xl font-bold flex justify-center items-center hover:scale-[1.02] transition-transform'>
                            <FaLock className='mr-2' /> {loading ? 'Processing...' : 'Complete Order'}
                        </button>
                    </div>
                </motion.form>
            </div>
        </div>
    );
};

// Sub-component: Form Input Field
const Input = ({ label, name, type = 'text', value, onChange }) => (
    <div>
        <label className='block mb-1 text-sm text-gray-300'>{label}</label>
        <input
            type={type} name={name} value={value} onChange={onChange} required
            className='w-full bg-[#3a2b2b]/50 rounded-xl px-4 py-2 border border-transparent focus:border-amber-500 outline-none text-white'
        />
    </div>
);

// Sub-component: Order Totals and Tax Calculation
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