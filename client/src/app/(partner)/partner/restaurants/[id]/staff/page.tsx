"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Plus, Users, Trash2, Mail, Check } from "lucide-react";
import toast from "react-hot-toast";
import { staffService } from "@/services/staff.service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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
}

export default function StaffManagementPage() {
  const { id: restaurantId } = useParams();
  const queryClient = useQueryClient();

  const [showInviteModal, setShowInviteModal] = useState(false);

  const [inviteForm, setInviteForm] = useState({
    email: "",
    role: "Staff",
    permissions: [] as string[],
  });

  const PERMISSION_OPTIONS = [
    { id: "edit_price", label: "Change Product Prices" },
    { id: "edit_excel", label: "Edit Menu (Excel)" },
    { id: "manage_orders", label: "Manage Orders" },
  ];

  // React Query: Fetch staff
  const { data: staff = [], isLoading } = useQuery({
    queryKey: ["staff", restaurantId],
    queryFn: async () => {
      if (!restaurantId) return [];
      const res = await staffService.getStaff(restaurantId as string);
      return res.staff as Staff[];
    },
    enabled: !!restaurantId,
  });

  // Invite staff mutation
  const inviteMutation = useMutation({
    mutationFn: async (data: { restaurantId: string; email: string; role: string; permissions: string[] }) => staffService.inviteStaff(data),
    onSuccess: () => {
      toast.success("Invite sent successfully!");
      setShowInviteModal(false);
      setInviteForm({ email: "", role: "Staff", permissions: [] });
      queryClient.invalidateQueries({ queryKey: ["staff", restaurantId] });
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
      queryClient.invalidateQueries({ queryKey: ["staff", restaurantId] });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || "Failed to remove staff");
    },
  });

  const handleInvite = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inviteForm.email) return toast.error("Email is required");

    inviteMutation.mutate({
      restaurantId: restaurantId as string,
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

  if (isLoading) {
    return (
      <div className="flex-1 p-8 flex justify-center items-center">
        <div className="w-8 h-8 border-2 border-[#FF7A30] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 text-white max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Users className="text-[#FF7A30]" /> Staff Management
          </h1>
          <p className="text-[#888]">Invite and manage employees for this restaurant.</p>
        </div>

        <button type="button" onClick={() => setShowInviteModal(true)} className="bg-[#FF7A30] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#FF7A30]/90 transition flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Invite Staff
        </button>
      </div>

      <div className="bg-[#111] rounded-2xl border border-[#222] overflow-hidden">
        {staff.length === 0 ? (
          <div className="p-12 text-center text-[#888]">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>No staff members found.</p>
            <p className="text-sm mt-2">Click &quot;Invite Staff&quot; to add your team.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#1a1a1a] border-b border-[#333]">
                <tr>
                  <th className="p-4 font-semibold text-[#888]">Staff Member</th>
                  <th className="p-4 font-semibold text-[#888]">Role</th>
                  <th className="p-4 font-semibold text-[#888]">Status</th>
                  <th className="p-4 font-semibold text-[#888]">Permissions</th>
                  <th className="p-4 font-semibold text-[#888] text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((member) => (
                  <tr key={member._id} className="border-b border-[#222] hover:bg-[#151515] transition">
                    <td className="p-4">
                      {member.userId ? (
                        <div>
                          <p className="font-bold">
                            {member.userId.firstName} {member.userId.lastName}
                          </p>
                          <p className="text-sm text-[#888]">{member.email}</p>
                        </div>
                      ) : (
                        <div>
                          <p className="font-bold italic text-[#888]">Pending User</p>
                          <p className="text-sm text-[#888]">{member.email}</p>
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${member.role === "Owner" ? "bg-[#FF7A30]/20 text-[#FF7A30]" : "bg-[#222] text-[#ccc]"}`}>{member.role}</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center w-fit gap-1 ${member.status === "active" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                        {member.status === "active" ? <Check className="w-3 h-3" /> : <Mail className="w-3 h-3" />}
                        {member.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2 flex-wrap">
                        {member.permissions.length > 0 ? (
                          member.permissions.map((p) => (
                            <span key={p} className="px-2 py-1 bg-[#222] border border-[#333] rounded-md text-xs text-[#888]">
                              {PERMISSION_OPTIONS.find((opt) => opt.id === p)?.label || p}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-[#555]">None</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      {member.role !== "Owner" && (
                        <button type="button" onClick={() => handleRemove(member._id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition" title="Remove Staff">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button type="button" className="absolute inset-0 w-full h-full bg-black/80 backdrop-blur-sm cursor-default outline-none" onClick={() => setShowInviteModal(false)} aria-label="Close modal" />
          <div className="relative z-10 w-full max-w-lg bg-[#111] border border-[#333] rounded-3xl p-8 shadow-2xl animate-in zoom-in-95">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Mail className="text-[#FF7A30]" /> Invite Staff
            </h2>

            <form onSubmit={handleInvite} className="space-y-6">
              <div>
                <label htmlFor="inviteEmail" className="block text-sm font-semibold text-[#888] mb-2">
                  Email Address
                </label>
                <input id="inviteEmail" type="email" required value={inviteForm.email} onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })} className="w-full bg-[#222] border border-[#333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF7A30] transition" placeholder="employee@example.com" />
              </div>

              <div>
                <label htmlFor="inviteRole" className="block text-sm font-semibold text-[#888] mb-2">
                  Role
                </label>
                <select id="inviteRole" value={inviteForm.role} onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })} className="w-full bg-[#222] border border-[#333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF7A30] transition">
                  <option value="Staff">Staff</option>
                  <option value="Manager">Manager</option>
                </select>
              </div>

              <div>
                <div className="block text-sm font-semibold text-[#888] mb-2">Permissions</div>
                <div className="space-y-3 bg-[#1a1a1a] p-4 rounded-xl border border-[#333]">
                  {PERMISSION_OPTIONS.map((opt) => (
                    <label key={opt.id} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="sr-only" checked={inviteForm.permissions.includes(opt.id)} onChange={() => togglePermission(opt.id)} />
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${inviteForm.permissions.includes(opt.id) ? "bg-[#FF7A30] border-[#FF7A30]" : "border-[#444] group-hover:border-[#666]"}`}>{inviteForm.permissions.includes(opt.id) && <Check className="w-3 h-3 text-white" />}</div>
                      <span className="text-sm">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-[#333]">
                <button type="button" onClick={() => setShowInviteModal(false)} className="flex-1 py-3 font-bold text-[#888] hover:text-white transition">
                  Cancel
                </button>
                <button type="submit" disabled={inviteMutation.isPending} className="flex-1 py-3 bg-[#FF7A30] hover:bg-[#FF7A30]/90 text-white rounded-xl font-bold transition disabled:opacity-50">
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
