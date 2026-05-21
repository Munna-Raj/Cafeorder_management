const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');
const FoodItem = require('./models/FoodItem');
const Content = require('./models/Content');
const Table = require('./models/Table');
const Category = require('./models/Category');
const { DEFAULT_TYPES } = require('./utils/categoryStore');
const connectDB = require('./config/db');

dotenv.config();

const seedData = async () => {
  try {
    console.log('Connecting to database for seeding...');
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('Connected! Starting seed...');

    // Clear existing data
    await Admin.deleteMany();
    await FoodItem.deleteMany();
    await Content.deleteMany();
    await Table.deleteMany();
    await Category.deleteMany();

    // Create Admin
    await Admin.create({
      email: 'my2056875@gmail.com',
      password: 'Matka123',
    });

    console.log('Admin user created');

    // Create Tables
    const tables = [1, 2, 3, 4, 5].map(num => ({ tableNumber: num, isOccupied: false }));
    await Table.insertMany(tables);
    console.log('Tables initialized');

    await Category.insertMany(
      DEFAULT_TYPES.map((name, i) => ({ name, sortOrder: i + 1 }))
    );
    console.log('Menu types initialized');

    // Create Sample Food Items
    const sampleFood = [
      {
        name: 'Matka Masala Tea',
        price: 50,
        description: 'Authentic Nepali spiced tea served in a traditional clay pot.',
        category: 'Beverage',
        image: 'https://images.unsplash.com/photo-1594631252845-29fc4586c55c?auto=format&fit=crop&q=80&w=500',
      },
      {
        name: 'Veg Paneer MoMo',
        price: 180,
        description: 'Steamed dumplings filled with spiced cottage cheese and minced vegetables.',
        category: 'Snacks',
        image: 'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?auto=format&fit=crop&q=80&w=500',
      },
      {
        name: 'Veg Chowmein',
        price: 120,
        description: 'Stir-fried noodles with fresh garden vegetables and Nepali spices.',
        category: 'Snacks',
        image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=500',
      },
      {
        name: 'Samosa Chat',
        price: 100,
        description: 'Crushed samosas topped with tangy chutneys, yogurt, and spices.',
        category: 'Snacks',
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=500',
      }
    ];

    await FoodItem.insertMany(sampleFood);
    console.log('Sample veg food items created');

    // Create Sample Content
    const sampleContent = [
      {
        section: 'hero',
        title: 'Matka House',
        subtitle: '100% Pure Vegetarian Cafe',
        description: 'Experience the traditional Matka tea and delicious veg delicacies in Inaruwa.',
        image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=2078',
      },
      {
        section: 'about',
        title: 'Our Story',
        description: 'Matka House is Inaruwa\'s premier 100% pure vegetarian destination, dedicated to preserving traditional Nepali flavors.',
      },
      {
        section: 'contact',
        title: 'Contact Us',
        details: {
          address: 'Inaruwa-3, Sunsari, Nepal',
          phone: '9814372647',
          email: 'MatkaHouse@gmail.com',
        },
      },
    ];

    await Content.insertMany(sampleContent);
    console.log('Sample content created');

    console.log('Data Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
