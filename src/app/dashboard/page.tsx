"use client";

import { useEffect, useState } from "react";
import { statsAPI } from "../../services/api";
import StatCard from "../components/StatCard";
import { Users, Briefcase, FileText } from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalJobs: 0,
    totalApps: 0,
  });

  useEffect(() => {
    statsAPI
      .getAllStats()
      .then((res) => setStats(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="p-3 sm:p-5 lg:p-8">
      <div className="mb-8 sm:mb-10">
        <h1 className="text-3xl sm:text-4xl font-black text-[#00004d] tracking-tight">
          System Status
        </h1>

        <p className="text-gray-400 text-sm sm:text-base mt-2">
          Overview of platform performance and activity
        </p>
      </div>
      <div
        className="
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          xl:grid-cols-3 
          gap-4 sm:gap-6 lg:gap-8
        "
      >
        <StatCard
          title="Total Talent"
          value={stats.totalUsers}
          icon={<Users size={28} />}
          bgColor="bg-blue-50 text-blue-600"
        />

        <StatCard
          title="Active Openings"
          value={stats.totalJobs}
          icon={<Briefcase size={28} />}
          bgColor="bg-green-50 text-green-600"
        />

        <StatCard
          title="Submissions"
          value={stats.totalApps}
          icon={<FileText size={28} />}
          bgColor="bg-purple-50 text-purple-600"
        />
      </div>
    </div>
  );
}