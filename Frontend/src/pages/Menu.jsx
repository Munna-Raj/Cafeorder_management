import { useState, useEffect } from 'react';
import axios from 'axios';
import FoodCard from '../components/FoodCard';
import Loader from '../components/Loader';
import BackButton from '../components/BackButton';
import { Search, UtensilsCrossed, ShoppingBag, Trash2, CreditCard, User, Phone, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Menu = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [tableNumber, setTableNumber] = useState(1);
  const [orderLoading, setOrderLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '' });

  const { cartItems, removeFromCart, updateQty, itemsPrice, clearCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const { data } = await axios.get('/api/food');
        setFoodItems(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching food', error);
        setLoading(false);
      }
    };
    fetchFood();
  }, []);

  const categories = ['All', ...new Set(foodItems.map((item) => item.category))];

  const filteredItems = foodItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'All' || item.category === category;
    return matchesSearch && matchesCategory;
  });

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast.error('Add something to your tray first!');
      return;
    }
    if (!customerInfo.name || !customerInfo.phone) {
      toast.error('Please provide your name and phone');
      return;
    }

    setOrderLoading(true);
    try {
      const orderData = {
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        tableNumber: tableNumber,
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
      toast.success('Order placed successfully! 🥟', {
        duration: 4000,
        style: { background: '#5D2E17', color: '#fff', borderRadius: '1rem' }
      });
      clearCart();
      setCustomerInfo({ name: '', phone: '' });
    } catch (error) {
      toast.error('Failed to place order');
    } finally {
      setOrderLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-[#FDF5E6] pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <BackButton />
        <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Side: Menu (70%) */}
        <div className="lg:w-[70%]">
          <header className="mb-10">
            <p className="text-accent font-black tracking-widest text-xs uppercase mb-2">Today's Menu</p>
            <h1 className="text-4xl md:text-5xl font-black text-primary tracking-tighter leading-none mb-6">
              Brewed with care,<br />served with warmth.
            </h1>

            {/* Table Selection */}
            <div className="mb-8">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Select your table</p>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    onClick={() => setTableNumber(num)}
                    className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                      tableNumber === num 
                      ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' 
                      : 'bg-white text-primary border border-gray-100 hover:bg-cream'
                    }`}
                  >
                    Table {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                    category === cat 
                    ? 'bg-accent text-white shadow-lg shadow-accent/20' 
                    : 'bg-white/50 text-gray-500 hover:bg-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative group max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-accent transition-colors" size={18} />
              <input
                type="text"
                placeholder="Search food or drinks..."
                className="w-full pl-12 pr-6 py-3 bg-white rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-accent/20 transition-all font-bold text-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </header>

          {/* Menu Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredItems.map((food) => (
              <FoodCard key={food._id} food={food} />
            ))}
          </div>
          {filteredItems.length === 0 && (
            <div className="text-center py-20 bg-white/50 rounded-[2rem] border-2 border-dashed border-gray-200">
              <UtensilsCrossed size={40} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No items found in this category</p>
            </div>
          )}
        </div>

        {/* Right Side: Order Tray (30%) */}
        <div className="lg:w-[30%]">
          <div className="bg-white rounded-[2.5rem] shadow-2xl p-6 md:p-8 sticky top-28 border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="bg-accent/10 p-2 rounded-xl text-accent">
                  <ShoppingBag size={20} />
                </div>
                <h2 className="text-xl font-black text-primary tracking-tight uppercase">Order Details</h2>
              </div>
              <div className="bg-cream px-3 py-1 rounded-full">
                <span className="text-[10px] font-black text-primary uppercase">Serving: Table {tableNumber}</span>
              </div>
            </div>

            {/* Customer Info Form */}
            <div className="space-y-4 mb-8">
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                <input 
                  type="text"
                  placeholder="Your Name"
                  className="w-full pl-10 pr-4 py-3 bg-cream/50 rounded-xl text-xs font-bold outline-none focus:ring-1 focus:ring-accent/30"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                />
              </div>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                <input 
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full pl-10 pr-4 py-3 bg-cream/50 rounded-xl text-xs font-bold outline-none focus:ring-1 focus:ring-accent/30"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                />
              </div>
            </div>

            <div className="max-h-[300px] overflow-y-auto pr-2 scrollbar-thin mb-8">
              {cartItems.length > 0 ? (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item._id} className="flex items-center group">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-cream flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="ml-4 flex-grow min-w-0">
                        <h4 className="text-xs font-black text-primary truncate uppercase tracking-tight">{item.name}</h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] text-gray-400 font-bold">{item.qty}x</span>
                          <span className="text-[10px] text-accent font-black">Rs. {item.price * item.qty}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item._id)}
                        className="p-2 text-gray-200 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-xs font-bold text-gray-400 italic">Your tray is empty. Add something delicious ✨</p>
                </div>
              )}
            </div>

            <div className="border-t border-gray-50 pt-6">
              <div className="flex justify-between items-center mb-2 text-gray-400">
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Items</span>
                <span className="text-sm font-black">{cartItems.reduce((acc, i) => acc + i.qty, 0)}</span>
              </div>
              <div className="flex justify-between items-end mb-8">
                <span className="text-xs font-black text-primary uppercase tracking-[0.2em]">Grand Total</span>
                <span className="text-3xl font-black text-accent tracking-tighter">Rs. {itemsPrice}</span>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={orderLoading || cartItems.length === 0}
                className="w-full bg-primary hover:bg-primary-light text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center disabled:opacity-50 disabled:grayscale"
              >
                {orderLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <CreditCard size={18} className="mr-2" /> PLACE ORDER
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
