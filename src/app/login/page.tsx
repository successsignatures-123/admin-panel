"use client";
import { useState, Suspense } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, Lock, ArrowRight, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { authAPI } from "../../services/api";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
function LoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await authAPI.login({ email, password });
      const user = res.data.user;
      const allowedRoles = ['cheifAdmin', 'subAdmin'];
      if (!allowedRoles.includes(user.role)) {
        toast.error("Access Denied: Restricted Area!");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(user));
      
      toast.success(`Welcome, ${user.role === 'cheifAdmin' ? 'Cheif Admin' : 'Admin'}!`);

      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
      
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#fcfcfc] relative overflow-hidden">
      <Toaster position="top-center" />
      <div className="absolute top-[-10%] right-[-5%] w-[300px] h-[300px] bg-[#00004d]/5 rounded-full blur-[100px]"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,77,0.06)] border border-gray-50 p-12 relative z-10"
      >
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-[#00004d] font-black text-[10px] tracking-widest uppercase">
            <ArrowLeft size={14} className="mr-1" /> Back
          </Link>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-[#00004d] mb-2 tracking-tighter">Admin Login</h1>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Secure Access Portal</p>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#00004d] ml-6 tracking-widest uppercase">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-6 top-4 text-gray-300" size={18} />
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@easyjobs.pk"
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-[#00004d] focus:bg-white rounded-full outline-none font-bold text-[#00004d] transition-all" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#00004d] ml-6 tracking-widest uppercase">Password</label>
            <div className="relative group">
              <Lock className="absolute left-6 top-4 text-gray-300" size={18} />
              <input required type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                className="w-full pl-14 pr-14 py-4 bg-slate-50 border-2 border-transparent focus:border-[#00004d] focus:bg-white rounded-full outline-none font-bold text-[#00004d] transition-all" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-4 text-gray-300 hover:text-[#00004d]">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-5 rounded-full font-black text-xs tracking-[0.2em] bg-[#00004d] text-white hover:bg-[#00004d]/90 shadow-xl shadow-blue-900/10 flex items-center justify-center gap-3 active:scale-95 transition-all"
          >
            {loading ? "VERIFYING..." : "ENTER DASHBOARD"} 
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}><LoginContent /></Suspense>
  );
}