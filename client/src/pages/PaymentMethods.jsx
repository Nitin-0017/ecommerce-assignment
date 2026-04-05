import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCreditCard, FaMoneyBillWave, FaWallet, FaShieldAlt } from 'react-icons/fa';
import Button from '../components/ui/Button';

const PaymentMethods = () => {
    const navigate = useNavigate();

    const methods = [
        {
            id: 'cod',
            title: 'Cash on Delivery',
            description: 'Pay with cash upon delivery',
            icon: FaMoneyBillWave,
            color: 'bg-green-100 text-green-600',
            available: true
        },
        {
            id: 'online',
            title: 'Online Payment (Razorpay)',
            description: 'UPI, Credit/Debit Cards, Net Banking',
            icon: FaCreditCard,
            color: 'bg-blue-100 text-blue-600',
            available: true
        },
        {
            id: 'wallet',
            title: 'Digital Wallets',
            description: 'Pay using popular wallets',
            icon: FaWallet,
            color: 'bg-purple-100 text-purple-600',
            available: false
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-white py-8">
            <div className="container-custom max-w-4xl">
                {}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate('/profile')}
                        className="w-10 h-10 rounded-full bg-white shadow-soft flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                        <FaArrowLeft className="text-primary" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-primary">Payment Methods</h1>
                        <p className="text-text-secondary">Manage your preferred payment options</p>
                    </div>
                </div>

                {}
                <div className="card mb-8 bg-blue-50 border-blue-100">
                    <div className="flex gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                            <FaShieldAlt className="text-blue-600 text-xl" />
                        </div>
                        <div>
                            <p className="font-semibold text-blue-900">Secure Payments</p>
                            <p className="text-blue-700 text-sm">
                                Your payment information is encrypted and processed securely through Razorpay.
                                We do not store your full card details on our servers.
                            </p>
                        </div>
                    </div>
                </div>

                {}
                <div className="space-y-4">
                    {methods.map((method) => (
                        <div
                            key={method.id}
                            className={`card transition-all duration-300 ${method.available ? 'hover:shadow-soft-lg' : 'opacity-60 grayscale'}`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`w-14 h-14 rounded-full flex items-center justify-center ${method.color}`}>
                                        <method.icon className="text-2xl" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">{method.title}</h3>
                                        <p className="text-sm text-text-secondary">{method.description}</p>
                                    </div>
                                </div>
                                <div>
                                    {method.available ? (
                                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wider">
                                            Active
                                        </span>
                                    ) : (
                                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full uppercase tracking-wider">
                                            Coming Soon
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <Button
                        onClick={() => navigate('/products')}
                        variant="primary"
                        size="lg"
                    >
                        Start Shopping
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PaymentMethods;
