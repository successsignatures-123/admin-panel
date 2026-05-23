"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { jobsAPI } from "../../../services/api";
import { Eye, Trash2} from "lucide-react";
import toast from "react-hot-toast";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await jobsAPI.getAllJobs();
      setJobs(res.data);
    } catch (err) {
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const del = async (id: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;

    try {
      await jobsAPI.deleteJob(id);
      toast.success("Job Deleted Successfully");
      fetchJobs();
    } catch (err) {
      toast.error("Failed to delete job");
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "closed":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="p-3 sm:p-5 lg:p-8 bg-[#f8fafc] min-h-screen">
      <div className="mb-6 sm:mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#00004d]">
            Manage All Jobs
          </h1>
          <p className="text-gray-400 text-sm mt-1 font-medium">
            View and manage all job listings and approvals
          </p>
        </div>
        <div className="text-[#00004d] font-bold text-sm bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100">
            Total Jobs: {jobs.length}
        </div>
      </div>

      <div className="hidden lg:block bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <tr>
              <th className="p-6">Job Title</th>
              <th className="p-6">Company</th>
              <th className="p-6">Status</th>
              <th className="p-6 text-center">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {jobs.map((j: any) => (
              <tr
                key={j._id}
                className="hover:bg-slate-50/50 transition-colors font-bold text-gray-600"
              >
                <td className="p-6">
                  <span className="text-[#00004d] font-extrabold">{j.category}</span>
                  <div className="text-[10px] text-gray-400 font-medium">{j.designation}</div>
                </td>

                <td className="p-6">
                  {j.companyName || j.company || "N/A"}
                </td>

                <td className="p-6">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusStyles(j.status)}`}>
                    {j.status || "Pending"}
                  </span>
                </td>

                <td className="p-6">
                  <div className="flex justify-center gap-2">
                    <Link
                      href={`/dashboard/jobs/${j._id}`}
                      className="p-3 text-blue-500 hover:bg-blue-50 rounded-2xl transition-all"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </Link>
                    <button
                      onClick={() => del(j._id)}
                      className="p-3 text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                      title="Delete Job"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {jobs.length === 0 && !loading && (
            <div className="p-20 text-center text-gray-400 font-bold">No jobs found.</div>
        )}
      </div>
      <div className="grid gap-4 lg:hidden">
        {jobs.map((j: any) => (
          <div
            key={j._id}
            className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 px-4 py-1 rounded-bl-2xl text-[9px] font-black uppercase tracking-widest ${getStatusStyles(j.status)}`}>
              {j.status}
            </div>
            
            <div className="mb-4 mt-2">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">
                Job Title
              </p>
              <h2 className="text-lg font-black text-[#00004d]">
                {j.category}
              </h2>
            </div>

            <div className="mb-6">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">
                Company
              </p>
              <p className="font-bold text-gray-700">
                {j.companyName || j.company || "N/A"}
              </p>
            </div>

            <div className="flex gap-2">
                <Link
                  href={`/dashboard/jobs/${j._id}`}
                  className="flex-1 py-3 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center gap-2 font-black text-xs transition active:scale-95"
                >
                  <Eye size={16} /> View
                </Link>
                <button
                  onClick={() => del(j._id)}
                  className="flex-1 py-3 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center gap-2 font-black text-xs transition active:scale-95"
                >
                  <Trash2 size={16} /> Delete
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}