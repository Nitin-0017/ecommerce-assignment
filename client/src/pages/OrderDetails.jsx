import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { toast } from 'react-toastify';
import { FaBox, FaArrowLeft, FaCheckCircle, FaTruck, FaClock, FaCalendarAlt, FaCreditCard, FaMapMarkerAlt, FaPhone, FaUser, FaTimesCircle, FaUndoAlt, FaMoneyBillWave } from 'react-icons/fa';
import Button from '../components/ui/Button';
import OrderActionModal from '../components/ui/OrderActionModal';

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [modalConfig, setModalConfig] = useState({ isOpen: false, type: '' });

    useEffect(() => {
        fetchOrderDetails();
    }, [id]);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            const data = await orderService.getOrderById(id);
            setOrder(data.order);
        } catch (error) {
            console.error('Error fetching order details:', error);
            toast.error('Failed to load order details');
            navigate('/orders');
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'delivered':
                return <FaCheckCircle className="text-green-500" />;
            case 'shipped':
                return <FaTruck className="text-slate-500" />;
            case 'confirmed':
            case 'processing':
                return <FaClock className="text-yellow-500" />;
            case 'cancelled':
                return <FaTimesCircle className="text-red-500" />;
            case 'return_requested':
            case 'returned':
                return <FaUndoAlt className="text-blue-500" />;
            case 'refunded':
                return <FaMoneyBillWave className="text-emerald-500" />;
            default:
                return <FaBox className="text-gray-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'delivered':
                return 'bg-green-50 text-green-700 border-green-100';
            case 'shipped':
                return 'bg-slate-50 text-slate-700 border-slate-100';
            case 'confirmed':
            case 'processing':
                return 'bg-yellow-50 text-yellow-700 border-yellow-100';
            case 'cancelled':
                return 'bg-red-50 text-red-700 border-red-100';
            case 'return_requested':
            case 'returned':
                return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'refunded':
                return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    };

    const handleAction = async (reason) => {
        try {
            setActionLoading(true);
            const { type } = modalConfig;

            if (type === 'cancel') {
                const response = await orderService.cancelOrder(id);
                if (response.success) {
                    toast.success('Order cancelled successfully');
                    setOrder(prev => ({ ...prev, orderStatus: 'cancelled' }));
                }
            } else {
                const response = await orderService.returnOrder(id, reason);
                if (response.success) {
                    toast.success('Return request submitted');
                    setOrder(prev => ({ ...prev, orderStatus: 'return_requested' }));
                }
            }
            setModalConfig({ ...modalConfig, isOpen: false });
        } catch (error) {
            toast.error(error.response?.data?.message || `Failed to ${modalConfig.type} order`);
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-accent mx-auto mb-4"></div>
                    <p className="text-text-secondary text-lg">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (!order) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-white py-8">
            <div className="container-custom max-w-4xl">
                { }
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/orders')}
                            className="w-10 h-10 rounded-full bg-white shadow-soft flex items-center justify-center hover:bg-gray-50 transition-colors"
                        >
                            <FaArrowLeft className="text-primary" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-primary">Order Details</h1>
                            <p className="text-text-secondary">Order #{order._id.slice(-8).toUpperCase()}</p>
                        </div>
                    </div>
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-apple-sm border font-semibold ${getStatusColor(order.orderStatus || 'pending')}`}>
                        {getStatusIcon(order.orderStatus || 'pending')}
                        {(order.orderStatus || 'pending').charAt(0).toUpperCase() + (order.orderStatus || 'pending').slice(1)}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    { }
                    <div className="md:col-span-2 space-y-6">
                        { }
                        <div className="card">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <FaBox className="text-accent" />
                                Order Items
                            </h2>
                            <div className="divide-y divide-border">
                                {order.items.map((item, index) => (
                                    <div key={index} className="py-4 flex gap-4 first:pt-0 last:pb-0">
                                        <div className="w-20 h-20 bg-gray-50 rounded-apple-sm p-2 flex items-center justify-center border border-border">
                                            <img
                                                src={item.product?.image}
                                                alt={item.product?.title}
                                                className="max-w-full max-h-full object-contain"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-primary truncate">{item.product?.title}</p>
                                            <p className="text-sm text-text-secondary">Quantity: {item.quantity}</p>
                                            <p className="text-sm font-medium mt-1">₹{(item.price).toFixed(0)} / unit</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-primary">₹{(item.price * item.quantity).toFixed(0)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        { }
                        <div className="card">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <FaMapMarkerAlt className="text-accent" />
                                Shipping Information
                            </h2>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <FaUser className="mt-1 text-text-secondary text-sm" />
                                    <p className="font-semibold">{order.shippingAddress.fullName}</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <FaPhone className="mt-1 text-text-secondary text-sm" />
                                    <p className="text-text-secondary">{order.shippingAddress.phone}</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <FaMapMarkerAlt className="mt-1 text-text-secondary text-sm" />
                                    <div className="text-text-secondary">
                                        <p>{order.shippingAddress.addressLine1}</p>
                                        {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                                        <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}</p>
                                        <p>{order.shippingAddress.country}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    { }
                    <div className="space-y-6">
                        { }
                        <div className="card bg-gray-50/50">
                            <h3 className="font-bold mb-4">Summary</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-text-secondary flex items-center gap-2">
                                        <FaCalendarAlt /> Date
                                    </span>
                                    <span className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-text-secondary flex items-center gap-2">
                                        <FaCreditCard /> Payment
                                    </span>
                                    <span className="font-medium">{order.paymentMethod}</span>
                                </div>
                            </div>
                            <div className="mt-6 pt-6 border-t border-border space-y-3 px-1">
                                <div className="flex justify-between text-sm">
                                    <span className="text-text-secondary">Subtotal</span>
                                    <span>₹{(order.subtotal).toFixed(0)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-text-secondary">Tax (18%)</span>
                                    <span>₹{(order.tax).toFixed(0)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-text-secondary">Shipping</span>
                                    <span>₹{(order.shipping).toFixed(0)}</span>
                                </div>
                                <div className="flex justify-between items-center pt-3 border-t border-border mt-3">
                                    <span className="font-bold text-lg">Total</span>
                                    <span className="text-2xl font-bold text-black">
                                        ₹{(order.total).toFixed(0)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {['pending', 'confirmed'].includes(order.orderStatus) && (
                                <Button
                                    onClick={() => setModalConfig({ isOpen: true, type: 'cancel' })}
                                    variant="secondary"
                                    className="w-full text-slate-600 hover:text-red-600 transition-colors"
                                >
                                    Cancel Order
                                </Button>
                            )}
                            {order.orderStatus === 'delivered' && (
                                <Button
                                    onClick={() => setModalConfig({ isOpen: true, type: 'return' })}
                                    variant="secondary"
                                    className="w-full text-slate-600 hover:text-blue-600 transition-colors"
                                >
                                    Return Order
                                </Button>
                            )}
                            <Button
                                onClick={() => navigate('/products')}
                                variant="secondary"
                                className="w-full"
                            >
                                Continue Shopping
                            </Button>
                        </div>
                    </div>
                </div>

                <OrderActionModal
                    isOpen={modalConfig.isOpen}
                    type={modalConfig.type}
                    loading={actionLoading}
                    onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                    onConfirm={handleAction}
                />
            </div>
        </div>
    );
};

export default OrderDetails;
