import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/user.model.js';
const Restaurant = (await import('../models/restaurant.model.js')).default;

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cravon';

const MOCK_RESTAURANTS = [
  {
    name: 'Burger Bros',
    description: 'The juiciest burgers in town, handcrafted with love and fresh ingredients.',
    address: '123 Food Street, Downtown',
    rating: 4.8,
    deliveryTime: 30,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      {
        name: 'Classic Cheeseburger',
        price: 150,
        description: 'Single beef patty, cheddar cheese, lettuce, tomato, and our secret sauce.',
        isVeg: false,
        image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop'
      },
      {
        name: 'Veggie Delight Burger',
        price: 130,
        description: 'Crispy plant-based patty with fresh veggies and vegan mayo.',
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?q=80&w=800&auto=format&fit=crop'
      },
      {
        name: 'Loaded Fries',
        price: 90,
        description: 'Golden fries topped with melted cheese and jalapeños.',
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?q=80&w=800&auto=format&fit=crop'
      }
    ]
  },
  {
    name: 'Spice Route Indian Cuisine',
    description: 'Authentic Indian curries and tandoori specials.',
    address: '45 Spice Lane, Heritage City',
    rating: 4.5,
    deliveryTime: 45,
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      {
        name: 'Butter Chicken',
        price: 350,
        description: 'Tender chicken pieces cooked in a rich, creamy tomato gravy.',
        isVeg: false,
        image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=800&auto=format&fit=crop'
      },
      {
        name: 'Paneer Tikka Masala',
        price: 320,
        description: 'Grilled cottage cheese cubes in a spicy onion-tomato gravy.',
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=800&auto=format&fit=crop'
      },
      {
        name: 'Garlic Naan',
        price: 60,
        description: 'Soft Indian bread topped with chopped garlic and butter.',
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800&auto=format&fit=crop'
      }
    ]
  },
  {
    name: 'Sushi Zen',
    description: 'Premium sushi rolls and authentic Japanese ramen.',
    address: '88 Sakura Boulevard',
    rating: 4.9,
    deliveryTime: 40,
    image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      {
        name: 'Spicy Tuna Roll',
        price: 450,
        description: 'Fresh tuna mixed with spicy mayo, wrapped in seaweed and rice.',
        isVeg: false,
        image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=800&auto=format&fit=crop'
      },
      {
        name: 'Veggie Tempura Roll',
        price: 350,
        description: 'Crispy fried vegetables rolled in sushi rice.',
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1c439?q=80&w=800&auto=format&fit=crop'
      }
    ]
  },
  {
    name: 'Pizza Paradiso',
    description: 'Wood-fired Italian pizzas baked to perfection.',
    address: '12 Little Italy',
    rating: 4.6,
    deliveryTime: 35,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      {
        name: 'Margherita Pizza',
        price: 299,
        description: 'Classic cheese and tomato pizza with fresh basil.',
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=800&auto=format&fit=crop'
      },
      {
        name: 'Pepperoni Pizza',
        price: 399,
        description: 'Loaded with premium beef pepperoni and mozzarella.',
        isVeg: false,
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=800&auto=format&fit=crop'
      }
    ]
  },
  {
    name: 'Healthy Greens Bowl',
    description: 'Fresh, nutritious, and organic salad bowls for a healthy lifestyle.',
    address: '99 Fitness Avenue',
    rating: 4.3,
    deliveryTime: 25,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    menu: [
      {
        name: 'Quinoa Avocado Salad',
        price: 250,
        description: 'Organic quinoa, fresh avocado, cherry tomatoes, and lemon dressing.',
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop'
      },
      {
        name: 'Grilled Chicken Salad',
        price: 280,
        description: 'Herb-grilled chicken breast on a bed of mixed greens.',
        isVeg: false,
        image: 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?q=80&w=800&auto=format&fit=crop'
      }
    ]
  },
  {
    name: 'Waffle House Co.',
    description: 'Sweet and savory waffles for breakfast lovers all day.',
    address: '10 Sunrise Street',
    rating: 4.7,
    deliveryTime: 30,
    image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Saturday', 'Sunday'],
    menu: [
      {
        name: 'Belgian Chocolate Waffle',
        price: 180,
        description: 'Classic Belgian waffle drenched in melted dark chocolate.',
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?q=80&w=800&auto=format&fit=crop'
      }
    ]
  }
];

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

    // Wipe existing restaurants
    console.log('\nWiping existing restaurants...');
    await Restaurant.deleteMany({});
    console.log('Cleared existing restaurants.');

    // Insert new mock data
    console.log('\nSeeding mock restaurants...');
    const restaurantsWithOwner = MOCK_RESTAURANTS.map(rest => ({
      ...rest,
      ownerId: owner._id
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
