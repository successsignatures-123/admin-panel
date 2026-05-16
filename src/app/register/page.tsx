"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  User, Mail, Lock, Check,
  ArrowLeft, Eye, EyeOff, ShieldCheck, MailOpen, ArrowRight
} from "lucide-react";
import { authAPI } from "../../services/api";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match!");
    }
    if (formData.password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    setLoading(true);
    const userData = {
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      password: formData.password,
      role: 'cheifAdmin'
    };

    try {
      await authAPI.cheifadminRegister(userData);
      setIsEmailSent(true);
      toast.success("Registration Successful!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#fcfcfc] overflow-hidden relative">
      <Toaster position="top-center" />
      <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-[#00004d]/5 rounded-full blur-[100px] -z-10"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-[#5DBB63]/5 rounded-full blur-[100px] -z-10"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-white rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,77,0.06)] p-8 md:p-14 border border-white relative"
      >
        <AnimatePresence mode="wait">
          {!isEmailSent ? (
            <motion.div key="register-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -20 }}>
              <div className="mb-10 flex justify-between items-center">
                <Link href="/" className="inline-flex items-center text-gray-400 font-bold text-[10px] tracking-widest uppercase hover:text-[#00004d] transition-colors">
                  <ArrowLeft size={14} className="mr-1" /> Back
                </Link>
                <span className="text-[10px] font-black text-[#5DBB63] tracking-[0.2em] uppercase">Step 01/02</span>
              </div>

              <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-black text-[#00004d] mb-3 tracking-tighter italic uppercase">Admin <span className="text-[#5DBB63]">Portal</span></h1>
                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Create Cheif Admin account</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="relative group">
                    <User className="absolute left-6 top-4 text-gray-300 group-focus-within:text-[#00004d]" size={18} />
                    <input required type="text" placeholder="First Name" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-2xl outline-none border-2 border-transparent focus:border-[#00004d] focus:bg-white font-bold text-[#00004d] transition-all" />
                  </div>
                  <div className="relative group">
                    <User className="absolute left-6 top-4 text-gray-300 group-focus-within:text-[#00004d]" size={18} />
                    <input required type="text" placeholder="Last Name" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-2xl outline-none border-2 border-transparent focus:border-[#00004d] focus:bg-white font-bold text-[#00004d] transition-all" />
                  </div>
                </div>

                <div className="relative group">
                  <Mail className="absolute left-6 top-4 text-gray-300 group-focus-within:text-[#00004d]" size={18} />
                  <input required type="email" placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-2xl outline-none border-2 border-transparent focus:border-[#00004d] focus:bg-white font-bold text-[#00004d] transition-all" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="relative group">
                    <Lock className="absolute left-6 top-4 text-gray-300 group-focus-within:text-[#00004d]" size={18} />
                    <input required type={showPass ? "text" : "password"} placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full pl-14 pr-12 py-4 bg-slate-50 rounded-2xl outline-none border-2 border-transparent focus:border-[#00004d] focus:bg-white font-bold text-[#00004d] transition-all" />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-5 top-4 text-gray-300 hover:text-[#00004d] transition-colors">{showPass ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                  </div>
                  <div className="relative group">
                    <ShieldCheck className="absolute left-6 top-4 text-gray-300 group-focus-within:text-[#00004d]" size={18} />
                    <input required type={showConfirmPass ? "text" : "password"} placeholder="Confirm" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} className="w-full pl-14 pr-12 py-4 bg-slate-50 rounded-2xl outline-none border-2 border-transparent focus:border-[#00004d] focus:bg-white font-bold text-[#00004d] transition-all" />
                    <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-5 top-4 text-gray-300 hover:text-[#00004d] transition-colors">{showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-5 bg-slate-50/50 rounded-[1.5rem] cursor-pointer group" onClick={() => setAgreed(!agreed)}>
                  <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${agreed ? 'bg-[#00004d] border-[#00004d]' : 'border-gray-200 bg-white group-hover:border-[#00004d]'}`}>
                    {agreed && <Check size={14} className="text-white" strokeWidth={4} />}
                  </div>
                  <p className="text-[11px] font-bold text-gray-400 leading-snug tracking-tight">I agree to the <span className="text-[#00004d] underline font-black uppercase">System Terms of Service</span> & Privacy Policy</p>
                </div>

                <div className="flex justify-center pt-6">
                  <button
                    type="submit"
                    disabled={!agreed || loading}
                    className={`w-full py-5 rounded-full font-black text-[12px] tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl
                      ${agreed && !loading ? 'bg-[#00004d] text-white hover:shadow-[#00004d]/20' : 'bg-slate-100 text-gray-300 cursor-not-allowed shadow-none'}`}
                  >
                    {loading ? "CREATING ACCOUNT..." : "CREATE ADMIN ACCOUNT"}
                    {!loading && <ArrowRight size={18} />}
                  </button>
                </div>
              </form>

              <div className="mt-12 text-center">
                <p className="text-gray-400 font-bold text-[10px] tracking-widest uppercase">Already have access? <Link href="/login" className="text-[#00004d] font-black hover:underline ml-2">Login Here</Link></p>
              </div>
            </motion.div>
          ) : (
            <motion.div key="success-msg" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
              <div className="w-24 h-24 bg-green-50 text-[#5DBB63] rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner"><MailOpen size={48} /></div>
              <h2 className="text-3xl font-black text-[#00004d] mb-4 tracking-tighter italic uppercase">Verification Sent</h2>
              <p className="text-gray-400 font-bold text-sm mb-10 leading-relaxed max-w-sm mx-auto uppercase tracking-wide">Account created! Check <span className="text-[#00004d]">{formData.email}</span> to activate your admin privileges.</p>
              <div className="flex flex-col items-center gap-4">
                <button onClick={() => router.push("/login")} className="w-full max-w-xs py-5 bg-[#00004d] text-white rounded-full font-black text-xs tracking-widest flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all">PROCEED TO LOGIN <ArrowRight size={18} /></button>
                <button onClick={() => setIsEmailSent(false)} className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.3em] hover:text-[#00004d]">Go Back</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}