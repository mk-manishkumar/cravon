import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cravon | Customer Login",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
