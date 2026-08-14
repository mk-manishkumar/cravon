import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cravon | Partner Hub",
};

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
