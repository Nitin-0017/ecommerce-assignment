import React, { useEffect } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { FaHome, FaShoppingBag } from 'react-icons/fa';
import Button from '../components/ui/Button';

const OrderSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const orderPlaced = location.state?.orderPlaced;

    if (!orderPlaced) {
        return <Navigate to="/home" replace />;
    }

    return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center py-12 px-4 select-none">
            <div className="max-w-md w-full text-center space-y-8 animate-fade-in-up">
                <div className="flex justify-center">
                    <div className="relative w-32 h-32">
                        { }
                        <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20" />

                        { }
                        <div className="relative w-full h-full bg-white rounded-full flex items-center justify-center shadow-soft-xl border border-green-50 animate-scale-up">
                            <svg
                                className="w-16 h-16 text-green-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    className="animate-draw-check"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2.5"
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                        Order Placed Successfully
                    </h1>
                    <div className="space-y-2">
                        <p className="text-lg text-gray-600">
                            Thank you for placing your order with SwiftKart.
                        </p>
                        <p className="text-sm text-gray-400">
                            We'll notify you once your order is shipped.
                        </p>
                    </div>
                </div>

                <div className="pt-8 space-y-4">
                    <Button
                        onClick={() => navigate('/products')}
                        variant="primary"
                        className="w-full text-lg py-4 rounded-2xl shadow-apple-hover transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Discover More Products
                    </Button>

                    <button
                        onClick={() => navigate('/orders')}
                        className="w-full py-3 text-gray-500 font-medium hover:text-gray-800 transition-colors flex items-center justify-center gap-2 group"
                    >
                        View My Orders
                        <div className="w-0 group-hover:w-2 h-[1px] bg-gray-400 transition-all duration-300" />
                    </button>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes scale-up {
                    0% { transform: scale(0); opacity: 0; }
                    60% { transform: scale(1.1); }
                    100% { transform: scale(1); opacity: 1; }
                }

                @keyframes draw-check {
                    0% { stroke-dasharray: 0, 100; stroke-dashoffset: 0; }
                    100% { stroke-dasharray: 100, 0; stroke-dashoffset: 0; }
                }

                @keyframes fade-in-up {
                    0% { transform: translateY(20px); opacity: 0; }
                    100% { transform: translateY(0); opacity: 1; }
                }

                .animate-scale-up {
                    animation: scale-up 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                }

                .animate-draw-check {
                    stroke-dasharray: 100;
                    stroke-dashoffset: 100;
                    animation: draw-check 0.8s 0.3s cubic-bezier(0.65, 0, 0.45, 1) forwards;
                }

                .animate-fade-in-up {
                    animation: fade-in-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
                }

                .shadow-soft-xl {
                    box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.05);
                }

                .shadow-apple-hover:hover {
                    box-shadow: 0 10px 25px -10px rgba(0, 0, 0, 0.1);
                }

                @media (prefers-reduced-motion: reduce) {
                    .animate-scale-up,
                    .animate-draw-check,
                    .animate-fade-in-up,
                    .animate-ping {
                        animation: none !important;
                        opacity: 1 !important;
                        transform: none !important;
                        stroke-dashoffset: 0 !important;
                    }
                }
            `}} />
        </div>
    );
};

export default OrderSuccess;
