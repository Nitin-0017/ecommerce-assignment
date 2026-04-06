import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { toast } from 'react-toastify';
import { FaBox, FaCheckCircle, FaTruck, FaClock, FaTimesCircle, FaUndoAlt, FaMoneyBillWave } from 'react-icons/fa';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';
import OrderActionModal from '../components/ui/OrderActionModal';
import emptyOrdersAnimation from '../assets/empty-orders.json';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: '', orderId: '' });
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getOrders();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
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
      const { type, orderId } = modalConfig;

      if (type === 'cancel') {
        const response = await orderService.cancelOrder(orderId);
        if (response.success) {
          toast.success('Order cancelled successfully');

          setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: 'cancelled' } : o));
        }
      } else {
        const response = await orderService.returnOrder(orderId, reason);
        if (response.success) {
          toast.success('Return request submitted');

          setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: 'return_requested' } : o));
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
          <p className="text-text-secondary text-lg">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-white">
        <EmptyState
          animationData={emptyOrdersAnimation}
          title="No orders yet"
          description="You haven't placed any orders yet. Start shopping and your orders will appear here!"
          actionLabel="Start Shopping"
          onAction={() => navigate('/products')}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-white py-8">
      <div className="container-custom">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            My Orders
          </h1>
        </div>

        <div className="space-y-6">
          {orders.slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage).map((order) => (
            <div key={order._id} className="card hover:shadow-soft-lg transition-all duration-300">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 pb-4 border-b border-border">
                <div>
                  <p className="text-sm text-text-secondary">Order ID</p>
                  <p className="font-bold text-lg text-primary">#{order._id.slice(-8).toUpperCase()}</p>
                </div>
                <div className="mt-2 md:mt-0">
                  <p className="text-sm text-text-secondary">Order Date</p>
                  <p className="font-semibold">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="mt-2 md:mt-0">
                  <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-apple-sm border font-semibold ${getStatusColor(order.orderStatus || 'pending')}`}>
                    {getStatusIcon(order.orderStatus || 'pending')}
                    {(order.orderStatus || 'pending').charAt(0).toUpperCase() + (order.orderStatus || 'pending').slice(1)}
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-4 items-center cursor-pointer group/item"
                    onClick={() => navigate(`/product/${item.product?._id}`)}
                  >
                    <div className="w-16 h-16 bg-gray-50 rounded-apple-sm flex items-center justify-center overflow-hidden">
                      <img
                        src={item.product?.image}
                        alt={item.product?.title}
                        className="w-full h-full object-contain group-hover/item:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold line-clamp-1 group-hover/item:text-accent transition-colors">{item.product?.title}</p>
                      <p className="text-sm text-text-secondary">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-black">
                      ₹{((item.product?.price || 0) * item.quantity).toFixed(0)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div>
                  <p className="text-sm text-text-secondary">Total Amount</p>
                  <p className="text-2xl font-bold text-black">
                    ₹{order.total ? (order.total).toFixed(0) : '0'}
                  </p>
                </div>
                <div className="flex gap-2">
                  {['pending', 'confirmed'].includes(order.orderStatus) && (
                    <Button
                      onClick={() => setModalConfig({ isOpen: true, type: 'cancel', orderId: order._id })}
                      variant="secondary"
                      size="sm"
                      className="text-slate-600 hover:text-red-600 transition-colors"
                    >
                      Cancel Order
                    </Button>
                  )}
                  {order.orderStatus === 'delivered' && (
                    <Button
                      onClick={() => setModalConfig({ isOpen: true, type: 'return', orderId: order._id })}
                      variant="secondary"
                      size="sm"
                      className="text-slate-600 hover:text-blue-600 transition-colors"
                    >
                      Return Order
                    </Button>
                  )}
                  <Button
                    onClick={() => navigate(`/order/${order._id}`)}
                    variant="secondary"
                    size="sm"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <OrderActionModal
          isOpen={modalConfig.isOpen}
          type={modalConfig.type}
          loading={actionLoading}
          onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
          onConfirm={handleAction}
        />

        { }
        {orders.length > ordersPerPage && (
          <div className="mt-8 flex justify-center items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-apple-sm bg-white border-2 border-border hover:border-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
            >
              Previous
            </button>

            <div className="flex gap-1">
              {[...Array(Math.ceil(orders.length / ordersPerPage))].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`w-10 h-10 rounded-apple-sm font-semibold transition-all ${currentPage === index + 1
                    ? 'bg-slate-900 text-white shadow-soft'
                    : 'bg-white border-2 border-border hover:border-slate-900'
                    }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(orders.length / ordersPerPage)))}
              disabled={currentPage === Math.ceil(orders.length / ordersPerPage)}
              className="px-4 py-2 rounded-apple-sm bg-white border-2 border-border hover:border-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
