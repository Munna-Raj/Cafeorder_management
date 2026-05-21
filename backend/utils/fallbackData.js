const fallbackFood = [
  {
    _id: 'fallback-tea',
    name: 'Matka Masala Tea',
    price: 50,
    description: 'Authentic Nepali spiced tea served in a traditional clay pot.',
    category: 'Beverage',
    image: 'https://images.unsplash.com/photo-1594631252845-29fc4586c55c?auto=format&fit=crop&q=80&w=500',
    isAvailable: true,
  },
  {
    _id: 'fallback-momo',
    name: 'Veg Paneer MoMo',
    price: 180,
    description: 'Steamed dumplings filled with spiced cottage cheese and minced vegetables.',
    category: 'Snacks',
    image: 'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?auto=format&fit=crop&q=80&w=500',
    isAvailable: true,
  },
  {
    _id: 'fallback-chowmein',
    name: 'Veg Chowmein',
    price: 120,
    description: 'Stir-fried noodles with fresh garden vegetables and Nepali spices.',
    category: 'Snacks',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=500',
    isAvailable: true,
  },
  {
    _id: 'fallback-samosa',
    name: 'Samosa Chat',
    price: 100,
    description: 'Crushed samosas topped with tangy chutneys, yogurt, and spices.',
    category: 'Snacks',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=500',
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
