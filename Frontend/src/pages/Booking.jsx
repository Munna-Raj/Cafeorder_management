import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Calendar, Clock, Users, CheckCircle } from 'lucide-react';

const Booking = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    tableNumber: 1,
    bookingDate: '',
    bookingTime: '',
  });

  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/bookings', formData);
      setIsSuccess(true);
      toast.success('Table booked successfully!');
    } catch (error) {
      toast.error('Failed to book table');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={48} className="text-green-600" />
        </div>
        <h2 className="text-3xl font-bold mb-4 text-primary">Booking Confirmed!</h2>
        <p className="text-gray-600 mb-8">
          Thank you, {formData.customerName}. Your table #{formData.tableNumber} is booked for {formData.bookingDate} at {formData.bookingTime}.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="bg-primary text-white px-8 py-3 rounded-full hover:bg-opacity-90 transition"
        >
          Book Another Table
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl font-bold text-primary mb-6">Book a Table</h1>
          <p className="text-gray-600 text-lg mb-8">
            Planning a special evening or a quick meeting? Reserve your spot at Matka Cafe in advance and enjoy our cozy ambience.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="bg-secondary/20 p-3 rounded-lg mr-4 text-primary">
                <Calendar size={24} />
              </div>
              <div>
                <h3 className="font-bold">Select Date</h3>
                <p className="text-gray-500 text-sm">Pick your preferred day for the visit.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-secondary/20 p-3 rounded-lg mr-4 text-primary">
                <Clock size={24} />
              </div>
              <div>
                <h3 className="font-bold">Choose Time</h3>
                <p className="text-gray-500 text-sm">We are open from 8:00 AM to 10:00 PM.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-secondary/20 p-3 rounded-lg mr-4 text-primary">
                <Users size={24} />
              </div>
              <div>
                <h3 className="font-bold">Select Table</h3>
                <p className="text-gray-500 text-sm">Total 5 tables available for reservation.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                name="customerName"
                required
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary outline-none"
                placeholder="John Doe"
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
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary outline-none"
                placeholder="+977-9800000000"
                value={formData.customerPhone}
                onChange={handleChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  name="bookingDate"
                  required
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary outline-none"
                  value={formData.bookingDate}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input
                  type="time"
                  name="bookingTime"
                  required
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary outline-none"
                  value={formData.bookingTime}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Table Number</label>
              <select
                name="tableNumber"
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary outline-none bg-white"
                value={formData.tableNumber}
                onChange={handleChange}
              >
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>Table {num}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-opacity-90 transition disabled:opacity-50 mt-4"
            >
              {loading ? 'Booking...' : 'Confirm Reservation'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Booking;
