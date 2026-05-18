"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    if (!token || !userStr) {
      router.push("/login");
    } else {
      const user = JSON.parse(userStr);
      const allowedRoles = ["cheifAdmin", "subAdmin"];

      if (!allowedRoles.includes(user.role)) {
        localStorage.clear();
        router.push("/login");
      } else {
        setIsAuth(true);
      }
    }
  }, [router]);

  if (!isAuth) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#fcfcfc] px-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#00004d]/20 border-t-[#00004d] rounded-full animate-spin mx-auto mb-4" />

          <h2 className="text-lg sm:text-xl font-black text-[#00004d]">
            Authenticating Admin...
          </h2>

          <p className="text-sm text-gray-400 mt-1 font-bold uppercase tracking-widest">
            Verifying secure access
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fcfcfc] min-h-screen">
      <Sidebar />
      <main
        className="
          min-h-screen
          transition-all duration-300
          lg:ml-72
          pt-24 lg:pt-10
          px-3 sm:px-5 lg:px-10
          pb-6
        "
      >
        {children}
      </main>
    </div>
  );
}