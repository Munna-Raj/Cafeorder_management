const fallbackFood = [
  {
    _id: 'fallback-tea',
    name: 'Matka Masala Tea',
    price: 50,
    description: 'Authentic Nepali spiced tea served in a traditional clay pot.',
    category: 'Beverage',
    image: '',
    isAvailable: true,
  },
  {
    _id: 'fallback-momo',
    name: 'Veg Paneer MoMo',
    price: 180,
    description: 'Steamed dumplings filled with spiced cottage cheese and minced vegetables.',
    category: 'Snacks',
    image: '',
    isAvailable: true,
  },
  {
    _id: 'fallback-chowmein',
    name: 'Veg Chowmein',
    price: 120,
    description: 'Stir-fried noodles with fresh garden vegetables and Nepali spices.',
    category: 'Snacks',
    image: '',
    isAvailable: true,
  },
  {
    _id: 'fallback-samosa',
    name: 'Samosa Chat',
    price: 100,
    description: 'Crushed samosas topped with tangy chutneys, yogurt, and spices.',
    category: 'Snacks',
    image: '',
    isAvailable: true,
  },
];

const fallbackTables = [1, 2, 3, 4, 5].map((num) => ({
  _id: `fallback-table-${num}`,
  tableNumber: num,
  isOccupied: false,
}));

const getFallbackFood = () => fallbackFood;
const getFallbackTables = () => fallbackTables;

module.exports = { getFallbackFood, getFallbackTables };
