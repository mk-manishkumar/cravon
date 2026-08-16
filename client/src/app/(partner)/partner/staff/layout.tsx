import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cravon | Staff Members",
  description: "Manage your staff members and their permissions across all your restaurants.",
};

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
