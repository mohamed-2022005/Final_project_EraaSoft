import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiArrowLeft, FiClock, FiTruck, FiCheckCircle, FiPackage } from 'react-icons/fi';

// --- Helpers & Config ---
const STATUS_CONFIG = {
    processing: { color: 'text-amber-400', icon: <FiClock />, label: 'Processing' },
    outForDelivery: { color: 'text-blue-400', icon: <FiTruck />, label: 'Out for Delivery' },
    delivered: { color: 'text-green-400', icon: <FiCheckCircle />, label: 'Delivered' },
    pending: { color: 'text-yellow-400', icon: <FiClock />, label: 'Payment Pending' },
    succeeded: { color: 'text-green-400', icon: <FiCheckCircle />, label: 'Completed' }
};

const getPaymentStyle = (method) => {
    const map = {
        cod: 'bg-yellow-600/30 text-yellow-300 border-yellow-500/50',
        card: 'bg-blue-600/30 text-blue-300 border-blue-500/50',
        upi: 'bg-purple-600/30 text-purple-300 border-purple-500/50',
    };
    return {
        label: method?.toUpperCase() || 'ONLINE',
        class: map[method?.toLowerCase()] || 'bg-green-600/30 text-green-400 border-green-500/50'
    };
};

const MyOrder = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const user = JSON.parse(localStorage.getItem('user'));

    // Fetch Orders Data
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await axios.get('http://localhost:4000/api/orders', {
                    params: { email: user?.email },
                    headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
                });

                const formatted = data.map(order => ({
                    ...order,
                    displayDate: new Date(order.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })
                }));
                setOrders(formatted);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load orders.');
            }
        };
        if (user?.email) fetchOrders();
    }, [user?.email]);

    if (error) return (
        <div className='min-h-screen bg-[#1a120b] flex flex-col items-center justify-center text-amber-400 gap-4'>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className='flex items-center gap-2'><FiArrowLeft /> Try Again</button>
        </div>
    );

    return (
        <div className='min-h-screen bg-gradient-to-br from-[#1a120b] via-[#2a1e14] to-[#3e2b1d] py-12 px-4'>
            <div className='max-w-7xl mx-auto'>
                
                {/* Top Navigation */}
                <div className='flex justify-between items-center mb-8'>
                    <Link to='/' className='flex items-center gap-2 text-amber-400 font-bold hover:text-amber-300'>
                        <FiArrowLeft /> Back to Home
                    </Link>
                    <span className='text-amber-400/70 text-sm'>{user?.email}</span>
                </div>

                {/* Orders Container */}
                <div className='bg-[#4b3b3b]/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-2 border-amber-500/20'>
                    <h2 className='text-3xl font-bold mb-8 text-center bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent'>Order History</h2>

                    <div className='overflow-x-auto'>
                        <table className='w-full text-left'>
                            <thead className='bg-[#3a2b2b]/50 text-amber-400'>
                                <tr>
                                    {['Order ID', 'Customer', 'Address', 'Items', 'Total Items', 'Price', 'Payment', 'Status'].map(h => (
                                        <th key={h} className='p-4'>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => {
                                    const totalQty = order.items?.reduce((s, i) => s + i.quantity, 0) || 0;
                                    const totalPrice = order.items?.reduce((s, i) => s + (i.item.price * i.quantity), 0) || 0;
                                    const payInfo = getPaymentStyle(order.paymentMethod);
                                    const statusInfo = STATUS_CONFIG[order.status] || STATUS_CONFIG.processing;

                                    return (
                                        <tr key={order._id} className='border-b border-amber-800/30 hover:bg-white/5 transition-colors'>
                                            <td className='p-4 text-amber-100 font-mono text-sm italic'>#{order._id?.slice(-8)}</td>
                                            <td className='p-4 text-amber-100'>{order.address?.firstName}</td>
                                            <td className='p-4 text-amber-100/70 text-xs'>{order.address?.street}</td>
                                            <td className='p-4'>
                                                <div className='space-y-2'>
                                                    {order.items?.map((entry, idx) => (
                                                        <div key={idx} className='flex items-center gap-3 bg-[#3a2b2b]/50 p-2 rounded-lg border border-amber-900/30'>
                                                            <img src={`http://localhost:4000${entry.item.imageUrl}`} className='w-10 h-10 object-cover rounded-lg' alt="" />
                                                            <span className='text-[10px] text-amber-100'>{entry.item.name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className='p-4 text-amber-100'>{totalQty}</td>
                                            <td className='p-4 text-amber-300 font-bold'>₹{totalPrice}</td>
                                            <td className='p-4'>
                                                <span className={`px-3 py-1 rounded-full text-[10px] border ${payInfo.class}`}>{payInfo.label}</span>
                                            </td>
                                            <td className='p-4'>
                                                <div className={`flex items-center gap-2 font-bold text-xs ${statusInfo.color}`}>
                                                    {statusInfo.icon} {statusInfo.label}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Empty State Logic */}
                    {orders.length === 0 && (
                        <div className='text-center py-12 text-amber-100/60 text-xl flex flex-col items-center gap-4'>
                            <FiPackage className="text-5xl opacity-20" />
                            No Orders found
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyOrder;