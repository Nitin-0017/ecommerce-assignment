import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaExclamationTriangle, FaUndo } from 'react-icons/fa';
import Button from './Button';

const OrderActionModal = ({
    isOpen,
    onClose,
    onConfirm,
    type,
    loading
}) => {
    const [reason, setReason] = useState('');

    const returnReasons = [
        "Changed my mind",
        "Product is damaged",
        "Wrong item received",
        "Quality not as expected",
        "Found a better price elsewhere",
        "Other"
    ];

    if (!isOpen) return null;

    const isCancel = type === 'cancel';

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                {}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                />

                {}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-lg bg-white rounded-[24px] shadow-2xl overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-8">
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-3 rounded-full ${isCancel ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
                                {isCancel ? <FaExclamationTriangle size={24} /> : <FaUndo size={24} />}
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                            >
                                <FaTimes size={20} />
                            </button>
                        </div>

                        <h2 className="text-2xl font-bold text-slate-900 mb-2">
                            {isCancel ? 'Cancel Order' : 'Return Order'}
                        </h2>
                        <p className="text-slate-500 mb-8 leading-relaxed">
                            {isCancel
                                ? 'Are you sure you want to cancel this order? This action cannot be undone.'
                                : 'Please select a reason for returning this item. We will process your request shortly.'
                            }
                        </p>

                        {!isCancel && (
                            <div className="mb-8">
                                <label className="block text-sm font-bold text-slate-700 mb-3">Reason for Return</label>
                                <div className="grid grid-cols-1 gap-3">
                                    {returnReasons.map((r) => (
                                        <button
                                            key={r}
                                            onClick={() => setReason(r)}
                                            className={`text-left px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium ${reason === r
                                                    ? 'border-slate-900 bg-slate-50 text-slate-900'
                                                    : 'border-slate-100 hover:border-slate-200 text-slate-600'
                                                }`}
                                        >
                                            {r}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                                variant="secondary"
                                onClick={onClose}
                                fullWidth
                                disabled={loading}
                            >
                                Go Back
                            </Button>
                            <Button
                                variant={isCancel ? 'primary' : 'primary'}
                                onClick={() => onConfirm(reason)}
                                fullWidth
                                loading={loading}
                                disabled={!isCancel && !reason}
                                className={isCancel ? 'bg-slate-900 hover:bg-slate-800' : ''}
                            >
                                {isCancel ? 'Confirm Cancellation' : 'Submit Return'}
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default OrderActionModal;
