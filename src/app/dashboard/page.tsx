"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { statsAPI } from "../../services/api";
import { Users, Briefcase, FileText, Globe } from "lucide-react";
import { io } from "socket.io-client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const socket = io("https://easyjobspk.onrender.com");

interface Visitor {
  id: string;
  name: string;
  role: string;
  location: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({ totalUsers: 0, totalJobs: 0, totalApps: 0 });
  const [graphData, setGraphData] = useState([]);
  const [visitors, setVisitors] = useState<Visitor[]>([]);

  useEffect(() => {
    statsAPI.getAllStats().then(res => setStats(res.data));
    statsAPI.getGraphStats().then(res => setGraphData(res.data));
    socket.on("connect", () => console.log("Dashboard connected to Socket"));
    
    socket.on("updateVisitorsList", (data: Visitor[]) => {
      console.log("Live Visitors List Updated:", data);
      setVisitors(data);
    });

    return () => {
      socket.off("updateVisitorsList");
    };
  }, []);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      <div className="flex-1 p-4 sm:p-8 overflow-y-auto">
        <h2 className="text-2xl font-black text-[#00004d] mb-8">System Status And Stats</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div onClick={() => router.push('/dashboard/users')} className="cursor-pointer bg-white p-6 rounded-2xl shadow-sm border hover:border-blue-400 transition-all flex justify-between">
            <div><p className="text-gray-500 text-sm">Total Talent</p><h3 className="text-3xl font-black text-[#00004d]">{stats.totalUsers}</h3></div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Users /></div>
          </div>
          <div onClick={() => router.push('/dashboard/jobs')} className="cursor-pointer bg-white p-6 rounded-2xl shadow-sm border hover:border-green-400 transition-all flex justify-between">
            <div><p className="text-gray-500 text-sm">Active Jobs</p><h3 className="text-3xl font-black text-[#00004d]">{stats.totalJobs}</h3></div>
            <div className="p-3 bg-green-50 text-green-600 rounded-xl"><Briefcase /></div>
          </div>
          <div onClick={() => router.push('/dashboard/applications')} className="cursor-pointer bg-white p-6 rounded-2xl shadow-sm border hover:border-purple-400 transition-all flex justify-between">
            <div><p className="text-gray-500 text-sm">Submissions</p><h3 className="text-3xl font-black text-[#00004d]">{stats.totalApps}</h3></div>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><FileText /></div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
          <div className="xl:col-span-2 bg-white p-6 rounded-2xl shadow-sm border">
            <h2 className="text-lg font-black text-[#00004d] mb-8">Employers vs Applicants</h2>
            <div className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={graphData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="month" />
                    <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{fill: '#f9fafb'}} />
                    <Legend />
                    <Bar name="Applicants" dataKey="applicants" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={35} />
                    <Bar name="Employers" dataKey="employers" fill="#10b981" radius={[6, 6, 0, 0]} barSize={35} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border h-full min-h-[400px]">
            <div className="flex items-center gap-2 mb-8 border-b pb-4">
              <Globe size={22} className="animate-pulse text-blue-500" />
              <h2 className="text-lg font-black text-[#00004d]">Live Activity</h2>
            </div>
            
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {visitors.map((v) => (
                <div key={v.id} className="flex justify-between items-center bg-gray-50/50 p-3 rounded-xl border border-blue-50">
                  <div className="flex flex-col overflow-hidden">
                    <span className="font-bold text-sm text-[#00004d] truncate">{v.name}</span>
                    <span className="text-[10px] uppercase font-bold text-gray-400">{v.role}</span>
                  </div>
                  <div className="text-right ml-2">
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded leading-tight block mb-1">
                      {v.location}
                    </span>
                    <div className="flex items-center justify-end gap-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span>
                      <span className="text-[9px] text-green-600 font-bold">LIVE</span>
                    </div>
                  </div>
                </div>
              ))}
              {visitors.length === 0 && <p className="text-center text-gray-400 py-10 italic">No active visitors...</p>}
            </div>

            {visitors.length > 0 && (
               <div className="mt-8 p-3 bg-[#00004d] rounded-xl text-center shadow-lg">
                  <p className="text-white text-xs font-bold tracking-widest">Total Live: {visitors.length}</p>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}