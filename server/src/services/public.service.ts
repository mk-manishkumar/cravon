import Restaurant from "../models/restaurant.model.js";

// Get all active onboarded restaurants for public listing
export const getActiveRestaurantsService = async (city?: string) => {
  const filter: any = { status: "active", isOnboarded: true };

  if (city && typeof city === "string" && city !== "Select City") {
    filter.address = { $regex: new RegExp(city, "i") };
  }

  return await Restaurant.find(filter).select("-menu").sort("-createdAt");
};

// Get a single restaurant by ID with its full menu
export const getRestaurantByIdService = async (id: string) => {
  const restaurant = await Restaurant.findOne({
    _id: id,
    status: "active",
    isOnboarded: true,
  });

  if (!restaurant) throw new Error("Restaurant not found or is currently inactive");

  return restaurant;
};

// Explore food items across all active restaurants
export const exploreFoodsService = async (filter?: string) => {
  const matchStage: any = {
    status: "active",
    isOnboarded: true,
  };

  if (filter === "franchise") matchStage.franchiseName = { $exists: true, $ne: "" };

  let menuMatches: any[] = [];

  if (filter === "veg") menuMatches = [{ $match: { "menu.isVeg": true } }];
  else if (filter === "nonveg") menuMatches = [{ $match: { "menu.isVeg": false } }];

  const pipeline: any[] = [
    { $match: matchStage },
    { $unwind: "$menu" },
    ...menuMatches,
    { $sample: { size: 15 } },
    {
      $project: {
        _id: "$menu._id",
        name: "$menu.name",
        price: "$menu.price",
        description: "$menu.description",
        isVeg: "$menu.isVeg",
        image: "$menu.image",
        restaurantId: "$_id",
        restaurantName: "$name",
        deliveryTime: "$deliveryTime",
      },
    },
  ];

  return await Restaurant.aggregate(pipeline);
};
