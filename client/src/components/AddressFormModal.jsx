import React, { useState, useEffect } from 'react';
import { FaTimes, FaMapMarkerAlt } from 'react-icons/fa';
import Button from './ui/Button';
import Input from './ui/Input';

const AddressFormModal = ({
    isOpen,
    onClose,
    onSave,
    initialData = null,
    title = 'Add New Address'
}) => {
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India',
        isDefault: false
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                fullName: initialData.fullName || '',
                phone: initialData.phone || '',
                addressLine1: initialData.addressLine1 || '',
                addressLine2: initialData.addressLine2 || '',
                city: initialData.city || '',
                state: initialData.state || '',
                zipCode: initialData.zipCode || '',
                country: initialData.country || 'India',
                isDefault: initialData.isDefault || false
            });
        } else {
            setFormData({
                fullName: '',
                phone: '',
                addressLine1: '',
                addressLine2: '',
                city: '',
                state: '',
                zipCode: '',
                country: 'India',
                isDefault: false
            });
        }
        setErrors({});
    }, [initialData, isOpen]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};
        const required = ['fullName', 'phone', 'addressLine1', 'city', 'state', 'zipCode'];

        required.forEach(field => {
            if (!formData[field]?.trim()) {
                newErrors[field] = `${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`;
            }
        });

        if (formData.zipCode && formData.zipCode.length !== 6) {
            newErrors.zipCode = 'Pincode must be 6 digits';
        }

        if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\s/g, ''))) {
            newErrors.phone = 'Phone number must be 10 digits';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);
        try {
            await onSave(formData);
            onClose();
        } catch (error) {
            console.error('Error saving address:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-apple-lg shadow-soft-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
                <div className="sticky top-0 bg-white border-b border-border p-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                        <FaMapMarkerAlt className="text-accent" />
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Full Name"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            error={errors.fullName}
                            required
                            placeholder="John Doe"
                        />

                        <Input
                            label="Phone Number"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            error={errors.phone}
                            required
                            placeholder="9876543210"
                            maxLength="10"
                        />

                        <div className="md:col-span-2">
                            <Input
                                label="Address Line 1"
                                name="addressLine1"
                                value={formData.addressLine1}
                                onChange={handleChange}
                                error={errors.addressLine1}
                                required
                                placeholder="Street address, P.O. box"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <Input
                                label="Address Line 2"
                                name="addressLine2"
                                value={formData.addressLine2}
                                onChange={handleChange}
                                placeholder="Apartment, suite, unit, building, floor, etc. (optional)"
                            />
                        </div>

                        <Input
                            label="City"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            error={errors.city}
                            required
                            placeholder="Mumbai"
                        />

                        <Input
                            label="State"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            error={errors.state}
                            required
                            placeholder="Maharashtra"
                        />

                        <Input
                            label="Pincode"
                            name="zipCode"
                            type="text"
                            value={formData.zipCode}
                            onChange={handleChange}
                            error={errors.zipCode}
                            required
                            placeholder="400001"
                            maxLength="6"
                        />

                        <Input
                            label="Country"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            disabled
                        />
                    </div>

                    <div className="mt-4">
                        <label className="flex items-center gap-3 cursor-pointer p-4 rounded-apple hover:bg-gray-50 transition-colors">
                            <input
                                type="checkbox"
                                name="isDefault"
                                checked={formData.isDefault}
                                onChange={handleChange}
                                className="w-5 h-5 accent-accent cursor-pointer"
                            />
                            <div>
                                <p className="font-semibold">Set as default address</p>
                                <p className="text-sm text-text-secondary">
                                    This address will be automatically selected for your orders
                                </p>
                            </div>
                        </label>
                    </div>

                    <div className="flex gap-3 mt-6 pt-6 border-t border-border">
                        <Button
                            type="button"
                            onClick={onClose}
                            variant="secondary"
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            loading={loading}
                            className="flex-1"
                        >
                            {initialData ? 'Update Address' : 'Save Address'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddressFormModal;
