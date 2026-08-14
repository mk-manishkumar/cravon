import api from "../lib/axios";

export const paymentService = {
  createOrder: async (tierId: string) => {
    const response = await api.post("/payments/create-order", { tierId });
    return response.data;
  },

  verifyPayment: async (data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    tierId: string;
  }) => {
    const response = await api.post("/payments/verify", data);
    return response.data;
  },
};
