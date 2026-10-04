import Order from "../models/order.model.js";
import Driver from "../models/driver.model.js";

// Haversine formula to calculate distance between two lat/lon coordinates in kilometers
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

let isRunning = false;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const assignDriverToOrder = (order: any, availableDrivers: any[], newlyAssignedDriverIds: string[]) => {
  const restaurant = order.restaurant;
  if (!restaurant.location?.coordinates) return null;
  
  const [restLon, restLat] = restaurant.location.coordinates;
  let closestDriver = null;
  let minDistance = Infinity;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const driver of availableDrivers) {
    if (newlyAssignedDriverIds.includes(driver._id.toString())) continue; 

    const dist = getDistance(restLat, restLon, driver.location!.latitude, driver.location!.longitude);
    if (dist < minDistance) {
      minDistance = dist;
      closestDriver = driver;
    }
  }

  if (closestDriver && minDistance <= 15) { 
    order.driver = closestDriver._id;
    newlyAssignedDriverIds.push(closestDriver._id.toString());
    console.log(`[Matchmaker] 🍔 Order ${order._id.toString().substring(0, 6)} assigned to Driver ${closestDriver.firstName} (${minDistance.toFixed(1)}km away)`);
    return order.save();
  }
  
  return null;
};

const processMatchmaking = async () => {
  // Find orders that are 'preparing' and have NO driver assigned yet
  const pendingOrders = await Order.find({
    orderStatus: "preparing",
    driver: { $exists: false },
  }).populate("restaurant");

  if (pendingOrders.length === 0) return;

  // Find drivers who are currently busy
  const busyDrivers = await Order.find({ 
    orderStatus: { $in: ["preparing", "out_for_delivery"] }, 
    driver: { $exists: true } 
  }).distinct("driver");

  // Find drivers who are online and NOT busy, and have a GPS location
  const availableDrivers = await Driver.find({
    isAvailable: true,
    _id: { $nin: busyDrivers },
    "location.latitude": { $exists: true },
    "location.longitude": { $exists: true }
  });

  if (availableDrivers.length === 0) return;

  const newlyAssignedDriverIds: string[] = [];
  const savePromises = [];

  for (const order of pendingOrders) {
    const savePromise = assignDriverToOrder(order, availableDrivers, newlyAssignedDriverIds);
    if (savePromise) savePromises.push(savePromise);
  }

  await Promise.all(savePromises);
};

export const startMatchmaker = () => {
  console.log("Matchmaker Engine Started. Polling every 10 seconds...");
  
  setInterval(async () => {
    if (isRunning) return; // Prevent overlapping runs if DB is slow
    isRunning = true;

    try {
      await processMatchmaking();
    } catch (err) {
      console.error("[Matchmaker Error]:", err);
    } finally {
      isRunning = false;
    }
  }, 10000); // run every 10 seconds
};
