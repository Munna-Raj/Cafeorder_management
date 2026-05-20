const express = require('express');
const router = express.Router();
const {
  addOrderItems,
  getOrderById,
  updateOrderStatus,
  getOrders,
  getStats,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(addOrderItems).get(protect, getOrders);
router.get('/stats', protect, getStats);
router.route('/:id').get(getOrderById);
router.route('/:id/status').put(protect, updateOrderStatus);

module.exports = router;
