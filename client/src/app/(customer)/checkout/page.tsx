import { Metadata } from "next";
import CheckoutClient from "./CheckoutClient";

export const metadata: Metadata = {
  title: "Checkout | Cravon",
  description: "Complete your order securely on Cravon.",
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
