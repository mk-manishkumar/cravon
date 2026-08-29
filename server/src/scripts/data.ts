export const MOCK_RESTAURANTS = [
  // ---------------- DELHI ----------------
  {
    name: 'Bukhara',
    description: 'Famous North Indian cuisine in the heart of Delhi.',
    address: 'Main Market, Delhi',
    rating: 4.6,
    deliveryTime: 38,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Dal Bukhara', price: 403, description: 'Signature North Indian dish.', isVeg: false, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 448, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 73, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Indian Accent',
    description: 'Famous Modern Indian cuisine in the heart of Delhi.',
    address: 'Main Market, Delhi',
    rating: 4.8,
    deliveryTime: 43,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Blue Cheese Naan', price: 225, description: 'Signature Modern Indian dish.', isVeg: false, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 395, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 104, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Karims',
    description: 'Famous Mughlai cuisine in the heart of Delhi.',
    address: 'Main Market, Delhi',
    rating: 4.9,
    deliveryTime: 22,
    image: 'https://images.unsplash.com/photo-1605807646983-377bc5a76493?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Mutton Nihari', price: 288, description: 'Signature Mughlai dish.', isVeg: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 483, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 53, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Moti Mahal',
    description: 'Famous North Indian cuisine in the heart of Delhi.',
    address: 'Main Market, Delhi',
    rating: 4.7,
    deliveryTime: 32,
    image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Butter Chicken', price: 153, description: 'Signature North Indian dish.', isVeg: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 434, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 144, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Saravana Bhavan',
    description: 'Famous South Indian cuisine in the heart of Delhi.',
    address: 'Main Market, Delhi',
    rating: 4.1,
    deliveryTime: 32,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Masala Dosa', price: 182, description: 'Signature South Indian dish.', isVeg: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 373, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 85, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'The Big Chill Cafe',
    description: 'Famous Italian cuisine in the heart of Delhi.',
    address: 'Main Market, Delhi',
    rating: 4.7,
    deliveryTime: 27,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Penne Vodka', price: 284, description: 'Signature Italian dish.', isVeg: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 233, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 54, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Parikrama',
    description: 'Famous North Indian cuisine in the heart of Delhi.',
    address: 'Main Market, Delhi',
    rating: 4.5,
    deliveryTime: 22,
    image: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Paneer Tikka', price: 434, description: 'Signature North Indian dish.', isVeg: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 408, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 119, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Rajinder Da Dhaba',
    description: 'Famous North Indian cuisine in the heart of Delhi.',
    address: 'Main Market, Delhi',
    rating: 4.1,
    deliveryTime: 42,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Chicken Curry', price: 406, description: 'Signature North Indian dish.', isVeg: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 410, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 130, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  // ---------------- GURGAON ----------------
  {
    name: 'Cyber Hub Social',
    description: 'Famous Continental cuisine in the heart of Gurgaon.',
    address: 'Main Market, Gurgaon',
    rating: 4.0,
    deliveryTime: 48,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Fully Loaded Nachos', price: 238, description: 'Signature Continental dish.', isVeg: false, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 307, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 110, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Farzi Cafe',
    description: 'Famous Modern Indian cuisine in the heart of Gurgaon.',
    address: 'Main Market, Gurgaon',
    rating: 4.0,
    deliveryTime: 48,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Dal Chawal Arancini', price: 231, description: 'Signature Modern Indian dish.', isVeg: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 442, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 137, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Burma Burma',
    description: 'Famous Asian cuisine in the heart of Gurgaon.',
    address: 'Main Market, Gurgaon',
    rating: 4.6,
    deliveryTime: 20,
    image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Khao Suey', price: 326, description: 'Signature Asian dish.', isVeg: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 335, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 108, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Comorin',
    description: 'Famous Indian cuisine in the heart of Gurgaon.',
    address: 'Main Market, Gurgaon',
    rating: 4.9,
    deliveryTime: 43,
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Sweet Corn Khichdi', price: 157, description: 'Signature Indian dish.', isVeg: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 249, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 145, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Prego',
    description: 'Famous Italian cuisine in the heart of Gurgaon.',
    address: 'Main Market, Gurgaon',
    rating: 4.3,
    deliveryTime: 34,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Wood Fired Pizza', price: 415, description: 'Signature Italian dish.', isVeg: false, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 467, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 62, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Threesixtyone',
    description: 'Famous Asian cuisine in the heart of Gurgaon.',
    address: 'Main Market, Gurgaon',
    rating: 4.2,
    deliveryTime: 31,
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Sushi Platter', price: 294, description: 'Signature Asian dish.', isVeg: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 358, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 115, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Carnatic Cafe',
    description: 'Famous South Indian cuisine in the heart of Gurgaon.',
    address: 'Main Market, Gurgaon',
    rating: 4.7,
    deliveryTime: 33,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Malleshwaram 18th Cross Dosa', price: 411, description: 'Signature South Indian dish.', isVeg: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 269, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 68, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Manhattan Bar Exchange',
    description: 'Famous Continental cuisine in the heart of Gurgaon.',
    address: 'Main Market, Gurgaon',
    rating: 4.9,
    deliveryTime: 36,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Chicken Wings', price: 247, description: 'Signature Continental dish.', isVeg: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 469, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 61, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  // ---------------- NOIDA ----------------
  {
    name: 'The Yellow Chilli',
    description: 'Famous North Indian cuisine in the heart of Noida.',
    address: 'Main Market, Noida',
    rating: 4.1,
    deliveryTime: 33,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Shaam Savera', price: 322, description: 'Signature North Indian dish.', isVeg: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 412, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 50, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Desi Vibes',
    description: 'Famous Mughlai cuisine in the heart of Noida.',
    address: 'Main Market, Noida',
    rating: 4.4,
    deliveryTime: 37,
    image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Zaafrani Kofta', price: 268, description: 'Signature Mughlai dish.', isVeg: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 342, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 137, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Time Machine',
    description: 'Famous Continental cuisine in the heart of Noida.',
    address: 'Main Market, Noida',
    rating: 4.9,
    deliveryTime: 41,
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Peri Peri Chicken', price: 239, description: 'Signature Continental dish.', isVeg: false, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 344, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 67, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'I Sacked Newton',
    description: 'Famous European cuisine in the heart of Noida.',
    address: 'Main Market, Noida',
    rating: 4.7,
    deliveryTime: 49,
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Fish and Chips', price: 352, description: 'Signature European dish.', isVeg: false, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 454, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 82, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Barbeque Nation',
    description: 'Famous BBQ cuisine in the heart of Noida.',
    address: 'Main Market, Noida',
    rating: 4.9,
    deliveryTime: 24,
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Grilled Prawns', price: 200, description: 'Signature BBQ dish.', isVeg: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 311, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 116, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Filmy Flavours',
    description: 'Famous North Indian cuisine in the heart of Noida.',
    address: 'Main Market, Noida',
    rating: 4.6,
    deliveryTime: 39,
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Dal Makhani', price: 315, description: 'Signature North Indian dish.', isVeg: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 236, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 128, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Imperfecto',
    description: 'Famous Mediterranean cuisine in the heart of Noida.',
    address: 'Main Market, Noida',
    rating: 4.8,
    deliveryTime: 49,
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Mezze Platter', price: 310, description: 'Signature Mediterranean dish.', isVeg: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 383, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 70, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Walk In The Woods',
    description: 'Famous Chinese cuisine in the heart of Noida.',
    address: 'Main Market, Noida',
    rating: 4.1,
    deliveryTime: 30,
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Hakka Noodles', price: 281, description: 'Signature Chinese dish.', isVeg: false, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 201, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 100, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  // ---------------- HYDERABAD ----------------
  {
    name: 'Paradise Biryani',
    description: 'Famous Hyderabadi cuisine in the heart of Hyderabad.',
    address: 'Main Market, Hyderabad',
    rating: 4.4,
    deliveryTime: 27,
    image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Mutton Biryani', price: 239, description: 'Signature Hyderabadi dish.', isVeg: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 251, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 71, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Bawarchi',
    description: 'Famous Hyderabadi cuisine in the heart of Hyderabad.',
    address: 'Main Market, Hyderabad',
    rating: 4.9,
    deliveryTime: 43,
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Chicken Biryani', price: 427, description: 'Signature Hyderabadi dish.', isVeg: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 371, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 132, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Cafe Bahar',
    description: 'Famous Hyderabadi cuisine in the heart of Hyderabad.',
    address: 'Main Market, Hyderabad',
    rating: 4.3,
    deliveryTime: 24,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Bahar Special Biryani', price: 210, description: 'Signature Hyderabadi dish.', isVeg: false, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 350, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 104, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Chutneys',
    description: 'Famous South Indian cuisine in the heart of Hyderabad.',
    address: 'Main Market, Hyderabad',
    rating: 4.4,
    deliveryTime: 30,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Babai Idli', price: 200, description: 'Signature South Indian dish.', isVeg: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 385, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 54, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Olive Bistro',
    description: 'Famous Italian cuisine in the heart of Hyderabad.',
    address: 'Main Market, Hyderabad',
    rating: 5.0,
    deliveryTime: 49,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Margherita Pizza', price: 368, description: 'Signature Italian dish.', isVeg: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 221, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 145, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Jewel of Nizam',
    description: 'Famous Mughlai cuisine in the heart of Hyderabad.',
    address: 'Main Market, Hyderabad',
    rating: 4.7,
    deliveryTime: 32,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Nizami Handi', price: 359, description: 'Signature Mughlai dish.', isVeg: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 233, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 99, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Shah Ghouse',
    description: 'Famous Hyderabadi cuisine in the heart of Hyderabad.',
    address: 'Main Market, Hyderabad',
    rating: 4.1,
    deliveryTime: 37,
    image: 'https://images.unsplash.com/photo-1605807646983-377bc5a76493?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Haleem', price: 332, description: 'Signature Hyderabadi dish.', isVeg: false, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 278, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 92, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Concu',
    description: 'Famous Desserts cuisine in the heart of Hyderabad.',
    address: 'Main Market, Hyderabad',
    rating: 4.0,
    deliveryTime: 45,
    image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Macarons', price: 309, description: 'Signature Desserts dish.', isVeg: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 232, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 124, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  // ---------------- BANGALORE ----------------
  {
    name: 'Vidyarthi Bhavan',
    description: 'Famous South Indian cuisine in the heart of Bangalore.',
    address: 'Main Market, Bangalore',
    rating: 4.9,
    deliveryTime: 40,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Benne Masala Dosa', price: 152, description: 'Signature South Indian dish.', isVeg: false, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 359, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 58, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Truffles',
    description: 'Famous Fast Food cuisine in the heart of Bangalore.',
    address: 'Main Market, Bangalore',
    rating: 4.6,
    deliveryTime: 47,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'All American Cheese Burger', price: 176, description: 'Signature Fast Food dish.', isVeg: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 401, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 90, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Toit',
    description: 'Famous Continental cuisine in the heart of Bangalore.',
    address: 'Main Market, Bangalore',
    rating: 4.7,
    deliveryTime: 41,
    image: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Wood Fired Pizza', price: 176, description: 'Signature Continental dish.', isVeg: false, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 497, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 127, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'CTR (Shri Sagar)',
    description: 'Famous South Indian cuisine in the heart of Bangalore.',
    address: 'Main Market, Bangalore',
    rating: 4.2,
    deliveryTime: 38,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Benne Dosa', price: 225, description: 'Signature South Indian dish.', isVeg: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 288, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 60, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Meghana Foods',
    description: 'Famous Andhra cuisine in the heart of Bangalore.',
    address: 'Main Market, Bangalore',
    rating: 4.0,
    deliveryTime: 36,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Chicken Boneless Biryani', price: 225, description: 'Signature Andhra dish.', isVeg: false, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 395, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 76, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'MTR',
    description: 'Famous South Indian cuisine in the heart of Bangalore.',
    address: 'Main Market, Bangalore',
    rating: 4.7,
    deliveryTime: 25,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Rava Idli', price: 155, description: 'Signature South Indian dish.', isVeg: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 334, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 94, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Karavalli',
    description: 'Famous Coastal cuisine in the heart of Bangalore.',
    address: 'Main Market, Bangalore',
    rating: 4.3,
    deliveryTime: 22,
    image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Neer Dosa with Fish Curry', price: 180, description: 'Signature Coastal dish.', isVeg: false, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 317, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 141, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'The Only Place',
    description: 'Famous Continental cuisine in the heart of Bangalore.',
    address: 'Main Market, Bangalore',
    rating: 4.0,
    deliveryTime: 37,
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Beef Steak', price: 151, description: 'Signature Continental dish.', isVeg: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 437, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 126, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  // ---------------- PATNA ----------------
  {
    name: 'Bansi Vihar',
    description: 'Famous South Indian cuisine in the heart of Patna.',
    address: 'Main Market, Patna',
    rating: 4.9,
    deliveryTime: 45,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Masala Dosa', price: 156, description: 'Signature South Indian dish.', isVeg: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 374, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 71, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Pind Balluchi',
    description: 'Famous North Indian cuisine in the heart of Patna.',
    address: 'Main Market, Patna',
    rating: 4.7,
    deliveryTime: 46,
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Dal Baluchi', price: 341, description: 'Signature North Indian dish.', isVeg: false, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 277, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 114, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Patna Kitchen',
    description: 'Famous Bihari cuisine in the heart of Patna.',
    address: 'Main Market, Patna',
    rating: 4.8,
    deliveryTime: 21,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Litti Chokha', price: 315, description: 'Signature Bihari dish.', isVeg: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 373, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 57, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Kapil Devs Elevens',
    description: 'Famous North Indian cuisine in the heart of Patna.',
    address: 'Main Market, Patna',
    rating: 4.2,
    deliveryTime: 37,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Paneer Butter Masala', price: 219, description: 'Signature North Indian dish.', isVeg: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 379, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 66, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: '17 Degrees',
    description: 'Famous Continental cuisine in the heart of Patna.',
    address: 'Main Market, Patna',
    rating: 4.1,
    deliveryTime: 32,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Grilled Chicken', price: 233, description: 'Signature Continental dish.', isVeg: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 303, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 52, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Moti Mahal Delux',
    description: 'Famous Mughlai cuisine in the heart of Patna.',
    address: 'Main Market, Patna',
    rating: 4.5,
    deliveryTime: 45,
    image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Butter Chicken', price: 220, description: 'Signature Mughlai dish.', isVeg: false, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 423, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 123, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Haldirams',
    description: 'Famous Street Food cuisine in the heart of Patna.',
    address: 'Main Market, Patna',
    rating: 4.4,
    deliveryTime: 42,
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Raj Kachori', price: 281, description: 'Signature Street Food dish.', isVeg: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 380, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 57, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'The Yellow Chilli',
    description: 'Famous North Indian cuisine in the heart of Patna.',
    address: 'Main Market, Patna',
    rating: 4.8,
    deliveryTime: 40,
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Lalla Mussa Dal', price: 308, description: 'Signature North Indian dish.', isVeg: false, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 264, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 91, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  // ---------------- MUMBAI ----------------
  {
    name: 'Leopold Cafe',
    description: 'Famous Continental cuisine in the heart of Mumbai.',
    address: 'Main Market, Mumbai',
    rating: 4.3,
    deliveryTime: 34,
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Chicken Stroganoff', price: 190, description: 'Signature Continental dish.', isVeg: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 287, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 136, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Britannia & Co',
    description: 'Famous Parsi cuisine in the heart of Mumbai.',
    address: 'Main Market, Mumbai',
    rating: 4.9,
    deliveryTime: 41,
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Berry Pulao', price: 295, description: 'Signature Parsi dish.', isVeg: false, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 288, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 129, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Bademiya',
    description: 'Famous Mughlai cuisine in the heart of Mumbai.',
    address: 'Main Market, Mumbai',
    rating: 4.5,
    deliveryTime: 24,
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Seekh Kebab', price: 420, description: 'Signature Mughlai dish.', isVeg: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 347, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 124, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Gajalee',
    description: 'Famous Seafood cuisine in the heart of Mumbai.',
    address: 'Main Market, Mumbai',
    rating: 4.0,
    deliveryTime: 41,
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Bombil Fry', price: 418, description: 'Signature Seafood dish.', isVeg: false, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 221, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 112, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Trishna',
    description: 'Famous Seafood cuisine in the heart of Mumbai.',
    address: 'Main Market, Mumbai',
    rating: 4.2,
    deliveryTime: 49,
    image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Butter Garlic Crab', price: 447, description: 'Signature Seafood dish.', isVeg: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 280, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 129, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Mahesh Lunch Home',
    description: 'Famous Mangalorean cuisine in the heart of Mumbai.',
    address: 'Main Market, Mumbai',
    rating: 4.1,
    deliveryTime: 46,
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Neer Dosa', price: 344, description: 'Signature Mangalorean dish.', isVeg: false, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 312, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 83, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Cafe Mondegar',
    description: 'Famous Continental cuisine in the heart of Mumbai.',
    address: 'Main Market, Mumbai',
    rating: 5.0,
    deliveryTime: 31,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Beef Chilli', price: 347, description: 'Signature Continental dish.', isVeg: false, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 479, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 126, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'The Bombay Canteen',
    description: 'Famous Modern Indian cuisine in the heart of Mumbai.',
    address: 'Main Market, Mumbai',
    rating: 4.2,
    deliveryTime: 40,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Keema Pav', price: 218, description: 'Signature Modern Indian dish.', isVeg: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 429, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 114, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  // ---------------- PUNE ----------------
  {
    name: 'Vaishali',
    description: 'Famous South Indian cuisine in the heart of Pune.',
    address: 'Main Market, Pune',
    rating: 4.7,
    deliveryTime: 32,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Mysore Masala Dosa', price: 389, description: 'Signature South Indian dish.', isVeg: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 216, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 53, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Kayani Bakery',
    description: 'Famous Bakery cuisine in the heart of Pune.',
    address: 'Main Market, Pune',
    rating: 4.8,
    deliveryTime: 20,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Shrewsbury Biscuits', price: 160, description: 'Signature Bakery dish.', isVeg: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 418, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 125, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'German Bakery',
    description: 'Famous Cafe cuisine in the heart of Pune.',
    address: 'Main Market, Pune',
    rating: 4.8,
    deliveryTime: 27,
    image: 'https://images.unsplash.com/photo-1605807646983-377bc5a76493?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Red Velvet Cake', price: 398, description: 'Signature Cafe dish.', isVeg: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 212, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 54, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Shabree',
    description: 'Famous Maharashtrian cuisine in the heart of Pune.',
    address: 'Main Market, Pune',
    rating: 4.5,
    deliveryTime: 47,
    image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Puran Poli Thali', price: 417, description: 'Signature Maharashtrian dish.', isVeg: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 379, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 60, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Goodluck Cafe',
    description: 'Famous Irani cuisine in the heart of Pune.',
    address: 'Main Market, Pune',
    rating: 4.2,
    deliveryTime: 43,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Bun Maska', price: 444, description: 'Signature Irani dish.', isVeg: false, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 225, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 148, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Malaka Spice',
    description: 'Famous Pan Asian cuisine in the heart of Pune.',
    address: 'Main Market, Pune',
    rating: 4.1,
    deliveryTime: 43,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Thai Green Curry', price: 342, description: 'Signature Pan Asian dish.', isVeg: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 357, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 116, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Vohuman Cafe',
    description: 'Famous Irani cuisine in the heart of Pune.',
    address: 'Main Market, Pune',
    rating: 4.5,
    deliveryTime: 41,
    image: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Cheese Omelette', price: 270, description: 'Signature Irani dish.', isVeg: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 420, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 67, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Blue Nile',
    description: 'Famous Mughlai cuisine in the heart of Pune.',
    address: 'Main Market, Pune',
    rating: 4.6,
    deliveryTime: 43,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Chicken Biryani', price: 161, description: 'Signature Mughlai dish.', isVeg: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 289, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 129, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  // ---------------- KOLKATA ----------------
  {
    name: 'Peter Cat',
    description: 'Famous Continental cuisine in the heart of Kolkata.',
    address: 'Main Market, Kolkata',
    rating: 4.9,
    deliveryTime: 28,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Chelo Kebab', price: 397, description: 'Signature Continental dish.', isVeg: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 356, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 132, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Arsalan',
    description: 'Famous Mughlai cuisine in the heart of Kolkata.',
    address: 'Main Market, Kolkata',
    rating: 4.8,
    deliveryTime: 36,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Mutton Biryani', price: 419, description: 'Signature Mughlai dish.', isVeg: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 427, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 115, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Flurys',
    description: 'Famous Bakery cuisine in the heart of Kolkata.',
    address: 'Main Market, Kolkata',
    rating: 4.4,
    deliveryTime: 26,
    image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Rum Ball', price: 344, description: 'Signature Bakery dish.', isVeg: false, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 320, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 112, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Mocambo',
    description: 'Famous Continental cuisine in the heart of Kolkata.',
    address: 'Main Market, Kolkata',
    rating: 4.3,
    deliveryTime: 30,
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Deviled Crab', price: 307, description: 'Signature Continental dish.', isVeg: false, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 312, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 55, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: '6 Ballygunge Place',
    description: 'Famous Bengali cuisine in the heart of Kolkata.',
    address: 'Main Market, Kolkata',
    rating: 4.4,
    deliveryTime: 26,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Dab Chingri', price: 163, description: 'Signature Bengali dish.', isVeg: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 377, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 77, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Oh! Calcutta',
    description: 'Famous Bengali cuisine in the heart of Kolkata.',
    address: 'Main Market, Kolkata',
    rating: 4.1,
    deliveryTime: 27,
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Kosha Mangsho', price: 434, description: 'Signature Bengali dish.', isVeg: false, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 276, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 94, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Kusum Rolls',
    description: 'Famous Street Food cuisine in the heart of Kolkata.',
    address: 'Main Market, Kolkata',
    rating: 4.9,
    deliveryTime: 43,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Kathi Roll', price: 328, description: 'Signature Street Food dish.', isVeg: false, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 437, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 107, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Aminia',
    description: 'Famous Awadhi cuisine in the heart of Kolkata.',
    address: 'Main Market, Kolkata',
    rating: 4.0,
    deliveryTime: 30,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Mutton Awadhi Biryani', price: 327, description: 'Signature Awadhi dish.', isVeg: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 399, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 79, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  // ---------------- JAIPUR ----------------
  {
    name: 'Chokhi Dhani',
    description: 'Famous Rajasthani cuisine in the heart of Jaipur.',
    address: 'Main Market, Jaipur',
    rating: 5.0,
    deliveryTime: 47,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Dal Bati Churma', price: 375, description: 'Signature Rajasthani dish.', isVeg: false, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 401, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 148, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Rawat Mishtan Bhandar',
    description: 'Famous Street Food cuisine in the heart of Jaipur.',
    address: 'Main Market, Jaipur',
    rating: 4.1,
    deliveryTime: 20,
    image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Pyaaz Kachori', price: 385, description: 'Signature Street Food dish.', isVeg: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 473, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 63, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Suvarna Mahal',
    description: 'Famous Royal Indian cuisine in the heart of Jaipur.',
    address: 'Main Market, Jaipur',
    rating: 4.4,
    deliveryTime: 25,
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Laal Maas', price: 446, description: 'Signature Royal Indian dish.', isVeg: false, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 420, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 141, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Laxmi Mishthan Bhandar (LMB)',
    description: 'Famous Rajasthani cuisine in the heart of Jaipur.',
    address: 'Main Market, Jaipur',
    rating: 4.4,
    deliveryTime: 35,
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Ghewar', price: 205, description: 'Signature Rajasthani dish.', isVeg: false, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 353, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 114, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Tapri The Tea House',
    description: 'Famous Cafe cuisine in the heart of Jaipur.',
    address: 'Main Market, Jaipur',
    rating: 4.7,
    deliveryTime: 36,
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Sauteed Mushrooms', price: 186, description: 'Signature Cafe dish.', isVeg: false, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 457, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 71, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: '1135 AD',
    description: 'Famous Mughlai cuisine in the heart of Jaipur.',
    address: 'Main Market, Jaipur',
    rating: 4.1,
    deliveryTime: 47,
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Junglee Maas', price: 227, description: 'Signature Mughlai dish.', isVeg: false, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 394, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 68, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Spice Court',
    description: 'Famous North Indian cuisine in the heart of Jaipur.',
    address: 'Main Market, Jaipur',
    rating: 4.2,
    deliveryTime: 34,
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Keema Bati', price: 264, description: 'Signature North Indian dish.', isVeg: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 212, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 113, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Niros',
    description: 'Famous North Indian cuisine in the heart of Jaipur.',
    address: 'Main Market, Jaipur',
    rating: 4.1,
    deliveryTime: 35,
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Chicken Tikka Masala', price: 372, description: 'Signature North Indian dish.', isVeg: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 353, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 116, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  // ---------------- RISHIKESH ----------------
  {
    name: 'Chotiwala',
    description: 'Famous North Indian cuisine in the heart of Rishikesh.',
    address: 'Main Market, Rishikesh',
    rating: 4.3,
    deliveryTime: 25,
    image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Chotiwala Thali', price: 279, description: 'Signature North Indian dish.', isVeg: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 489, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 85, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Little Buddha Cafe',
    description: 'Famous Cafe cuisine in the heart of Rishikesh.',
    address: 'Main Market, Rishikesh',
    rating: 4.7,
    deliveryTime: 30,
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Veggie Pizza', price: 267, description: 'Signature Cafe dish.', isVeg: false, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 471, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 116, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'The Sitting Elephant',
    description: 'Famous North Indian cuisine in the heart of Rishikesh.',
    address: 'Main Market, Rishikesh',
    rating: 4.9,
    deliveryTime: 45,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Paneer Makhani', price: 413, description: 'Signature North Indian dish.', isVeg: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 220, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 107, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Freedom Cafe',
    description: 'Famous Continental cuisine in the heart of Rishikesh.',
    address: 'Main Market, Rishikesh',
    rating: 4.3,
    deliveryTime: 29,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Banana Pancakes', price: 292, description: 'Signature Continental dish.', isVeg: false, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 342, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 112, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Tat Cafe',
    description: 'Famous Cafe cuisine in the heart of Rishikesh.',
    address: 'Main Market, Rishikesh',
    rating: 4.8,
    deliveryTime: 40,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Vegan Burger', price: 301, description: 'Signature Cafe dish.', isVeg: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 315, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 78, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Pure Soul Cafe',
    description: 'Famous Healthy cuisine in the heart of Rishikesh.',
    address: 'Main Market, Rishikesh',
    rating: 4.1,
    deliveryTime: 26,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Quinoa Bowl', price: 440, description: 'Signature Healthy dish.', isVeg: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 213, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 103, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Ganga Beach Cafe',
    description: 'Famous Continental cuisine in the heart of Rishikesh.',
    address: 'Main Market, Rishikesh',
    rating: 4.2,
    deliveryTime: 34,
    image: 'https://images.unsplash.com/photo-1605807646983-377bc5a76493?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Pasta Alfredo', price: 234, description: 'Signature Continental dish.', isVeg: false, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 398, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 75, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Oasis Restaurant',
    description: 'Famous Indian cuisine in the heart of Rishikesh.',
    address: 'Main Market, Rishikesh',
    rating: 4.1,
    deliveryTime: 20,
    image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Aloo Gobi', price: 435, description: 'Signature Indian dish.', isVeg: false, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 392, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 139, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  // ---------------- SHIMLA ----------------
  {
    name: 'Cafe Simla Times',
    description: 'Famous Cafe cuisine in the heart of Shimla.',
    address: 'Main Market, Shimla',
    rating: 5.0,
    deliveryTime: 34,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Wood Fired Pizza', price: 430, description: 'Signature Cafe dish.', isVeg: false, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 215, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 69, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Wake & Bake',
    description: 'Famous Cafe cuisine in the heart of Shimla.',
    address: 'Main Market, Shimla',
    rating: 4.4,
    deliveryTime: 48,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'French Crepes', price: 215, description: 'Signature Cafe dish.', isVeg: false, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 386, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 102, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Hide Out Cafe',
    description: 'Famous Fast Food cuisine in the heart of Shimla.',
    address: 'Main Market, Shimla',
    rating: 4.8,
    deliveryTime: 38,
    image: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Chicken Burgers', price: 201, description: 'Signature Fast Food dish.', isVeg: false, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 423, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 63, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Himachali Rasoi',
    description: 'Famous Himachali cuisine in the heart of Shimla.',
    address: 'Main Market, Shimla',
    rating: 5.0,
    deliveryTime: 30,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Kangri Dham', price: 369, description: 'Signature Himachali dish.', isVeg: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 441, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 54, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Cecil Restaurant',
    description: 'Famous Continental cuisine in the heart of Shimla.',
    address: 'Main Market, Shimla',
    rating: 4.8,
    deliveryTime: 38,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Roast Chicken', price: 412, description: 'Signature Continental dish.', isVeg: false, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 420, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 149, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Eighteen71 Cookhouse',
    description: 'Famous Pan Asian cuisine in the heart of Shimla.',
    address: 'Main Market, Shimla',
    rating: 4.1,
    deliveryTime: 48,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Dim Sums', price: 296, description: 'Signature Pan Asian dish.', isVeg: false, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 428, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 131, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Indian Coffee House',
    description: 'Famous South Indian cuisine in the heart of Shimla.',
    address: 'Main Market, Shimla',
    rating: 4.9,
    deliveryTime: 33,
    image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Filter Coffee', price: 185, description: 'Signature South Indian dish.', isVeg: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 241, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 73, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
  {
    name: 'Goofa Ashiana',
    description: 'Famous North Indian cuisine in the heart of Shimla.',
    address: 'Main Market, Shimla',
    rating: 4.9,
    deliveryTime: 31,
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1500&auto=format&fit=crop',
    status: 'active',
    isOnboarded: true,
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    menu: [
      { name: 'Mutton Curry', price: 170, description: 'Signature North Indian dish.', isVeg: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chef Special', price: 271, description: 'Highly recommended by the chef.', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { name: 'Refreshing Beverage', price: 65, description: 'Cold drink to go with your meal.', isVeg: true }
    ]
  },
];
