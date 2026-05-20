import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Plus, Edit, Trash2, X, Upload } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Loader from '../../components/Loader';

const ManageFood = () => {
  const { admin } = useAuth();
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    image: '',
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchFood();
  }, []);

  const fetchFood = async () => {
    try {
      const { data } = await axios.get('/api/food');
      setFoodItems(data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch food items');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    const uploadData = new FormData();
    uploadData.append('image', file);
    setUploading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${admin.token}`,
        },
      };
      const { data } = await axios.post('/api/food/upload', uploadData, config);
      setFormData({ ...formData, image: data });
      setUploading(false);
    } catch (error) {
      toast.error('Image upload failed');
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const config = {
      headers: { Authorization: `Bearer ${admin.token}` },
    };

    try {
      if (editingItem) {
        await axios.put(`/api/food/${editingItem._id}`, formData, config);
        toast.success('Food item updated');
      } else {
        await axios.post('/api/food', formData, config);
        toast.success('Food item added');
      }
      setShowModal(false);
      setEditingItem(null);
      setFormData({ name: '', price: '', description: '', category: '', image: '' });
      fetchFood();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const config = {
          headers: { Authorization: `Bearer ${admin.token}` },
        };
        await axios.delete(`/api/food/${id}`, config);
        toast.success('Food item deleted');
        fetchFood();
      } catch (error) {
        toast.error('Delete failed');
      }
    }
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      price: item.price,
      description: item.description,
      category: item.category,
      image: item.image,
    });
    setShowModal(true);
  };

  if (loading) return <Loader />;

  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Manage Food Items</h1>
        <button
          onClick={() => {
            setEditingItem(null);
            setFormData({ name: '', price: '', description: '', category: '', image: '' });
            setShowModal(true);
          }}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center hover:bg-opacity-90"
        >
          <Plus size={20} className="mr-2" /> Add New Item
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
            <tr>
              <th className="px-6 py-4">Image</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {foodItems.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                </td>
                <td className="px-6 py-4 font-medium">{item.name}</td>
                <td className="px-6 py-4">{item.category}</td>
                <td className="px-6 py-4 font-bold">Rs. {item.price}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => openEditModal(item)} className="text-blue-500 hover:text-blue-700 mr-4">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(item._id)} className="text-red-500 hover:text-red-700">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-6">{editingItem ? 'Edit Food Item' : 'Add New Food Item'}</h2>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Food Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (NPR)</label>
                <input
                  type="number"
                  name="price"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  value={formData.price}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  name="category"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  placeholder="e.g. Snacks, Drinks"
                  value={formData.category}
                  onChange={handleInputChange}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  required
                  rows="3"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  value={formData.description}
                  onChange={handleInputChange}
                ></textarea>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Food Image</label>
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    name="image"
                    required
                    className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    placeholder="/uploads/image.jpg"
                    value={formData.image}
                    onChange={handleInputChange}
                  />
                  <label className="bg-gray-100 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-200 transition flex items-center">
                    <Upload size={18} className="mr-2" /> {uploading ? '...' : 'Upload'}
                    <input type="file" className="hidden" onChange={handleUpload} />
                  </label>
                </div>
              </div>
              <button
                type="submit"
                className="md:col-span-2 bg-primary text-white py-3 rounded-xl font-bold text-lg hover:bg-opacity-90 transition mt-4"
              >
                {editingItem ? 'Update Item' : 'Add Item'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageFood;
