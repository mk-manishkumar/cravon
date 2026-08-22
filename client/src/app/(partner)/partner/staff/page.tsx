"use client";

import { useState } from "react";
import { Plus, Users, Trash2, Mail, Check, Building2 } from "lucide-react";
import toast from "react-hot-toast";
import { staffService } from "@/services/staff.service";
import { restaurantService } from "@/services/restaurant.service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Restaurant {
  _id: string;
  name: string;
}

interface Staff {
  _id: string;
  role: string;
  status: string;
  permissions: string[];
  userId?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  email: string;
  restaurantId: {
    _id: string;
    name: string;
  };
}

export default function GlobalStaffManagementPage() {
  const queryClient = useQueryClient();

  const [showInviteModal, setShowInviteModal] = useState(false);

  const [inviteForm, setInviteForm] = useState({
    restaurantId: "",
    email: "",
    role: "Staff",
    permissions: [] as string[],
  });

  const PERMISSION_OPTIONS = [
    { id: "edit_price", label: "Change Product Prices" },
    { id: "edit_excel", label: "Edit Menu (Excel)" },
    { id: "manage_orders", label: "Manage Orders" },
  ];

  // Fetch all staff across all restaurants
  const { data: staff = [], isLoading: isLoadingStaff } = useQuery({
    queryKey: ["staff", "all"],
    queryFn: async () => {
      const res = await staffService.getAllStaff();
      return res.staff as Staff[];
    },
  });

  // Fetch all restaurants for the dropdown
  const { data: restaurants = [], isLoading: isLoadingRestaurants } = useQuery({
    queryKey: ["restaurants", "my"],
    queryFn: async () => {
      const res = await restaurantService.getMyRestaurants();
      return res.data as Restaurant[];
    },
  });

  // Invite staff mutation
  const inviteMutation = useMutation({
    mutationFn: async (data: { restaurantId: string; email: string; role: string; permissions: string[] }) => staffService.inviteStaff(data),
    onSuccess: () => {
      toast.success("Invite sent successfully!");
      setShowInviteModal(false);
      setInviteForm({ restaurantId: "", email: "", role: "Staff", permissions: [] });
      queryClient.invalidateQueries({ queryKey: ["staff", "all"] });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || "Failed to send invite");
    },
  });

  // Remove staff mutation
  const removeMutation = useMutation({
    mutationFn: async (staffId: string) => staffService.removeStaff(staffId),
    onSuccess: () => {
      toast.success("Staff removed");
      queryClient.invalidateQueries({ queryKey: ["staff", "all"] });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || "Failed to remove staff");
    },
  });

  const handleInvite = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inviteForm.restaurantId) return toast.error("Please select a restaurant");
    if (!inviteForm.email) return toast.error("Email is required");

    inviteMutation.mutate({
      restaurantId: inviteForm.restaurantId,
      email: inviteForm.email,
      role: inviteForm.role,
      permissions: inviteForm.permissions,
    });
  };

  const handleRemove = (staffId: string) => {
    if (!confirm("Are you sure you want to remove this staff member?")) return;
    removeMutation.mutate(staffId);
  };

  const togglePermission = (permId: string) => {
    setInviteForm((prev) => {
      if (prev.permissions.includes(permId)) {
        return { ...prev, permissions: prev.permissions.filter((p) => p !== permId) };
      }
      return { ...prev, permissions: [...prev.permissions, permId] };
    });
  };

  const isLoading = isLoadingStaff || isLoadingRestaurants;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-[#FF7A30] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const getRoleBadgeClasses = (role: string) => {
    if (role === "Owner") return "bg-[#FF7A30]/20 text-[#FF7A30]";
    return "bg-blue-500/20 text-blue-400";
  };

  return (
    <div className="flex-1 p-8 text-white max-w-7xl mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-75 bg-[#FF7A30]/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col max-[525px]:items-start min-[525px]:flex-row min-[525px]:items-center justify-between gap-4 min-[525px]:gap-0 mb-8 relative z-10">
        <div>
          <h1 className="text-3xl font-bold">Staff Members</h1>
          <p className="text-[#888] mt-1">Manage staff access across all your restaurants.</p>
        </div>

        <button type="button" onClick={() => setShowInviteModal(true)} className="px-6 py-2.5 bg-[#FF7A30] text-white font-bold rounded-xl hover:bg-[#FF7A30]/90 transition-all cursor-pointer shadow-lg shadow-[#FF7A30]/20 flex items-center gap-2">
          <Plus size={18} />
          Invite Staff
        </button>
      </div>

      {/* Staff List */}
      <div className="bg-[#121212]/80 backdrop-blur-md border border-[#2A2A2A] rounded-3xl overflow-hidden shadow-2xl relative z-10">
        {staff.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-24 h-24 bg-linear-to-br from-[#2A2A2A] to-[#1A1A1A] border border-[#333] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Users className="w-10 h-10 text-[#FF7A30]/80" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No Staff Members Yet</h3>
            <p className="text-[#888] max-w-md mx-auto mb-8 text-lg">You haven&apos;t invited any staff members across your restaurants. Add your team to easily manage menus, orders, and more.</p>
            <button type="button" onClick={() => setShowInviteModal(true)} className="bg-[#222] border border-[#333] text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-[#2A2A2A] hover:border-[#444] transition-all flex items-center gap-2 mx-auto cursor-pointer">
              <Plus className="w-5 h-5 text-[#FF7A30]" />
              Invite Your First Staff Member
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#222] bg-[#1a1a1a]">
                  <th className="p-4 text-sm font-semibold text-[#888] uppercase tracking-wider">User</th>
                  <th className="p-4 text-sm font-semibold text-[#888] uppercase tracking-wider">Restaurant</th>
                  <th className="p-4 text-sm font-semibold text-[#888] uppercase tracking-wider">Role</th>
                  <th className="p-4 text-sm font-semibold text-[#888] uppercase tracking-wider">Status</th>
                  <th className="p-4 text-sm font-semibold text-[#888] uppercase tracking-wider">Permissions</th>
                  <th className="p-4 text-right text-sm font-semibold text-[#888] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((member) => (
                  <tr key={member._id} className="border-b border-[#222] hover:bg-[#1a1a1a]/50 transition">
                    <td className="p-4">
                      {member.userId ? (
                        <div>
                          <p className="font-bold">
                            {member.userId.firstName} {member.userId.lastName}
                          </p>
                          <p className="text-sm text-[#888]">{member.userId.email}</p>
                        </div>
                      ) : (
                        <div>
                          <p className="font-bold text-[#888] italic">Pending Registration</p>
                          <p className="text-sm text-[#888]">{member.email}</p>
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-[#ddd]">
                        <Building2 className="w-4 h-4 text-[#888]" />
                        {member.restaurantId?.name || "Unknown"}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${getRoleBadgeClasses(member.role)}`}>{member.role}</span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${member.status === "active" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${member.status === "active" ? "bg-green-400" : "bg-yellow-400"}`}></div>
                        {member.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-2">
                        {member.permissions.length > 0 ? (
                          member.permissions.map((p) => (
                            <span key={p} className="text-xs bg-[#222] text-[#888] px-2 py-1 rounded-md border border-[#333]">
                              {p.replace("_", " ")}
                            </span>
                          ))
                        ) : (
                          <span className="text-[#555] text-sm italic">None</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      {member.role !== "Owner" && (
                        <button type="button" onClick={() => handleRemove(member._id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition cursor-pointer" title="Remove Staff">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#111] rounded-3xl border border-[#222] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-[#222] flex justify-between items-center bg-[#1a1a1a]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FF7A30]/20 flex items-center justify-center text-[#FF7A30]">
                  <Mail className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-white">Invite Staff</h2>
              </div>
            </div>

            <form onSubmit={handleInvite} className="p-6 space-y-6">
              <div>
                <label htmlFor="inviteRestaurant" className="block text-sm font-semibold text-[#888] mb-2">
                  Select Restaurant
                </label>
                <select id="inviteRestaurant" required value={inviteForm.restaurantId} onChange={(e) => setInviteForm({ ...inviteForm, restaurantId: e.target.value })} className="w-full bg-[#222] border border-[#333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF7A30] transition">
                  <option value="" disabled>
                    Choose a restaurant...
                  </option>
                  {restaurants.map((r) => (
                    <option key={r._id} value={r._id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="inviteEmail" className="block text-sm font-semibold text-[#888] mb-2">
                  Email Address
                </label>
                <input id="inviteEmail" type="email" required value={inviteForm.email} onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })} className="w-full bg-[#222] border border-[#333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF7A30] transition" placeholder="employee@example.com" />
              </div>

              <div>
                <div className="block text-sm font-semibold text-[#888] mb-2">Permissions</div>
                <div className="space-y-3 bg-[#1a1a1a] p-4 rounded-xl border border-[#333]">
                  {PERMISSION_OPTIONS.map((opt) => (
                    <label key={opt.id} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="sr-only" checked={inviteForm.permissions.includes(opt.id)} onChange={() => togglePermission(opt.id)} />
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${inviteForm.permissions.includes(opt.id) ? "bg-[#FF7A30] border-[#FF7A30]" : "border-[#444] group-hover:border-[#666]"}`}>{inviteForm.permissions.includes(opt.id) && <Check className="w-3 h-3 text-white" />}</div>
                      <span className="text-sm text-white">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-[#222]">
                <button type="button" onClick={() => setShowInviteModal(false)} className="flex-1 py-3 bg-[#222] hover:bg-[#333] text-white rounded-xl font-bold transition cursor-pointer">
                  Cancel
                </button>
                <button type="submit" disabled={inviteMutation.isPending} className="flex-1 py-3 bg-[#FF7A30] hover:bg-[#FF7A30]/90 text-white rounded-xl font-bold transition disabled:opacity-50 cursor-pointer">
                  {inviteMutation.isPending ? "Sending..." : "Send Invite"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
