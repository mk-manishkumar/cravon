import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/user.model.js';
const Restaurant = (await import('../models/restaurant.model.js')).default;

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cravon';

const MOCK_RESTAURANTS = [
  // ---------------- DELHI ----------------
  {
    name: 'The Mughal Court',
    description: 'Authentic Mughlai cuisine and rich curries from the heart of Old Delhi.',
    address: 'Chandni Chowk, Delhi',
    rating: 4.8,
    deliveryTime: 40,
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Mutton Nihari', price: 450, description: 'Slow-cooked mutton stew with bone marrow.', isVeg: false },
      { name: 'Shahi Paneer', price: 320, description: 'Cottage cheese in a creamy cashew and tomato gravy.', isVeg: true },
      { name: 'Khamiri Roti', price: 40, description: 'Traditional fluffy sourdough bread.', isVeg: true }
    ]
  },
  {
    name: 'Capital Cafe',
    description: 'Modern continental breakfast, brunch, and coffee in a chic setting.',
    address: 'Connaught Place, Delhi',
    rating: 4.5,
    deliveryTime: 35,
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'English Breakfast', price: 499, description: 'Eggs, sausages, baked beans, and toast.', isVeg: false },
      { name: 'Avocado Toast', price: 350, description: 'Smashed avocado on sourdough with feta.', isVeg: true },
      { name: 'Cappuccino', price: 180, description: 'Freshly brewed espresso with steamed milk foam.', isVeg: true }
    ]
  },

  // ---------------- GURGAON ----------------
  {
    name: 'CyberHub Bites',
    description: 'Quick, delicious fast food and sliders for the working professional.',
    address: 'Cyber City, Gurgaon',
    rating: 4.3,
    deliveryTime: 25,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    menu: [
      { name: 'Double Cheese Burger', price: 299, description: 'Two juicy patties with extra cheese.', isVeg: false },
      { name: 'Truffle Fries', price: 199, description: 'Crispy fries tossed in truffle oil and parmesan.', isVeg: true },
      { name: 'Oreo Shake', price: 150, description: 'Thick milkshake loaded with Oreo crumbles.', isVeg: true }
    ]
  },
  {
    name: 'The Corporate Thali',
    description: 'Wholesome North Indian thalis crafted for the perfect corporate lunch.',
    address: 'Sector 29, Gurgaon',
    rating: 4.6,
    deliveryTime: 30,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    menu: [
      { name: 'Executive Veg Thali', price: 250, description: 'Dal Makhani, Paneer, Rice, Roti, and Sweet.', isVeg: true },
      { name: 'Executive Non-Veg Thali', price: 300, description: 'Butter Chicken, Dal, Rice, Roti, and Sweet.', isVeg: false },
      { name: 'Lassi', price: 80, description: 'Traditional sweet yogurt drink.', isVeg: true }
    ]
  },

  // ---------------- NOIDA ----------------
  {
    name: 'Noida Nights Asian',
    description: 'Late-night Asian street food, noodles, and dim sum.',
    address: 'Sector 18, Noida',
    rating: 4.4,
    deliveryTime: 40,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Chicken Dim Sum', price: 220, description: 'Steamed dumplings stuffed with minced chicken.', isVeg: false },
      { name: 'Pad Thai Noodles', price: 280, description: 'Stir-fried rice noodles with peanuts and veggies.', isVeg: true },
      { name: 'Chilli Chicken', price: 310, description: 'Crispy chicken tossed in spicy soya sauce.', isVeg: false }
    ]
  },
  {
    name: 'Expressway Eats',
    description: 'Dhaba-style spicy curries and tandoori specials.',
    address: 'Sector 62, Noida',
    rating: 4.2,
    deliveryTime: 35,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Tandoori Chicken (Half)', price: 350, description: 'Char-grilled chicken marinated in yogurt and spices.', isVeg: false },
      { name: 'Dal Tadka', price: 180, description: 'Yellow lentils tempered with garlic and cumin.', isVeg: true },
      { name: 'Tandoori Roti', price: 20, description: 'Whole wheat bread baked in a clay oven.', isVeg: true }
    ]
  },

  // ---------------- HYDERABAD ----------------
  {
    name: 'Nizami Biryani House',
    description: 'The world-famous authentic Hyderabadi Dum Biryani.',
    address: 'Charminar, Hyderabad',
    rating: 4.9,
    deliveryTime: 45,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Mutton Dum Biryani', price: 400, description: 'Aromatic basmati rice cooked with marinated mutton.', isVeg: false },
      { name: 'Chicken 65', price: 250, description: 'Spicy, deep-fried chicken appetizer.', isVeg: false },
      { name: 'Double Ka Meetha', price: 120, description: 'Traditional bread pudding dessert.', isVeg: true }
    ]
  },
  {
    name: 'Tech Park Tiffins',
    description: 'Crispy dosas and fluffy idlis for a quick South Indian fix.',
    address: 'HITEC City, Hyderabad',
    rating: 4.6,
    deliveryTime: 20,
    image: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    menu: [
      { name: 'Masala Dosa', price: 90, description: 'Crispy crepe filled with spiced potato mash.', isVeg: true },
      { name: 'Idli Vada Combo', price: 80, description: 'Steamed rice cakes and lentil donut with chutney.', isVeg: true },
      { name: 'Filter Coffee', price: 40, description: 'Strong traditional South Indian coffee.', isVeg: true }
    ]
  },

  // ---------------- BANGALORE ----------------
  {
    name: 'Koramangala Kitchen',
    description: 'Trendy cafe offering continental fusion and craft beverages.',
    address: 'Koramangala, Bangalore',
    rating: 4.7,
    deliveryTime: 35,
    image: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Pesto Pasta', price: 320, description: 'Penne tossed in fresh basil pesto with cherry tomatoes.', isVeg: true },
      { name: 'BBQ Chicken Wings', price: 280, description: 'Six spicy and sweet glazed wings.', isVeg: false },
      { name: 'Cold Brew Coffee', price: 180, description: '12-hour steeped cold coffee.', isVeg: true }
    ]
  },
  {
    name: 'IT Hub Diner',
    description: 'Global cuisine covering everything from pizzas to global bowls.',
    address: 'Whitefield, Bangalore',
    rating: 4.5,
    deliveryTime: 40,
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    menu: [
      { name: 'Teriyaki Chicken Bowl', price: 350, description: 'Grilled teriyaki chicken with sticky rice and veggies.', isVeg: false },
      { name: 'Quinoa Salad', price: 280, description: 'Healthy quinoa mixed with fresh greens and vinaigrette.', isVeg: true },
      { name: 'Chocolate Brownie', price: 150, description: 'Warm fudge brownie with vanilla ice cream.', isVeg: true }
    ]
  },

  // ---------------- PATNA ----------------
  {
    name: 'Maurya Flavors',
    description: 'Authentic Bihari cuisine and North Indian delicacies.',
    address: 'Frazer Road, Patna',
    rating: 4.6,
    deliveryTime: 35,
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Litti Chokha', price: 150, description: 'Roasted wheat balls stuffed with sattu, served with mashed veggies.', isVeg: true },
      { name: 'Mutton Curry (Bihari Style)', price: 380, description: 'Spicy and rich mutton curry.', isVeg: false },
      { name: 'Malpua', price: 90, description: 'Traditional sweet pancake dipped in syrup.', isVeg: true }
    ]
  },
  {
    name: 'Ganga View Cafe',
    description: 'A cozy spot for evening snacks, teas, and fast food.',
    address: 'Gandhi Maidan, Patna',
    rating: 4.2,
    deliveryTime: 25,
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Kulhad Chai', price: 30, description: 'Masala tea served in an earthen cup.', isVeg: true },
      { name: 'Aloo Samosa (2 pcs)', price: 40, description: 'Crispy pastry stuffed with spiced potatoes.', isVeg: true },
      { name: 'Paneer Pakora', price: 80, description: 'Deep-fried cottage cheese fritters.', isVeg: true }
    ]
  },

  // ---------------- MUMBAI ----------------
  {
    name: 'Marine Drive Delights',
    description: 'Premium street food and iconic Bombay snacks.',
    address: 'Marine Drive, Mumbai',
    rating: 4.8,
    deliveryTime: 30,
    image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Bombay Vada Pav (2 pcs)', price: 60, description: 'Spicy potato dumpling in a soft bun with chutney.', isVeg: true },
      { name: 'Pav Bhaji', price: 140, description: 'Thick mixed vegetable curry served with buttered buns.', isVeg: true },
      { name: 'Pani Puri (1 Plate)', price: 50, description: 'Crispy spheres filled with spicy mint water.', isVeg: true }
    ]
  },
  {
    name: 'Bandra Bakery',
    description: 'Freshly baked breads, pastries, and artisanal cakes.',
    address: 'Bandra West, Mumbai',
    rating: 4.9,
    deliveryTime: 20,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Mava Cake', price: 120, description: 'Classic Iranian-style dense milk cake.', isVeg: true },
      { name: 'Chicken Puff', price: 80, description: 'Flaky pastry stuffed with spiced minced chicken.', isVeg: false },
      { name: 'Croissant', price: 110, description: 'Buttery, flaky French pastry.', isVeg: true }
    ]
  },

  // ---------------- PUNE ----------------
  {
    name: 'Deccan Spice',
    description: 'Traditional Maharashtrian misal and thalis.',
    address: 'Deccan Gymkhana, Pune',
    rating: 4.5,
    deliveryTime: 35,
    image: 'https://images.unsplash.com/photo-1626779844004-7a13d7756f70?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Puneri Misal Pav', price: 110, description: 'Spicy sprouted lentil curry topped with farsan, served with pav.', isVeg: true },
      { name: 'Puran Poli', price: 90, description: 'Sweet flatbread stuffed with lentil and jaggery.', isVeg: true },
      { name: 'Kothimbir Vadi', price: 80, description: 'Crispy coriander and chickpea flour fritters.', isVeg: true }
    ]
  },
  {
    name: 'Koregaon Park Pizzeria',
    description: 'Authentic Neapolitan pizzas and Italian sides.',
    address: 'Koregaon Park, Pune',
    rating: 4.7,
    deliveryTime: 40,
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Truffle Mushroom Pizza', price: 499, description: 'White sauce base with roasted mushrooms and truffle oil.', isVeg: true },
      { name: 'Prosciutto Pizza', price: 599, description: 'Tomato base topped with fresh mozzarella and prosciutto.', isVeg: false },
      { name: 'Garlic Bread with Cheese', price: 199, description: 'Toasted baguette with garlic butter and melted mozzarella.', isVeg: true }
    ]
  },

  // ---------------- KOLKATA ----------------
  {
    name: 'Park Street Treats',
    description: 'A blend of colonial Continental dishes and Bengali sweets.',
    address: 'Park Street, Kolkata',
    rating: 4.8,
    deliveryTime: 40,
    image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Chelo Kebab', price: 450, description: 'Signature buttered rice served with chicken and mutton kebabs and a fried egg.', isVeg: false },
      { name: 'Baked Fish', price: 380, description: 'Bhetki fish baked in a creamy mustard and cheese sauce.', isVeg: false },
      { name: 'Roshogolla (4 pcs)', price: 80, description: 'Spongy cottage cheese balls in light sugar syrup.', isVeg: true }
    ]
  },
  {
    name: 'Howrah Bridge Dhaba',
    description: 'Rustic Punjabi food with rich gravies and tandoor items.',
    address: 'Howrah, Kolkata',
    rating: 4.3,
    deliveryTime: 45,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Amritsari Kulcha', price: 110, description: 'Crispy stuffed potato flatbread served with chole.', isVeg: true },
      { name: 'Sarson Da Saag & Makki Roti', price: 250, description: 'Mustard greens curry with cornmeal flatbread.', isVeg: true },
      { name: 'Chicken Tikka', price: 280, description: 'Spicy marinated chicken chunks roasted in tandoor.', isVeg: false }
    ]
  },

  // ---------------- JAIPUR ----------------
  {
    name: 'Pink City Rajwada',
    description: 'Royal Rajasthani thalis and traditional curries.',
    address: 'Johari Bazaar, Jaipur',
    rating: 4.7,
    deliveryTime: 40,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Dal Bati Churma', price: 300, description: 'Hard wheat rolls served with mixed lentils and sweet churma.', isVeg: true },
      { name: 'Laal Maas', price: 450, description: 'Fiery Rajasthani mutton curry cooked with red chilies.', isVeg: false },
      { name: 'Gatte Ki Sabzi', price: 220, description: 'Gram flour dumplings in a spicy yogurt curry.', isVeg: true }
    ]
  },
  {
    name: 'Jal Mahal Sweets',
    description: 'Famous Rajasthani sweets and festive desserts.',
    address: 'Amer Road, Jaipur',
    rating: 4.8,
    deliveryTime: 25,
    image: 'https://images.unsplash.com/photo-1605807646983-377bc5a76493?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Ghevar', price: 150, description: 'Traditional disc-shaped sweet cake soaked in syrup.', isVeg: true },
      { name: 'Mawa Kachori', price: 60, description: 'Crispy pastry stuffed with sweetened khoya and nuts.', isVeg: true },
      { name: 'Rabdi', price: 90, description: 'Thickened sweetened milk topped with nuts.', isVeg: true }
    ]
  },

  // ---------------- RISHIKESH ----------------
  {
    name: 'Ganges Vegan Cafe',
    description: '100% plant-based organic food for the soul.',
    address: 'Tapovan, Rishikesh',
    rating: 4.9,
    deliveryTime: 35,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Vegan Buddha Bowl', price: 300, description: 'Brown rice, roasted sweet potato, kale, chickpeas, and tahini dressing.', isVeg: true },
      { name: 'Tofu Scramble', price: 220, description: 'Spiced crumbled tofu served with multigrain toast.', isVeg: true },
      { name: 'Kombucha', price: 150, description: 'Fermented sparkling probiotic tea.', isVeg: true }
    ]
  },

  // ---------------- SHIMLA ----------------
  {
    name: 'The Mall Road Bistro',
    description: 'Warm soups, momos, and continental comfort food with a view.',
    address: 'Mall Road, Shimla',
    rating: 4.6,
    deliveryTime: 35,
    image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Steamed Chicken Momos', price: 180, description: 'Traditional Himalayan dumplings served with spicy garlic sauce.', isVeg: false },
      { name: 'Thukpa', price: 220, description: 'Hearty Tibetan noodle soup with vegetables and herbs.', isVeg: true },
      { name: 'Hot Chocolate', price: 160, description: 'Rich and thick hot chocolate topped with marshmallows.', isVeg: true }
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

    //  Wipe existing restaurants to avoid duplicates
    console.log('\nWiping existing restaurants...');
    await Restaurant.deleteMany({});
    console.log('Cleared existing restaurants.');

    //  Insert new mock data
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
