import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cravon | Restaurant Orders",
  description: "Manage incoming restaurant orders and live status updates.",
};

export default function RestaurantOrdersLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
