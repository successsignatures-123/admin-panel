"use client";
import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Mail, Lock, ArrowRight, Check, ArrowLeft, Eye, EyeOff, Phone } from "lucide-react";
import { authAPI } from "../../services/api";
import toast, { Toaster } from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";

function LoginContent() {
  const [agreed, setAgreed] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  useEffect(() => {
    const token = searchParams.get("token");
    const userStr = searchParams.get("user");

    if (token && userStr) {
      try {
        localStorage.setItem("token", token);
        localStorage.setItem("user", userStr);
        
        const userData = JSON.parse(decodeURIComponent(userStr));
        toast.success(`Welcome back, ${userData.name || 'User'}!`);
        setTimeout(() => {
          const pendingForm = localStorage.getItem("pendingJobApplication");
          if (pendingForm) {
            router.push("/application"); 
          } else {
            router.push(userData.role === "employer" ? "/dashboard/employer" : "/dashboard/jobseeker");
          }
        }, 1000);
      } catch (err) {
        toast.error("Error processing Google login");
        console.error(err);
      }
    }
  }, [searchParams, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      toast.error("Please agree to the terms");
      return;
    }

    setLoading(true);
    try {
      const credentials = loginMethod === "email" ? { email, password } : { phone, password };
      const res = await authAPI.login(credentials);
      
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      
      toast.success("Login Successful!");

      setTimeout(() => {
        const pendingForm = localStorage.getItem("pendingJobApplication");
        if (pendingForm) {
          router.push("/application"); 
        } else {
          router.push(res.data.user.role === "employer" ? "/dashboard/employer" : "/dashboard/jobseeker");
        }
      }, 1000);
      
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    toast.loading("Redirecting to Google...");
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#fcfcfc] relative overflow-hidden">
      <Toaster position="top-center" />
            <div className="absolute top-[-10%] right-[-5%] w-[300px] h-[300px] bg-[#e2f2f5] rounded-full blur-[100px] opacity-60"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[300px] h-[300px] bg-[#f0fdf4] rounded-full blur-[100px] opacity-60"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,77,0.06)] border border-gray-50 overflow-hidden p-8 md:p-12 relative z-10"
      >
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-[#00004d] font-black text-[10px] tracking-widest hover:text-blue-700 transition-colors"
          >
            <ArrowLeft size={14} className="mr-1" /> BACK TO HOME
          </Link>
        </div>

        <div className="text-center mb-5">
         <h1 className="text-2xl md:text-4xl font-black text-[#00004d] mb-3">
          Login to Your Account
          </h1>
        </div>
        <div className="flex bg-slate-50 p-1.5 rounded-full mb-8">
          <button 
            onClick={() => setLoginMethod("email")}
            className={`flex-1 py-2.5 rounded-full text-[10px] font-black tracking-widest transition-all ${loginMethod === 'email' ? 'bg-white text-[#00004d] shadow-sm' : 'text-gray-400'}`}
          >
            EMAIL
          </button>
          <button 
            onClick={() => setLoginMethod("phone")}
            className={`flex-1 py-2.5 rounded-full text-[10px] font-black tracking-widest transition-all ${loginMethod === 'phone' ? 'bg-white text-[#00004d] shadow-sm' : 'text-gray-400'}`}
          >
            PHONE
          </button>
        </div>

        <form className="space-y-5" onSubmit={handleLogin}>
          <AnimatePresence mode="wait">
            {loginMethod === "email" ? (
              <motion.div 
                key="email"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-2"
              >
                <label className="text-[10px] font-black text-[#00004d] ml-6 tracking-widest">EMAIL ADDRESS</label>
                <div className="relative flex items-center group">
                  <Mail className="absolute left-6 text-gray-300 group-focus-within:text-[#00004d] transition-colors" size={18} />
                  <input 
                    required type="email" placeholder="name@email.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-[#00004d] focus:bg-white rounded-full outline-none transition-all font-bold text-[#00004d] text-sm" 
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="phone"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-2"
              >
                <label className="text-[10px] font-black text-[#00004d] ml-6 tracking-widest">PHONE NUMBER</label>
                <div className="relative flex items-center group">
                  <Phone className="absolute left-6 text-gray-300 group-focus-within:text-[#00004d] transition-colors" size={18} />
                  <input 
                    required type="tel" placeholder="+91 00000 00000" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-[#00004d] focus:bg-white rounded-full outline-none transition-all font-bold text-[#00004d] text-sm" 
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-6">
              <label className="text-[10px] font-black text-[#00004d] tracking-widest">PASSWORD</label>
              <Link href="#" className="text-[9px] font-black text-[#00004d] hover:underline tracking-widest">FORGOT?</Link>
            </div>
            <div className="relative flex items-center group">
              <Lock className="absolute left-6 text-gray-300 group-focus-within:text-[#00004d] transition-colors" size={18} />
              <input 
                required type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-14 pr-14 py-4 bg-slate-50 border-2 border-transparent focus:border-[#00004d] focus:bg-white rounded-full outline-none transition-all font-bold text-[#00004d] text-sm" 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-6 text-gray-300 hover:text-[#00004d] transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 px-2 py-2 cursor-pointer group" onClick={() => setAgreed(!agreed)}>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300 
              ${agreed ? 'bg-[#00004d] border-[#00004d] shadow-lg shadow-blue-100' : 'border-gray-200 bg-white group-hover:border-[#00004d]'}`}>
              {agreed && <Check size={14} className="text-white" strokeWidth={4} />}
            </div>
            <p className="text-[10px] font-bold text-gray-400 leading-snug tracking-tight">
              Keep me logged in & agree to <span className="text-[#00004d] underline font-black">Privacy Policy</span>
            </p>
          </div>

          <button 
            type="submit"
            disabled={!agreed || loading}
            className={`w-full py-5 rounded-full font-black text-xs tracking-[0.2em] transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95
              ${agreed && !loading
                ? 'bg-[#00004d] text-white hover:bg-[#00004d]/90 shadow-blue-900/20' 
                : 'bg-slate-100 text-gray-300 cursor-not-allowed shadow-none'}`}
          >
            {loading ? "AUTHENTICATING..." : "LOGIN TO ACCOUNT"} 
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100"></div>
          </div>
          <div className="relative flex justify-center text-[10px] font-black uppercase">
            <span className="bg-white px-4 text-gray-300 tracking-[0.3em]">Or continue with</span>
          </div>
        </div>
        <button 
          onClick={handleGoogleLogin}
          type="button"
          className="w-full py-4 border-2 border-gray-100 rounded-full flex items-center justify-center gap-3 hover:bg-slate-50 transition-all active:scale-95 mb-8"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span className="text-[10px] font-black text-[#00004d] tracking-widest">GOOGLE ACCOUNT</span>
        </button>

        <div className="text-center border-t border-gray-50 pt-8">
          <p className="text-gray-400 font-bold text-[10px] tracking-widest">
            DON'T HAVE AN ACCOUNT? 
            <Link href="/register" className="text-[#00004d] font-black hover:underline ml-1">CREATE NEW</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}