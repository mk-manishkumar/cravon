import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cravon | Restaurant Menu",
};

export default function Layout({ children }: Readonly<{ readonly children: React.ReactNode }>) {
  return <>{children}</>;
}
