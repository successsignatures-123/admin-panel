"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Users,
  LogOut,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setUserRole(user.role);
  }, []);

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { name: "Jobs", icon: Briefcase, href: "/dashboard/jobs" },
    { name: "Applications", icon: FileText, href: "/dashboard/applications" },
    { name: "Users", icon: Users, href: "/dashboard/users" },
  ];

  if (userRole === "cheifAdmin") {
    menuItems.push({ 
      name: "Manage Admins", 
      icon: ShieldCheck, 
      href: "/dashboard/admins" 
    });
  }

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <>
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#00004d] text-white flex items-center justify-between px-5 py-4 shadow-lg">
        <h1 className="text-xl font-black italic tracking-tighter">
          EASY<span className="text-[#5DBB63]">JOBS</span>
        </h1>
        <button onClick={() => setIsOpen(true)}>
          <Menu size={28} />
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsOpen(false)} />
      )}

      <aside className={`fixed top-0 left-0 z-50 h-screen w-72 bg-[#00004d] text-white p-8 rounded-r-[2rem] shadow-2xl transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        <div className="flex items-center justify-between lg:block">
          <div className="mb-10">
            <h1 className="text-2xl font-black italic tracking-tighter">
              EASY<span className="text-[#5DBB63]">JOBS</span>
            </h1>
            <p className="text-[10px] font-black text-blue-300 tracking-[0.3em] uppercase mt-1">
              {userRole === "cheifAdmin" ? "Chief Admin" : "Sub Admin"}
            </p>
          </div>
          <button className="lg:hidden mb-8" onClick={() => setIsOpen(false)}><X size={28} /></button>
        </div>

        <nav className="space-y-4">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-4 p-4 rounded-2xl transition-all font-bold text-sm ${pathname === item.href ? "bg-white text-[#00004d] shadow-xl scale-105" : "hover:bg-blue-900/40 text-blue-100"}`}
            >
              <item.icon size={20} />
              {item.name}
            </Link>
          ))}
        </nav>

        <button onClick={handleLogout} className="absolute bottom-10 left-8 right-8 p-4 rounded-2xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-3 font-black text-[10px] tracking-widest">
          <LogOut size={16} />
          LOGOUT
        </button>
      </aside>
    </>
  );
}