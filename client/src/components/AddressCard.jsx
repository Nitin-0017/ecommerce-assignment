import React from 'react';
import { FaEdit, FaTrash, FaCheckCircle } from 'react-icons/fa';
import Button from './ui/Button';

const AddressCard = ({
    address,
    isSelected = false,
    onSelect,
    onEdit,
    onDelete,
    showActions = true
}) => {
    return (
        <div
            className={`card cursor-pointer transition-all duration-300 hover:shadow-soft-lg ${isSelected
                    ? 'border-2 border-accent bg-accent/5'
                    : 'border-2 border-transparent hover:border-gray-200'
                }`}
            onClick={onSelect}
        >
            <div className="flex items-start gap-4">
                {onSelect && (
                    <input
                        type="radio"
                        checked={isSelected}
                        onChange={onSelect}
                        className="w-5 h-5 mt-1 accent-accent cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                    />
                )}

                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-lg">{address.fullName}</h3>
                        {address.isDefault && (
                            <span className="px-2 py-1 bg-accent text-white text-xs font-semibold rounded-full">
                                Default
                            </span>
                        )}
                    </div>

                    <p className="text-text-secondary mb-1">{address.phone}</p>

                    <p className="text-text-primary">
                        {address.addressLine1}
                        {address.addressLine2 && `, ${address.addressLine2}`}
                    </p>

                    <p className="text-text-primary">
                        {address.city}, {address.state} - {address.zipCode}
                    </p>

                    <p className="text-text-secondary">{address.country}</p>
                </div>

                {showActions && (
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => onEdit(address)}
                            className="p-2 hover:bg-gray-100 rounded-apple transition-colors text-primary"
                            title="Edit address"
                        >
                            <FaEdit size={16} />
                        </button>
                        <button
                            onClick={() => onDelete(address._id)}
                            className="p-2 hover:bg-red-50 rounded-apple transition-colors text-red-600"
                            title="Delete address"
                        >
                            <FaTrash size={16} />
                        </button>
                    </div>
                )}
            </div>

            {isSelected && (
                <div className="mt-3 pt-3 border-t border-accent/20">
                    <p className="text-sm text-accent font-semibold flex items-center gap-2">
                        <FaCheckCircle size={14} />
                        This address will be used for delivery
                    </p>
                </div>
            )}
        </div>
    );
};

export default AddressCard;
