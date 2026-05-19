"use client";
import { useEffect, useState } from "react";
import { applicationsAPI } from "../../../services/api";
import toast from "react-hot-toast";
import { Eye, Search } from "lucide-react";
import Link from "next/link";

export default function ApplicationsPage() {
  const [apps, setApps] = useState([]);

  const fetchApps = async () => {
    try {
      const res = await applicationsAPI.getEmployerApplicants();
      setApps(res.data);
    } catch (err) {
      toast.error("Failed to load data");
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  return (
    <div className="p-3 sm:p-5 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-[#00004d]">Manage Applications</h1>
        <p className="text-gray-400 text-sm mt-1">Review applicant details and manage status</p>
      </div>

      <div className="hidden lg:block bg-white rounded-[2.5rem] shadow-sm border border-gray-50 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#f8fafc] border-b border-gray-100">
            <tr>
              <th className="p-6 text-[10px] font-black text-[#00004d] tracking-widest uppercase">Applicant</th>
              <th className="p-6 text-[10px] font-black text-[#00004d] tracking-widest uppercase">Target Job</th>
              <th className="p-6 text-[10px] font-black text-[#00004d] tracking-widest uppercase">Status</th>
              <th className="p-6 text-[10px] font-black text-[#00004d] tracking-widest uppercase text-center">View Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {apps.map((app: any) => (
              <tr key={app._id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-6">
                  <p className="font-bold text-[#00004d]">{app.fullName}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">{app.email}</p>
                </td>
                <td className="p-6 font-bold text-gray-600">{app.job?.title || "Direct Application"}</td>
                <td className="p-6">
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                    app.status === "shortlisted" ? "bg-green-50 text-green-600" : 
                    app.status === "rejected" ? "bg-red-50 text-red-600" : "bg-orange-50 text-orange-600"
                  }`}>
                    {app.status}
                  </span>
                </td>
                <td className="p-6">
                  <div className="flex justify-center">
                    <Link href={`/dashboard/applications/${app._id}`} className="p-2 bg-[#00004d] text-white rounded-xl hover:scale-110 transition-all shadow-lg shadow-blue-100">
                      <Eye size={18} />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid gap-4 lg:hidden">
        {apps.map((app: any) => (
          <div key={app._id} className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg text-[#00004d]">{app.fullName}</h3>
                <p className="text-xs text-gray-400">{app.email}</p>
              </div>
              <Link href={`/dashboard/applications/${app._id}`} className="p-3 bg-gray-100 rounded-2xl text-[#00004d]">
                <Eye size={20} />
              </Link>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase text-orange-600">{app.status}</span>
              <p className="text-xs font-bold text-gray-500">{app.job?.title || "Direct"}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}