import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cravon | Pricing & Plans",
};

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
