"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Edit2,
  Shield,
  X,
  Mail,
  Lock,
  User,
  ShieldCheck,
  Loader2,
  MoreVertical,
} from "lucide-react";

import { adminAPI } from "../../../services/api";
import toast, { Toaster } from "react-hot-toast";

export default function ManageAdmins() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
    role: "subAdmin",
  });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setFetchLoading(true);
      const res = await adminAPI.getAdmins();
      setAdmins(res.data.filter((a: any) => a.role === "subAdmin"));
    } catch (err) {
      toast.error("Network Error: Could not fetch admins");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (formData.id) {
        await adminAPI.updateAdmin(formData.id, formData);
        toast.success("Admin profile updated!");
      } else {
        await adminAPI.createAdmin(formData);
        toast.success("New Admin successfully created!");
      }
      setIsModalOpen(false);
      resetForm();
      fetchAdmins();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure? This action will revoke all access.")) {
      try {
        await adminAPI.deleteAdmin(id);
        toast.success("Access Revoked");
        fetchAdmins();
      } catch (err) {
        toast.error("Delete failed");
      }
    }
  };

  const resetForm = () => {
    setFormData({ id: "", name: "", email: "", password: "", role: "subAdmin" });
  };

  const openEditModal = (admin: any) => {
    setFormData({
      id: admin._id,
      name: admin.name,
      email: admin.email,
      password: "",
      role: admin.role,
    });
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] px-4 sm:px-8 py-8 lg:py-12">
      <Toaster position="top-right" />

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 pt-12 lg:pt-0">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
              <ShieldCheck className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Admins <span className="text-indigo-600 font-light italic">Center</span>
              </h1>
              <p className="text-slate-500 text-xs font-medium uppercase tracking-widest mt-0.5">
                Manage system access & roles
              </p>
            </div>
          </div>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3.5 rounded-xl font-bold text-xs tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-slate-200 transition-all"
        >
          <Plus size={18} />
          ADD SUB-ADMIN
        </motion.button>
      </div>

      {fetchLoading ? (
        <div className="flex flex-col items-center justify-center py-40">
          <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} />
          <p className="text-slate-400 font-medium text-sm animate-pulse">Syncing database...</p>
        </div>
      ) : (
        <>
          {admins.length === 0 ? (
            <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 py-24 text-center">
              <Shield className="mx-auto text-slate-200 mb-4" size={64} />
              <p className="text-slate-400 font-semibold">No Sub-Admins assigned yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <AnimatePresence>
                {admins.map((admin: any, index) => (
                  <motion.div
                    key={admin._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    {/* Action Buttons */}
                    <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEditModal(admin)} className="p-2 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(admin._id)} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="flex flex-col items-center sm:items-start">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg mb-4">
                        {admin.name?.charAt(0)}
                      </div>

                      <h2 className="text-lg font-bold text-slate-800 line-clamp-1">{admin.name}</h2>
                      <p className="text-slate-400 text-sm font-medium mb-6">{admin.email}</p>

                      <div className="w-full pt-4 border-t border-slate-50 flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                          Sub Admin
                        </span>
                        <div className="flex items-center gap-1.5 text-emerald-500 text-[10px] font-bold uppercase tracking-wider">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                          Live
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </>
      )}

      {/* REFINED MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="relative bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute right-6 top-6 p-2 text-slate-400 hover:text-slate-900 rounded-full transition-colors">
                <X size={20} />
              </button>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900">{formData.id ? "Edit Access" : "Add Admin"}</h2>
                <p className="text-slate-500 text-sm mt-1">Assign system permissions to new user.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Full Identity</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input
                      required type="text" value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                      className="w-full h-12 pl-11 pr-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none text-sm transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input
                      required type="email" value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="admin@easyjobs.com"
                      className="w-full h-12 pl-11 pr-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none text-sm transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Security Key</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input
                      required={!formData.id} type="password" value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full h-12 pl-11 pr-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none text-sm transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit" disabled={loading}
                  className="w-full h-14 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm tracking-wide shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-3 mt-4"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : (formData.id ? "UPDATE PROFILE" : "CONFIRM ACCESS")}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}