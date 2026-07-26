import PartnerHeader from "@/components/layout/PartnerHeader";
import PartnerFooter from "@/components/layout/PartnerFooter";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function PartnerLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex-1 flex flex-col bg-[#050505]">
      <PartnerHeader />
      <main className="flex-1 flex flex-col w-full">
        <ProtectedRoute redirectTo="/auth/restaurant/login">
          {children}
        </ProtectedRoute>
      </main>
      <PartnerFooter />
    </div>
  );
}
