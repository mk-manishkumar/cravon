"use client";

import { useAuthStore } from "@/store/authStore";
import { User, Phone, Mail, Edit3 } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { user } = useAuthStore();

  if (!user) return null;

  return (
    <div className="bg-white p-6 sm:p-10 rounded-none sm:rounded-xl shadow-sm border border-gray-100 min-h-125">
      <div className="flex justify-between items-start mb-10">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">My Profile</h2>
          <p className="text-gray-500 text-sm">Personal Information</p>
        </div>
        <Link href="/account" className="flex items-center gap-2 text-sm font-bold text-orange-500 hover:text-orange-600 bg-orange-50 hover:bg-orange-100 px-4 py-2 rounded-lg transition-colors">
          <Edit3 size={16} /> Edit Profile
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <User size={16} />
            <span className="text-xs font-semibold uppercase tracking-widest">Name</span>
          </div>
          <p className="text-lg font-medium text-gray-900 capitalize">
            {user.firstName} {user.lastName}
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <Phone size={16} />
            <span className="text-xs font-semibold uppercase tracking-widest">Phone Number</span>
          </div>
          <p className="text-lg font-medium text-gray-900">{user.phone || "Not provided"}</p>
        </div>

        <div className="space-y-1 md:col-span-2">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <Mail size={16} />
            <span className="text-xs font-semibold uppercase tracking-widest">Email Address</span>
          </div>
          <p className="text-lg font-medium text-gray-900">{user.email}</p>
        </div>
      </div>
    </div>
  );
}
