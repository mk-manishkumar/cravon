import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  menuItemId: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  restaurant: mongoose.Types.ObjectId;
  items: IOrderItem[];
  
  // Financials
  itemTotal: number;
  deliveryFee: number;
  taxes: number;
  grandTotal: number;
  
  // Delivery
  deliveryAddress: {
    street: string;
    city: string;
    state?: string;
    zipCode?: string;
  };
  deliveryInstructions?: string;
  
  // Statuses
  orderStatus: 'pending' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  
  // Razorpay Data
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;

  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema({
  menuItemId: { type: Schema.Types.ObjectId, ref: 'Restaurant.menu', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 }
});

const OrderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  restaurant: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  items: [OrderItemSchema],
  
  itemTotal: { type: Number, required: true },
  deliveryFee: { type: Number, required: true },
  taxes: { type: Number, required: true },
  grandTotal: { type: Number, required: true },
  
  deliveryAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String },
    zipCode: { type: String }
  },
  deliveryInstructions: { type: String },
  
  orderStatus: { 
    type: String, 
    enum: ['pending', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'], 
    default: 'pending' 
  },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'failed', 'refunded'], 
    default: 'pending' 
  },
  
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String }

}, { timestamps: true });

export default mongoose.model<IOrder>('Order', OrderSchema);
