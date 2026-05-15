"use client"
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
        router.push("/dashboard");
    } else {
        router.push("/dashboard"); 
    }
  }, [router]);

  return (
    <div className="h-screen flex items-center justify-center">
      <p className="animate-pulse font-medium text-gray-500">Redirecting to Dashboard...</p>
    </div>
  );
}