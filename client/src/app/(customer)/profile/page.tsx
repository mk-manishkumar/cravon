import { Metadata } from "next";
import ProfileClient from "./ProfileClient";

export const metadata: Metadata = {
  title: "My Profile | Cravon",
  description: "View your personal profile details.",
};

export default function ProfilePage() {
  return <ProfileClient />;
}
