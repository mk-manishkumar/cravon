import { Metadata } from "next";
import OrdersClient from "./OrdersClient";

export const metadata: Metadata = {
  title: "My Orders | Cravon",
  description: "View all your past and current orders.",
};

export default function OrdersPage() {
  return <OrdersClient />;
}
