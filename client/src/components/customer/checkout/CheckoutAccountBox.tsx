import { User, CheckCircle2 } from "lucide-react";
import { User as AuthUser } from "@/store/authStore";

interface CheckoutAccountBoxProps {
  user: AuthUser | null;
}

export default function CheckoutAccountBox({ user }: Readonly<CheckoutAccountBoxProps>) {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4">
      <div className="bg-black text-white p-2 rounded flex items-center justify-center">
        <User className="w-6 h-6" />
      </div>
      <div>
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          Logged in <CheckCircle2 className="w-5 h-5 text-green-500" />
        </h2>
        <p className="text-gray-600 font-medium">
          {user?.firstName} {user?.lastName} | {user?.phone || user?.email}
        </p>
      </div>
    </div>
  );
}
