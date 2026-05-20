import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { 
  ShoppingBag, 
  Utensils, 
  Calendar, 
  DollarSign, 
  Clock, 
  CheckCircle,
  LayoutDashboard,
  Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Loader from '../../components/Loader';

const AdminDashboard = () => {
  const { admin } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${admin.token}` },
        };
        const [statsRes, ordersRes] = await Promise.all([
          axios.get('/api/orders/stats', config),
          axios.get('/api/orders', config),
        ]);
        setStats(statsRes.data);
        setRecentOrders(ordersRes.data.slice(0, 5));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data', error);
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [admin]);

  if (loading) return <Loader />;

  const statCards = [
    { title: 'Total Orders', value: stats?.totalOrders || 0, icon: <ShoppingBag size={24} />, color: 'bg-blue-500' },
    { title: 'Total Revenue', value: `Rs. ${stats?.totalRevenue || 0}`, icon: <DollarSign size={24} />, color: 'bg-green-500' },
    { title: 'Recent Orders', value: recentOrders.length, icon: <Clock size={24} />, color: 'bg-yellow-500' },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-primary text-white p-6">
        <h2 className="text-2xl font-bold mb-8 flex items-center">
          <LayoutDashboard className="mr-2" /> Admin Panel
        </h2>
        <nav className="space-y-4">
          <Link to="/admin" className="block p-3 rounded-lg bg-secondary text-primary font-bold">Dashboard</Link>
          <Link to="/admin/food" className="block p-3 rounded-lg hover:bg-secondary/20 transition">Manage Food</Link>
          <Link to="/admin/orders" className="block p-3 rounded-lg hover:bg-secondary/20 transition">Manage Orders</Link>
          <Link to="/admin/bookings" className="block p-3 rounded-lg hover:bg-secondary/20 transition">Manage Bookings</Link>
          <Link to="/admin/content" className="block p-3 rounded-lg hover:bg-secondary/20 transition">Site Content</Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm font-medium text-gray-600">Admin Active</span>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {statCards.map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
              <div className={`${stat.color} p-4 rounded-xl text-white mr-6`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">{stat.title}</p>
                <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Orders Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Recent Orders</h2>
            <Link to="/admin/orders" className="text-primary hover:underline text-sm font-bold">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-900">#{order._id.slice(-6)}</td>
                    <td className="px-6 py-4">{order.customerName}</td>
                    <td className="px-6 py-4 font-bold">Rs. {order.totalPrice}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                        order.status === 'Preparing' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
