import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cravon | Notifications",
  description: "View incoming orders and updates across all your restaurants.",
};

export default function NotificationsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
