export interface OrderItem {
  _id?: string;
  id?: string;
  name: string;
  price: number;
  quantity: number;
}

export interface DriverInfo {
  firstName: string;
  phone?: string;
  vehicleDetails?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface RestaurantInfo {
  name: string;
  image?: string;
  location?: {
    coordinates: [number, number]; // GeoJSON [lng, lat]
  };
}

export interface TrackingOrder {
  _id: string;
  orderStatus: "pending" | "preparing" | "out_for_delivery" | "delivered" | "cancelled";
  paymentStatus: string;
  paymentMethod: string;
  grandTotal: number;
  createdAt: string;
  acceptedAt?: string;
  items: OrderItem[];
  driver?: DriverInfo;
  restaurant?: RestaurantInfo;
}
