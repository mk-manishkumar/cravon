import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cravon | Partner Dashboard",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
