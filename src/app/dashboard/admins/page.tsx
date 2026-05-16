"use client";
import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Shield, X, Mail, Lock, User } from "lucide-react";
import { adminAPI } from "../../../services/api";
import toast, { Toaster } from "react-hot-toast";

export default function ManageAdmins() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
    role: "subAdmin"
  });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await adminAPI.getAdmins();
      setAdmins(res.data.filter((a: any) => a.role === 'subAdmin'));
    } catch (err) {
      console.error("Failed to fetch admins");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (formData.id) {
        await adminAPI.updateAdmin(formData.id, formData);
        toast.success("Admin updated successfully!");
      } else {
        await adminAPI.createAdmin(formData);
        toast.success("Sub-Admin created successfully!");
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
    if (window.confirm("Are you sure you want to remove this admin?")) {
      try {
        await adminAPI.deleteAdmin(id);
        toast.success("Admin deleted");
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
      password: "", // Leave blank for updates usually
      role: admin.role
    });
    setIsModalOpen(true);
  };

  return (
    <div className="p-8 lg:ml-72 min-h-screen bg-[#fcfcfc]">
      <Toaster />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
        <div>
          <h1 className="text-4xl font-black text-[#00004d] tracking-tighter">Manage Admins</h1>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mt-2">Control Sub-Admin Access & Roles</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-[#00004d] text-white px-8 py-4 rounded-full font-black text-xs tracking-widest flex items-center gap-3 hover:shadow-2xl hover:scale-105 transition-all active:scale-95"
        >
          <Plus size={18} /> ADD NEW SUB-ADMIN
        </button>
      </div>

      {/* Admins List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {admins.length === 0 ? (
           <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
              <Shield className="mx-auto text-gray-200 mb-4" size={48} />
              <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No Sub-Admins found</p>
           </div>
        ) : (
          admins.map((admin: any) => (
            <div key={admin._id} className="bg-white p-8 rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,77,0.04)] border border-gray-50 relative group overflow-hidden">
              <div className="absolute top-0 right-0 p-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEditModal(admin)} className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition-all">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDelete(admin._id)} className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-600 hover:text-white transition-all">
                  <Trash2 size={16} />
                </button>
              </div>
              
              <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-[#00004d] mb-6">
                <Shield size={24} />
              </div>
              
              <h3 className="text-xl font-black text-[#00004d] tracking-tight mb-1">{admin.name}</h3>
              <p className="text-gray-400 font-bold text-xs truncate mb-6">{admin.email}</p>
              
              <span className="px-4 py-2 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                Active Access
              </span>
            </div>
          ))
        )}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#00004d]/40 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute right-8 top-8 text-gray-300 hover:text-black transition-colors">
              <X size={28} />
            </button>
            
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black text-[#00004d] tracking-tighter">
                {formData.id ? "Edit Admin" : "New Sub-Admin"}
              </h2>
              <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-1">Fill in the credentials</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-[#00004d] ml-6 uppercase tracking-widest text-gray-400">Full Name</label>
                <div className="relative">
                  <User className="absolute left-6 top-4 text-gray-300" size={18} />
                  <input required className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-full border-2 border-transparent focus:border-[#00004d] focus:bg-white outline-none font-bold text-sm text-[#00004d] transition-all"
                    value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Full Name" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-[#00004d] ml-6 uppercase tracking-widest text-gray-400">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-6 top-4 text-gray-300" size={18} />
                  <input required type="email" className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-full border-2 border-transparent focus:border-[#00004d] focus:bg-white outline-none font-bold text-sm text-[#00004d] transition-all"
                    value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="email@easyjobs.pk" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-[#00004d] ml-6 uppercase tracking-widest text-gray-400">Password</label>
                <div className="relative">
                  <Lock className="absolute left-6 top-4 text-gray-300" size={18} />
                  <input required={!formData.id} type="password" className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-full border-2 border-transparent focus:border-[#00004d] focus:bg-white outline-none font-bold text-sm text-[#00004d] transition-all"
                    value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="••••••••" />
                </div>
              </div>
              
              <button disabled={loading} className="w-full py-5 bg-[#00004d] text-white rounded-full font-black text-xs tracking-[0.2em] shadow-xl hover:bg-[#000033] active:scale-95 transition-all mt-4">
                {loading ? "PROCESSING..." : "SAVE SUB-ADMIN"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}