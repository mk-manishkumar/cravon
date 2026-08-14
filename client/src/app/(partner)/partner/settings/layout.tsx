import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cravon | Account Settings",
};

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
