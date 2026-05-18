"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { statsAPI } from "../../services/api";
import { Users, Briefcase, FileText, Globe, Loader2 } from "lucide-react";
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
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const checkAccessAndFetch = async () => {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!token || (user.role !== 'cheifAdmin' && user.role !== 'subAdmin')) {
        console.error("Access Denied. Role:", user.role);
        router.replace("/login");
        return;
      }

      try {
        const [statsRes, graphRes] = await Promise.all([
          statsAPI.getAllStats(),
          statsAPI.getGraphStats()
        ]);
        setStats(statsRes.data);
        setGraphData(graphRes.data);
      } catch (err: any) {
        console.error("Fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    checkAccessAndFetch();

    socket.on("updateVisitorsList", (data: Visitor[]) => {
      setVisitors(data);
    });

    return () => { socket.off("updateVisitorsList"); };
  }, [router]);

  if (!mounted || loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white">
        <Loader2 className="animate-spin text-[#00004d] mb-4" size={40} />
        <p className="text-[#00004d] font-black text-[10px] tracking-widest uppercase italic">Verifying Access...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50 lg:ml-72 transition-all">
      <div className="flex-1 p-4 sm:p-8 overflow-y-auto">
        <div className="mb-10 text-left">
          <h2 className="text-3xl font-black text-[#00004d] tracking-tighter">System Overview</h2>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Real-time Portal Monitoring</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div onClick={() => router.push('/dashboard/users')} className="group cursor-pointer bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 hover:border-[#00004d] transition-all flex justify-between items-center">
            <div><p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mb-1">Total Talent</p><h3 className="text-4xl font-black text-[#00004d]">{stats.totalUsers}</h3></div>
            <div className="p-4 bg-blue-50 text-[#00004d] rounded-2xl"><Users size={28} /></div>
          </div>
          <div onClick={() => router.push('/dashboard/jobs')} className="group cursor-pointer bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 hover:border-green-500 transition-all flex justify-between items-center">
            <div><p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mb-1">Active Jobs</p><h3 className="text-4xl font-black text-[#00004d]">{stats.totalJobs}</h3></div>
            <div className="p-4 bg-green-50 text-green-600 rounded-2xl"><Briefcase size={28} /></div>
          </div>
          <div onClick={() => router.push('/dashboard/applications')} className="group cursor-pointer bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 hover:border-purple-500 transition-all flex justify-between items-center">
            <div><p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mb-1">Submissions</p><h3 className="text-4xl font-black text-[#00004d]">{stats.totalApps}</h3></div>
            <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl"><FileText size={28} /></div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
            <h2 className="text-lg font-black text-[#00004d] mb-8">Growth Analytics</h2>
            <div className="h-[350px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={graphData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 'bold'}} />
                    <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 'bold'}} />
                    <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{borderRadius: '15px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)'}} />
                    <Legend iconType="circle" />
                    <Bar name="Applicants" dataKey="applicants" fill="#6366f1" radius={[10, 10, 0, 0]} barSize={30} />
                    <Bar name="Employers" dataKey="employers" fill="#10b981" radius={[10, 10, 0, 0]} barSize={30} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-8 border-b pb-6">
              <Globe size={24} className="text-blue-500" />
              <h2 className="text-lg font-black text-[#00004d]">Live Activity</h2>
            </div>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {visitors.map((v) => (
                <div key={v.id} className="flex justify-between items-center bg-slate-50/50 p-4 rounded-[1.5rem]">
                  <div className="flex flex-col"><span className="font-black text-xs text-[#00004d] truncate">{v.name}</span><span className="text-[9px] font-bold text-blue-500 uppercase">{v.role}</span></div>
                  <span className="text-[9px] font-black text-gray-400 bg-white border px-2 py-1 rounded-lg uppercase">{v.location}</span>
                </div>
              ))}
              {visitors.length === 0 && <p className="text-center text-gray-300 font-bold py-10">No live users</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}