import CustomerHeader from "@/components/layout/CustomerHeader";
import CustomerFooter from "@/components/layout/CustomerFooter";

export default function CustomerLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <CustomerHeader />
      <main className="flex-1 flex flex-col w-full">
        {children}
      </main>
      <CustomerFooter />
    </>
  );
}
