import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/user.model.js';
import { MOCK_RESTAURANTS } from './data.js';

const Restaurant = (await import('../models/restaurant.model.js')).default;

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cravon';

const seedRestaurants = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(MONGO_URI);
    console.log('Database connected.\n');

    // Find an owner for these restaurants
    let owner = await User.findOne({ email: 'superadmin@cravon.com' });
    if (!owner) {
      console.log('Superadmin not found. Looking for any available user...');
      owner = await User.findOne();
      if (!owner) {
        console.error('No users found in the database. Please run seedSuperadmin.ts first.');
        process.exit(1);
      }
    }
    console.log(`Using User [${owner.email}] as the owner of the mock restaurants.`);

    // Wipe existing restaurants to avoid duplicates
    console.log('\nWiping existing restaurants...');
    await Restaurant.deleteMany({});
    console.log('Cleared existing restaurants.');

    // Insert new mock data
    console.log('\nSeeding mock restaurants...');
    const franchises = ["Cravon Originals", "Quick Bites", "Premium Dining", undefined, undefined];
    const restaurantsWithOwner = MOCK_RESTAURANTS.map((rest, idx) => ({
      ...rest,
      ownerId: owner._id,
      franchiseName: franchises[idx % franchises.length],
      mealTimings: {
        breakfast: { open: "08:00", close: "11:00" },
        lunch: { open: "12:00", close: "16:00" },
        dinner: { open: "18:00", close: "23:30" }
      }
    }));

    await Restaurant.insertMany(restaurantsWithOwner);
    console.log(`Successfully seeded ${MOCK_RESTAURANTS.length} restaurants with menus!`);

    console.log('\nDatabase Seeded Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

await seedRestaurants();
