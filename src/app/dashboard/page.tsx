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
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!token || (user.role !== 'cheifAdmin' && user.role !== 'subAdmin')) {
      router.push("/login");
      return;
    }

    setAuthorized(true);

    const fetchData = async () => {
      try {
        const [statsRes, graphRes] = await Promise.all([
          statsAPI.getAllStats(),
          statsAPI.getGraphStats()
        ]);
        setStats(statsRes.data);
        setGraphData(graphRes.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    socket.on("connect", () => console.log("Live: Connected"));
    socket.on("updateVisitorsList", (data: Visitor[]) => {
      setVisitors(data);
    });

    return () => {
      socket.off("updateVisitorsList");
    };
  }, [router]);

  if (!authorized || loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white">
        <Loader2 className="animate-spin text-[#00004d] mb-4" size={40} />
        <p className="text-[#00004d] font-black text-xs tracking-widest uppercase">Verifying Dashboard Access...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50 lg:ml-72 transition-all">
      <div className="flex-1 p-4 sm:p-8 overflow-y-auto">
        <div className="mb-10">
          <h2 className="text-3xl font-black text-[#00004d] tracking-tighter">System Overview</h2>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Real-time Portal Monitoring</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div onClick={() => router.push('/dashboard/users')} className="group cursor-pointer bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 hover:border-[#00004d] transition-all flex justify-between items-center">
            <div>
              <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mb-1">Total Talent</p>
              <h3 className="text-4xl font-black text-[#00004d]">{stats.totalUsers}</h3>
            </div>
            <div className="p-4 bg-blue-50 text-[#00004d] rounded-2xl group-hover:scale-110 transition-transform"><Users size={28} /></div>
          </div>

          <div onClick={() => router.push('/dashboard/jobs')} className="group cursor-pointer bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 hover:border-green-500 transition-all flex justify-between items-center">
            <div>
              <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mb-1">Active Jobs</p>
              <h3 className="text-4xl font-black text-[#00004d]">{stats.totalJobs}</h3>
            </div>
            <div className="p-4 bg-green-50 text-green-600 rounded-2xl group-hover:scale-110 transition-transform"><Briefcase size={28} /></div>
          </div>

          <div onClick={() => router.push('/dashboard/applications')} className="group cursor-pointer bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 hover:border-purple-500 transition-all flex justify-between items-center">
            <div>
              <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mb-1">Submissions</p>
              <h3 className="text-4xl font-black text-[#00004d]">{stats.totalApps}</h3>
            </div>
            <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl group-hover:scale-110 transition-transform"><FileText size={28} /></div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
          <div className="xl:col-span-2 bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100">
            <h2 className="text-lg font-black text-[#00004d] mb-8 tracking-tight">User Registration Growth</h2>
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

          <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 h-full min-h-[450px]">
            <div className="flex items-center gap-3 mb-8 border-b border-gray-50 pb-6">
              <div className="relative">
                <Globe size={24} className="text-blue-500" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
              </div>
              <h2 className="text-lg font-black text-[#00004d] tracking-tight">Active Now</h2>
            </div>
            
            <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
              {visitors.map((v) => (
                <div key={v.id} className="flex justify-between items-center bg-slate-50/50 p-4 rounded-[1.5rem] border border-transparent hover:border-blue-100 transition-all">
                  <div className="flex flex-col overflow-hidden">
                    <span className="font-black text-xs text-[#00004d] truncate uppercase tracking-wider">{v.name}</span>
                    <span className="text-[9px] font-bold text-blue-500 uppercase mt-0.5">{v.role}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-black text-gray-400 bg-white border border-gray-100 px-2 py-1 rounded-lg block mb-1 uppercase">
                      {v.location}
                    </span>
                  </div>
                </div>
              ))}
              {visitors.length === 0 && (
                <div className="text-center py-20">
                   <p className="text-gray-300 font-bold uppercase text-[10px] tracking-widest">No live users found</p>
                </div>
              )}
            </div>

            {visitors.length > 0 && (
               <div className="mt-8 p-4 bg-[#00004d] rounded-2xl text-center shadow-xl shadow-blue-900/20">
                  <p className="text-white text-[10px] font-black tracking-[0.2em] uppercase">Current Traffic: {visitors.length}</p>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}