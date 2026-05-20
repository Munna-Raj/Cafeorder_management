import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { ShoppingBag, User, Phone, MapPin, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Loader from '../../components/Loader';

const ManageOrders = () => {
  const { admin } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [admin]);

  const fetchOrders = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${admin.token}` },
      };
      const { data } = await axios.get('/api/orders', config);
      setOrders(data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch orders');
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${admin.token}` },
      };
      await axios.put(`/api/orders/${id}/status`, { status }, config);
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Update failed');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Manage Orders</h1>

      <div className="space-y-6">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full text-primary">
                    <ShoppingBag size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Order #{order._id.slice(-6)}</h3>
                    <p className="text-gray-500 text-sm">{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${
                    order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                    order.status === 'Preparing' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {order.status}
                  </span>
                  <select
                    className="border rounded-lg px-3 py-1.5 text-sm bg-gray-50 outline-none focus:ring-2 focus:ring-primary"
                    value={order.status}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Preparing">Preparing</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <h4 className="font-bold text-gray-700 uppercase text-xs tracking-wider">Customer Info</h4>
                  <div className="flex items-center text-gray-600">
                    <User size={18} className="mr-2" /> {order.customerName}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone size={18} className="mr-2" /> {order.customerPhone}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin size={18} className="mr-2" /> Table {order.tableNumber}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <h4 className="font-bold text-gray-700 uppercase text-xs tracking-wider mb-3">Items Ordered</h4>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    {order.orderItems.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="text-gray-700 font-medium">
                          {item.qty}x {item.name}
                        </span>
                        <span className="text-gray-500">Rs. {item.price * item.qty}</span>
                      </div>
                    ))}
                    <div className="pt-3 border-t flex justify-between font-bold text-lg text-primary">
                      <span>Total</span>
                      <span>Rs. {order.totalPrice}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-500">No orders found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageOrders;
