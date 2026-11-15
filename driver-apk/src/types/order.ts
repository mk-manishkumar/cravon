export interface OrderRestaurant {
  name?: string;
  address?: string;
  image?: string;
  phone?: string;
  location?: {
    coordinates?: [number, number]; // [lng, lat]
  };
}

export interface OrderUser {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface DeliveryOrderItem {
  _id?: string;
  name: string;
  price: number;
  quantity: number;
}

export interface DeliveryOrder {
  _id: string;
  orderStatus: "pending" | "preparing" | "ready" | "out_for_delivery" | "delivered" | "cancelled";
  paymentStatus: string;
  paymentMethod: string;
  grandTotal: number;
  driver?: string;
  restaurant?: OrderRestaurant;
  user?: OrderUser;
  deliveryAddress?: {
    street?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
  };
  items?: DeliveryOrderItem[];
  createdAt: string;
}
