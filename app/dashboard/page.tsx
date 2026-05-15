"use client"
import { useEffect, useState } from "react";
import api from "@/app/services/api";
import StatCard from "@/app/components/StatCard";
import { Users, Briefcase, FileText } from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState({ totalUsers: 0, totalJobs: 0, totalApps: 0 });

  useEffect(() => {
    api.get("/stats")
      .then(res => setStats(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Admin Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Users" 
          value={stats.totalUsers} 
          icon={<Users size={24} />} 
          bgColor="bg-blue-100" 
        />
        <StatCard 
          title="Total Jobs" 
          value={stats.totalJobs} 
          icon={<Briefcase size={24} />} 
          bgColor="bg-green-100" 
        />
        <StatCard 
          title="Applications" 
          value={stats.totalApps} 
          icon={<FileText size={24} />} 
          bgColor="bg-purple-100" 
        />
      </div>
    </div>
  );
}