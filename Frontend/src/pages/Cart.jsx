import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ChevronLeft, CreditCard } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Cart = () => {
  const { cartItems, removeFromCart, updateQty, itemsPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    tableNumber: 1,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        ...formData,
        orderItems: cartItems.map(item => ({
          name: item.name,
          qty: item.qty,
          image: item.image,
          price: item.price,
          foodItem: item._id
        })),
        totalPrice: itemsPrice,
      };

      await axios.post('/api/orders', orderData);
      toast.success('Order placed successfully!');
      clearCart();
      navigate('/');
    } catch (error) {
      toast.error('Failed to place order');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4 text-primary">Your Cart is Empty</h2>
        <p className="text-gray-600 mb-8">Add some delicious food to your order!</p>
        <Link to="/menu" className="bg-primary text-white px-8 py-3 rounded-full hover:bg-opacity-90 transition inline-flex items-center">
          <ChevronLeft size={20} className="mr-2" /> Back to Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-primary mb-8">Your Order</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {cartItems.map((item) => (
            <div key={item._id} className="flex items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <img
                src={item.image.startsWith('/') ? item.image : `/${item.image}`}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="ml-4 flex-grow">
                <h3 className="font-bold text-lg">{item.name}</h3>
                <p className="text-gray-500">Rs. {item.price}</p>
                <div className="flex items-center mt-2">
                  <button
                    onClick={() => updateQty(item._id, Math.max(1, item.qty - 1))}
                    className="p-1 rounded-md hover:bg-gray-100"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="mx-3 font-medium">{item.qty}</span>
                  <button
                    onClick={() => updateQty(item._id, item.qty + 1)}
                    className="p-1 rounded-md hover:bg-gray-100"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">Rs. {item.price * item.qty}</p>
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="text-red-500 hover:text-red-700 mt-2"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Checkout Form */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 h-fit sticky top-24">
          <h2 className="text-xl font-bold mb-6 border-b pb-4">Order Summary</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
              <input
                type="text"
                name="customerName"
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                value={formData.customerName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                name="customerPhone"
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                value={formData.customerPhone}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Table Number (1-5)</label>
              <select
                name="tableNumber"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white"
                value={formData.tableNumber}
                onChange={handleChange}
              >
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>Table {num}</option>
                ))}
              </select>
            </div>

            <div className="pt-6 border-t mt-6">
              <div className="flex justify-between text-lg font-bold mb-6">
                <span>Grand Total</span>
                <span className="text-primary">Rs. {itemsPrice}</span>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-3 rounded-xl font-bold text-lg hover:bg-opacity-90 transition disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? 'Processing...' : (
                  <>
                    <CreditCard size={20} className="mr-2" /> Place Order
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Cart;
