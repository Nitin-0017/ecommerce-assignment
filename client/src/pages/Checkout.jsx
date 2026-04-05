import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { userService } from '../services/userService';
import { toast } from 'react-toastify';
import { FaCheckCircle, FaTruck, FaCreditCard, FaLock, FaMoneyBillWave, FaWallet, FaPlus } from 'react-icons/fa';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import AddressCard from '../components/AddressCard';
import AddressFormModal from '../components/AddressFormModal';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, clearCart } = useCart();
  const { user } = useAuth();

  const buyNowProduct = location.state?.buyNowProduct;
  const selectedItemIds = location.state?.selectedItemIds || [];
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [useManualEntry, setUseManualEntry] = useState(false);

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  });

  const [paymentMethod, setPaymentMethod] = useState('cod');

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await userService.getProfile();
      const addresses = response.user?.addresses || [];
      setSavedAddresses(addresses);

      if (addresses.length > 0) {
        const defaultAddress = addresses.find(addr => addr.isDefault) || addresses[0];
        setSelectedAddressId(defaultAddress._id);
        setShippingAddress({
          fullName: defaultAddress.fullName,
          phone: defaultAddress.phone,
          addressLine1: defaultAddress.addressLine1,
          addressLine2: defaultAddress.addressLine2 || '',
          city: defaultAddress.city,
          state: defaultAddress.state,
          zipCode: defaultAddress.zipCode,
          country: defaultAddress.country
        });
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const handleSelectAddress = (address) => {
    setSelectedAddressId(address._id);
    setShippingAddress({
      fullName: address.fullName,
      phone: address.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || '',
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country
    });
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    setShowAddressModal(true);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setShowAddressModal(true);
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;

    try {
      await userService.deleteAddress(addressId);
      toast.success('Address deleted successfully');
      await fetchAddresses();

      if (selectedAddressId === addressId) {
        setSelectedAddressId(null);
      }
    } catch (error) {
      toast.error('Failed to delete address');
    }
  };

  const handleSaveAddress = async (addressData) => {
    try {
      if (editingAddress) {
        await userService.updateAddress(editingAddress._id, addressData);
        toast.success('Address updated successfully');
      } else {
        const response = await userService.addAddress(addressData);
        toast.success('Address added successfully');

        const newAddresses = response.addresses || [];
        if (newAddresses.length > 0) {
          const latestAddress = newAddresses[newAddresses.length - 1];
          setSelectedAddressId(latestAddress._id);
          handleSelectAddress(latestAddress);
        }
      }

      await fetchAddresses();
      setShowAddressModal(false);
      setEditingAddress(null);
    } catch (error) {
      toast.error(error.message || 'Failed to save address');
      throw error;
    }
  };

  const calculateSubtotal = () => {
    if (buyNowProduct) {
      const price = buyNowProduct.price || 0;
      return price * 83 * (buyNowProduct.quantity || 1);
    }

    return cart?.items?.reduce((sum, item) => {
      if (selectedItemIds.length > 0 && !selectedItemIds.includes(item.product._id)) return sum;
      const price = item.product?.price || 0;
      return sum + (price * 83 * item.quantity);
    }, 0) || 0;
  };

  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.18;
  const shipping = subtotal > 500 ? 0 : 40;
  const total = subtotal + tax + shipping;

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
  };

  const validateAddress = () => {
    const required = ['fullName', 'phone', 'addressLine1', 'city', 'state', 'zipCode'];
    for (let field of required) {
      if (!shippingAddress[field]?.trim()) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    if (shippingAddress.zipCode.length !== 6) {
      toast.error('Pincode must be 6 digits');
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateAddress()) return;

    setLoading(true);
    try {
      const orderItems = buyNowProduct
        ? [{
          product: buyNowProduct._id,
          quantity: buyNowProduct.quantity,
          price: buyNowProduct.price
        }]
        : cart.items
          .filter(item => selectedItemIds.length === 0 || selectedItemIds.includes(item.product._id))
          .map(item => ({
            product: item.product._id,
            quantity: item.quantity,
            price: item.product.price
          }));

      const orderData = {
        items: orderItems,
        shippingAddress,
        paymentMethod: paymentMethod === 'online' ? 'Card' : 'COD',
        subtotal: subtotal / 83,
        tax: tax / 83,
        shipping: shipping / 83,
        total: total / 83
      };

      if (paymentMethod === 'online') {
        const rzpOrder = await orderService.createRazorpayOrder(total);

        const options = {
          key: "rzp_test_S6mKouRP3XKo5Y",
          amount: Math.round(total * 100),
          currency: "INR",
          name: "SwiftKart",
          description: "Order Payment",
          order_id: rzpOrder.order.id,
          handler: async function (response) {
            try {
              setLoading(true);
              await orderService.verifyPayment({
                ...response,
                orderData,
                ...(selectedItemIds && selectedItemIds.length > 0 && { selectedItemIds })
              });
              if (!buyNowProduct) {
                await clearCart();
              }
              toast.success('Payment successful! Order placed.');
              setIsOrderPlaced(true);
              navigate('/order-success', { state: { orderPlaced: true } });
            } catch (error) {
              toast.error('Payment verification failed');
            } finally {
              setLoading(false);
            }
          },
          prefill: {
            name: shippingAddress.fullName,
            contact: shippingAddress.phone,
            email: user.email
          },
          theme: { color: "#020617" },
          modal: {
            ondismiss: function () {
              setLoading(false);
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        const orderPayload = selectedItemIds && selectedItemIds.length > 0
          ? { ...orderData, selectedItemIds }
          : orderData;

        await orderService.createOrder(orderPayload);
        if (!buyNowProduct) {
          await clearCart();
        }
        toast.success('Order placed successfully!');
        setIsOrderPlaced(true);
        navigate('/order-success', { state: { orderPlaced: true } });
      }
    } catch (error) {
      console.error('Order error:', error);
      toast.error(error.message || 'Failed to place order');
    } finally {
      if (paymentMethod !== 'online') setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Address', icon: FaTruck },
    { number: 2, title: 'Payment', icon: FaCreditCard },
    { number: 3, title: 'Review', icon: FaCheckCircle }
  ];

  if (!cart?.items?.length && !buyNowProduct && !isOrderPlaced) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-white py-8">
      <div className="container-custom max-w-5xl">
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${currentStep >= step.number
                    ? 'bg-gradient-to-r from-accent to-slate-600 text-white scale-110 shadow-soft-lg'
                    : 'bg-gray-200 text-gray-500'
                    }`}>
                    <step.icon size={24} />
                  </div>
                  <span className={`text-sm font-semibold ${currentStep >= step.number ? 'text-accent' : 'text-gray-500'
                    }`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-1 flex-1 mx-4 mt-[-20px] transition-all duration-300 ${currentStep > step.number ? 'bg-accent' : 'bg-gray-200'
                    }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <div className="space-y-6 animate-fade-in-up">
                <div className="card">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <FaTruck className="text-accent" />
                    Shipping Address
                  </h2>

                  {!useManualEntry ? (
                    <>
                      {savedAddresses.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 mb-6">
                          {savedAddresses.map(address => (
                            <AddressCard
                              key={address._id}
                              address={address}
                              isSelected={selectedAddressId === address._id}
                              onSelect={() => handleSelectAddress(address)}
                              onEdit={handleEditAddress}
                              onDelete={handleDeleteAddress}
                              showActions={true}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-10 bg-gray-50 rounded-apple-lg border-2 border-dashed border-gray-200 mb-6">
                          <FaTruck className="mx-auto text-4xl text-gray-300 mb-4" />
                          <h3 className="text-lg font-semibold text-gray-600">No saved addresses found</h3>
                          <p className="text-gray-500 mb-6">Add a new delivery address to continue</p>
                          <Button
                            onClick={handleAddAddress}
                            variant="primary"
                            size="md"
                          >
                            <FaPlus className="mr-2" />
                            Add New Address
                          </Button>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
                        {savedAddresses.length > 0 && (
                          <Button
                            onClick={handleAddAddress}
                            variant="primary"
                            className="flex-1"
                          >
                            <FaPlus className="mr-2" />
                            Add New Address
                          </Button>
                        )}
                        <Button
                          onClick={() => {
                            setUseManualEntry(true);
                            setSelectedAddressId(null);
                          }}
                          variant="secondary"
                          className="flex-1"
                        >
                          Enter Address Manually
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Full Name"
                          name="fullName"
                          value={shippingAddress.fullName}
                          onChange={handleAddressChange}
                          required
                        />
                        <Input
                          label="Phone Number"
                          name="phone"
                          type="tel"
                          value={shippingAddress.phone}
                          onChange={handleAddressChange}
                          required
                        />
                        <div className="md:col-span-2">
                          <Input
                            label="Address Line 1"
                            name="addressLine1"
                            value={shippingAddress.addressLine1}
                            onChange={handleAddressChange}
                            required
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Input
                            label="Address Line 2"
                            name="addressLine2"
                            value={shippingAddress.addressLine2}
                            onChange={handleAddressChange}
                            placeholder="Apartment, suite, etc. (optional)"
                          />
                        </div>
                        <Input
                          label="City"
                          name="city"
                          value={shippingAddress.city}
                          onChange={handleAddressChange}
                          required
                        />
                        <Input
                          label="State"
                          name="state"
                          value={shippingAddress.state}
                          onChange={handleAddressChange}
                          required
                        />
                        <Input
                          label="Pincode"
                          name="zipCode"
                          type="text"
                          maxLength="6"
                          value={shippingAddress.zipCode}
                          onChange={handleAddressChange}
                          required
                        />
                        <Input
                          label="Country"
                          name="country"
                          value={shippingAddress.country}
                          disabled
                        />
                      </div>

                      {savedAddresses.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-border">
                          <Button
                            onClick={() => {
                              setUseManualEntry(false);
                              fetchAddresses();
                            }}
                            variant="secondary"
                            size="sm"
                          >
                            Use Saved Address
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={() => {
                      if (!useManualEntry && !selectedAddressId) {
                        toast.error('Please select a delivery address');
                        return;
                      }
                      if (useManualEntry && !validateAddress()) {
                        return;
                      }
                      setCurrentStep(2);
                    }}
                    variant="primary"
                    size="lg"
                  >
                    Continue to Payment
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="card animate-fade-in-up">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <FaCreditCard className="text-accent" />
                  Payment Method
                </h2>
                <div className="space-y-4">
                  <label className="card cursor-pointer hover:shadow-soft-lg transition-all border-2 border-transparent hover:border-accent">
                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-5 h-5 accent-accent"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-lg">Cash on Delivery</p>
                        <p className="text-text-secondary text-sm">Pay when you receive your order</p>
                      </div>
                      <span className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                        <FaMoneyBillWave className="text-green-600 text-2xl" />
                      </span>
                    </div>
                  </label>

                  <label className={`card cursor-pointer hover:shadow-soft-lg transition-all border-2 ${paymentMethod === 'online' ? 'border-accent' : 'border-transparent'}`}>
                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        name="payment"
                        value="online"
                        checked={paymentMethod === 'online'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-5 h-5 accent-accent"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-lg">Online Payment</p>
                        <p className="text-text-secondary text-sm">UPI, Cards, Wallets via Razorpay</p>
                      </div>
                      <span className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                        <FaWallet className="text-slate-600 text-2xl" />
                      </span>
                    </div>
                  </label>
                </div>
                <div className="mt-6 flex justify-between">
                  <Button onClick={() => setCurrentStep(1)} variant="secondary">
                    Back
                  </Button>
                  <Button onClick={() => setCurrentStep(3)} variant="primary" size="lg">
                    Review Order
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6 animate-fade-in-up">
                <div className="card">
                  <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
                  <div className="space-y-3">
                    {buyNowProduct ? (

                      <div className="flex gap-4 items-center pb-3 border-b border-border">
                        <img
                          src={buyNowProduct.image}
                          alt={buyNowProduct.title}
                          className="w-16 h-16 object-contain bg-gray-50 rounded-apple-sm"
                        />
                        <div className="flex-1">
                          <p className="font-semibold line-clamp-1">{buyNowProduct.title}</p>
                          <p className="text-sm text-text-secondary">Qty: {buyNowProduct.quantity}</p>
                        </div>
                        <p className="font-bold">₹{(buyNowProduct.price * 83 * buyNowProduct.quantity).toFixed(0)}</p>
                      </div>
                    ) : (

                      cart.items
                        .filter(item => selectedItemIds.length === 0 || selectedItemIds.includes(item.product._id))
                        .map((item) => (
                          <div key={item.product._id} className="flex gap-4 items-center pb-3 border-b border-border">
                            <img
                              src={item.product.image}
                              alt={item.product.title}
                              className="w-16 h-16 object-contain bg-gray-50 rounded-apple-sm"
                            />
                            <div className="flex-1">
                              <p className="font-semibold line-clamp-1">{item.product.title}</p>
                              <p className="text-sm text-text-secondary">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-bold">₹{(item.product.price * 83 * item.quantity).toFixed(0)}</p>
                          </div>
                        ))
                    )}
                  </div>
                </div>

                <div className="card">
                  <h3 className="font-bold text-lg mb-3">Shipping Address</h3>
                  <p className="text-text-secondary">
                    {shippingAddress.fullName}<br />
                    {shippingAddress.phone}<br />
                    {shippingAddress.addressLine1}<br />
                    {shippingAddress.addressLine2 && <>{shippingAddress.addressLine2}<br /></>}
                    {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.zipCode}
                  </p>
                </div>

                <div className="card">
                  <h3 className="font-bold text-lg mb-3">Payment Method</h3>
                  <p className="text-text-secondary capitalize">
                    {paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                  </p>
                </div>

                <div className="flex justify-between gap-4">
                  <Button onClick={() => setCurrentStep(2)} variant="secondary">
                    Back
                  </Button>
                  <Button
                    onClick={handlePlaceOrder}
                    variant="primary"
                    size="lg"
                    loading={loading}
                    className="flex-1"
                  >
                    <FaLock className="mr-2" />
                    Place Order
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="card sticky top-20 bg-gradient-to-br from-white to-gray-50">
              <h3 className="text-xl font-bold mb-6">Price Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-text-secondary">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-text-secondary">
                  <span>Tax (18%)</span>
                  <span className="font-semibold">₹{tax.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-text-secondary">
                  <span>Shipping</span>
                  <span className="font-semibold">{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                </div>
                <div className="border-t-2 border-border pt-3">
                  <div className="flex justify-between text-2xl font-bold">
                    <span>Total</span>
                    <span className="text-black">
                      ₹{total.toFixed(0)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-apple-sm">
                <p className="text-sm text-green-800 flex items-center gap-2">
                  <FaLock className="text-green-600" />
                  Secure checkout with 256-bit encryption
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddressFormModal
        isOpen={showAddressModal}
        onClose={() => {
          setShowAddressModal(false);
          setEditingAddress(null);
        }}
        onSave={handleSaveAddress}
        initialData={editingAddress}
        title={editingAddress ? 'Edit Address' : 'Add New Address'}
      />
    </div>
  );
};

export default Checkout;
