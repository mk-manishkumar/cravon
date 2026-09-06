import { Metadata } from "next";
import AccountClient from "./AccountClient";

export const metadata: Metadata = {
  title: "Account Settings | Cravon",
  description: "Manage your personal information, security preferences, and delivery addresses.",
};

export default function AccountPage() {
  return <AccountClient />;
}
