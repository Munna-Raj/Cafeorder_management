const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, 'Please add a customer name'],
    },
    customerPhone: {
      type: String,
      required: [true, 'Please add a phone number'],
    },
    tableNumber: {
      type: Number,
      required: [true, 'Please select a table number'],
    },
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        foodItem: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'FoodItem',
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    status: {
      type: String,
      required: true,
      default: 'Pending',
      enum: ['Pending', 'Preparing', 'Delivered', 'Cancelled'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', orderSchema);
