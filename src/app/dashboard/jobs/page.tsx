"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { jobsAPI } from "../../../services/api";
import { Eye, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);

  const fetchJobs = () =>
    jobsAPI.getAllJobs().then((res) => setJobs(res.data));

  useEffect(() => {
    fetchJobs();
  }, []);

  const del = async (id: string) => {
    if (!confirm("Delete this listing?")) return;

    try {
      await jobsAPI.deleteJob(id);
      toast.success("Job Deleted");
      fetchJobs();
    } catch (err) {
      toast.error("Failed to delete job");
    }
  };

  return (
    <div className="p-3 sm:p-5 lg:p-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-[#00004d]">
          Manage All Jobs
        </h1>

        <p className="text-gray-400 text-sm mt-1">
          View and manage all job listings
        </p>
      </div>
      <div className="hidden lg:block bg-white rounded-[2.5rem] shadow-sm border border-gray-50 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-[10px] font-black uppercase tracking-widest text-[#00004d]">
            <tr>
              <th className="p-6">Job Title</th>
              <th className="p-6">Company</th>
              <th className="p-6 text-center">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {jobs.map((j: any) => (
              <tr
                key={j._id}
                className="hover:bg-slate-50 transition-colors font-bold text-gray-600"
              >
                <td className="p-6 text-[#00004d]">
                  {j.category}
                </td>

                <td className="p-6">
                  {j.company || "N/A"}
                </td>

                <td className="p-6">
                  <div className="flex justify-center gap-3">
                    <Link
                      href={`/dashboard/jobs/${j._id}`}
                      className="p-3 text-blue-500 hover:bg-blue-50 rounded-2xl transition-all"
                    >
                      <Eye size={20} />
                    </Link>
                    <button
                      onClick={() => del(j._id)}
                      className="p-3 text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid gap-4 lg:hidden">
        {jobs.map((j: any) => (
          <div
            key={j._id}
            className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100"
          >
            <div className="mb-4">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">
                Job Title
              </p>

              <h2 className="text-lg font-bold text-[#00004d]">
                {j.category}
              </h2>
            </div>
            <div className="mb-5">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">
                Company
              </p>

              <p className="font-semibold text-gray-700">
                {j.company || "N/A"}
              </p>
            </div>
            <button
              onClick={() => del(j._id)}
              className="w-full py-3 rounded-2xl bg-red-500 text-white flex items-center justify-center gap-2 font-bold hover:opacity-90 transition"
            >
              <Trash2 size={18} />
              Delete Job
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}