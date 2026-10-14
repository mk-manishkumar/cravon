import { Metadata } from "next";
import OrderTrackingClient from "./OrderTrackingClient";

export const metadata: Metadata = {
  title: "Live Order Tracking | Cravon",
  description: "Track your food delivery live on the map in real time.",
};

export default function OrderTrackingPage() {
  return <OrderTrackingClient />;
}
