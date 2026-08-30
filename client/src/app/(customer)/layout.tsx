import CustomerHeader from "@/components/layout/CustomerHeader";
import CustomerFooter from "@/components/layout/CustomerFooter";
import { Suspense } from "react";

export default function CustomerLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Suspense fallback={<div className="h-[72px] bg-white border-b border-gray-100" />}>
        <CustomerHeader />
      </Suspense>
      <main className="flex-1 flex flex-col w-full">
        {children}
      </main>
      <CustomerFooter />
    </>
  );
}
