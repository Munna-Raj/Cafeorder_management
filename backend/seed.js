const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');
const FoodItem = require('./models/FoodItem');
const Content = require('./models/Content');
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

    // Create Admin
    await Admin.create({
      email: 'my2056875@gmail.com',
      password: 'Matka123',
    });

    console.log('Admin user created');

    // Create Sample Food Items
    const sampleFood = [
      {
        name: 'Matka Tea',
        price: 50,
        description: 'Authentic Nepali tea served in a clay pot (Matka).',
        category: 'Beverage',
        image: 'https://images.unsplash.com/photo-1594631252845-29fc4586c55c?auto=format&fit=crop&q=80&w=500',
      },
      {
        name: 'Buff MoMo',
        price: 150,
        description: 'Steamed dumplings filled with spiced buffalo meat.',
        category: 'Snacks',
        image: 'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?auto=format&fit=crop&q=80&w=500',
      },
      {
        name: 'Chicken Choila',
        price: 200,
        description: 'Spicy grilled chicken salad with Nepali spices.',
        category: 'Snacks',
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=500',
      },
      {
        name: 'Masala Tea',
        price: 60,
        description: 'Traditional Nepali tea with aromatic spices.',
        category: 'Beverage',
        image: 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?auto=format&fit=crop&q=80&w=500',
      }
    ];

    await FoodItem.insertMany(sampleFood);
    console.log('Sample food items created');

    // Create Sample Content
    const sampleContent = [
      {
        section: 'hero',
        title: 'Welcome to Matka Cafe',
        subtitle: 'Authentic Nepali Taste in Every Sip',
        description: 'Experience the traditional Matka tea and delicious Nepali cuisine.',
        image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=2078',
      },
      {
        section: 'about',
        title: 'About Us',
        description: 'Matka Cafe is dedicated to bringing you the finest traditional flavors of Nepal. Our specialty is tea served in clay pots, providing a unique and earthy aroma.',
      },
      {
        section: 'contact',
        title: 'Contact Us',
        details: {
          address: 'Kathmandu, Nepal',
          phone: '+977-9800000000',
          email: 'info@matkacafe.com',
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
