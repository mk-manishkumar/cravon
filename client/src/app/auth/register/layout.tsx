import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cravon | Customer Register",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
