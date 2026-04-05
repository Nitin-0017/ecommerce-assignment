import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaBell, FaCheckDouble, FaBox, FaTruck, FaCheckCircle, FaTimesCircle, FaUndo, FaMoneyBillWave } from 'react-icons/fa';
import { notificationService } from '../services/notificationService';
import { toast } from 'react-toastify';

const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return interval + "y ago";
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return interval + "mo ago";
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return interval + "d ago";
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return interval + "h ago";
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return interval + "m ago";
    return "just now";
};

const NotificationDrawer = ({ isOpen, onClose, onUnreadCountChange }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen]);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const data = await notificationService.getNotifications();
            setNotifications(data.notifications);
            const unreadCount = data.notifications.filter(n => !n.isRead).length;
            onUnreadCountChange(unreadCount);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await notificationService.markAsRead(id);
            setNotifications(prev => {
                const updated = prev.map(n => n._id === id ? { ...n, isRead: true } : n);
                const unreadCount = updated.filter(n => !n.isRead).length;
                onUnreadCountChange(unreadCount);
                return updated;
            });
        } catch (error) {
            toast.error('Failed to mark notification as read');
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            onUnreadCountChange(0);
            toast.success('All notifications marked as read');
        } catch (error) {
            toast.error('Failed to mark all as read');
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'confirmed': return <FaBox className="text-blue-500" />;
            case 'processing': return <FaBox className="text-yellow-500" />;
            case 'shipped': return <FaTruck className="text-purple-500" />;
            case 'delivered': return <FaCheckCircle className="text-green-500" />;
            case 'cancelled': return <FaTimesCircle className="text-red-500" />;
            case 'return_requested':
            case 'returned': return <FaUndo className="text-orange-500" />;
            case 'refunded': return <FaMoneyBillWave className="text-green-600" />;
            default: return <FaBell className="text-accent" />;
        }
    };

    // Close on Escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-[70] flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-primary text-white">
                            <div className="flex items-center gap-3">
                                <FaBell className="text-accent" />
                                <h2 className="text-xl font-bold">Notifications</h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                            >
                                <FaTimes size={18} />
                            </button>
                        </div>

                        {/* Actions */}
                        {notifications.length > 0 && notifications.some(n => !n.isRead) && (
                            <div className="px-6 py-3 bg-gray-50 border-b border-gray-100 flex justify-end">
                                <button
                                    onClick={handleMarkAllAsRead}
                                    className="text-sm font-medium text-accent hover:text-accent-dark flex items-center gap-2"
                                >
                                    <FaCheckDouble size={14} />
                                    Mark all as read
                                </button>
                            </div>
                        )}

                        {/* List */}
                        <div className="flex-1 overflow-y-auto">
                            {loading && notifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-40 space-y-3">
                                    <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                                    <p className="text-gray-500">Loading notifications...</p>
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full p-10 text-center space-y-4">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-300">
                                        <FaBell size={32} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-700">No notifications yet</h3>
                                        <p className="text-gray-500 mt-1">We'll notify you when your order status updates.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {notifications.map((notification) => (
                                        <div
                                            key={notification._id}
                                            className={`p-6 transition-colors hover:bg-gray-50 relative group ${!notification.isRead ? 'bg-blue-50/30' : ''}`}
                                        >
                                            <div className="flex gap-4">
                                                <div className="mt-1">
                                                    <div className={`w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center border border-gray-100`}>
                                                        {getStatusIcon(notification.status)}
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <span className="text-xs font-bold text-accent uppercase tracking-wider">
                                                            Order #{notification.order.slice(-6).toUpperCase()}
                                                        </span>
                                                        <span className="text-[10px] text-gray-400 font-medium">
                                                            {timeAgo(notification.createdAt)}
                                                        </span>
                                                    </div>
                                                    <p className={`text-sm leading-relaxed ${!notification.isRead ? 'text-gray-900 font-semibold' : 'text-gray-600'}`}>
                                                        {notification.message}
                                                    </p>
                                                    {!notification.isRead && (
                                                        <button
                                                            onClick={() => handleMarkAsRead(notification._id)}
                                                            className="mt-3 text-xs font-bold text-blue-600 hover:text-blue-700 uppercase tracking-tighter"
                                                        >
                                                            Mark as read
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            {!notification.isRead && (
                                                <div className="absolute top-6 left-2 w-2 h-2 bg-accent rounded-full shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default NotificationDrawer;
