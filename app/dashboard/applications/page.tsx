"use client";

import { useEffect, useState } from "react";
import { applicationsAPI } from "../../../services/api";
import toast from "react-hot-toast";
import { Check, X } from "lucide-react";

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

  const handleAction = async (id: string, status: string) => {
    try {
      await applicationsAPI.updateApplicationStatus(id, status);
      toast.success(`Marked as ${status}`);
      fetchApps();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  return (
    <div className="p-3 sm:p-5 lg:p-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-[#00004d]">
          Manage Applications
        </h1>

        <p className="text-gray-400 text-sm mt-1">
          Review and manage all job applications
        </p>
      </div>

      <div className="hidden lg:block bg-white rounded-[2.5rem] shadow-[0_15px_40px_rgba(0,0,0,0.03)] border border-gray-50 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#f8fafc] border-b border-gray-100">
            <tr>
              <th className="p-6 text-[10px] font-black text-[#00004d] tracking-widest uppercase">
                Applicant Info
              </th>

              <th className="p-6 text-[10px] font-black text-[#00004d] tracking-widest uppercase">
                Current Status
              </th>

              <th className="p-6 text-[10px] font-black text-[#00004d] tracking-widest uppercase text-center">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {apps.map((app: any) => (
              <tr
                key={app._id}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <td className="p-6">
                  <p className="font-bold text-[#00004d]">
                    {app.fullName}
                  </p>

                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                    {app.email}
                  </p>
                </td>

                <td className="p-6 font-bold text-gray-600">
                  {app.job?.title || "Job Deleted"}
                </td>

                <td className="p-6">
                  <span
                    className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider
                    ${
                      app.status === "shortlisted"
                        ? "bg-green-50 text-green-600"
                        : app.status === "rejected"
                        ? "bg-red-50 text-red-600"
                        : "bg-orange-50 text-orange-600"
                    }`}
                  >
                    {app.status}
                  </span>
                </td>

                <td className="p-6">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() =>
                        handleAction(app._id, "shortlisted")
                      }
                      className="p-2 bg-[#5DBB63] text-white rounded-xl shadow-lg shadow-green-100 hover:scale-110 transition-all"
                    >
                      <Check size={18} />
                    </button>

                    <button
                      onClick={() =>
                        handleAction(app._id, "rejected")
                      }
                      className="p-2 bg-red-500 text-white rounded-xl shadow-lg shadow-red-100 hover:scale-110 transition-all"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid gap-4 lg:hidden">
        {apps.map((app: any) => (
          <div
            key={app._id}
            className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100"
          >
            <div className="mb-4">
              <h3 className="font-bold text-lg text-[#00004d]">
                {app.fullName}
              </h3>

              <p className="text-xs text-gray-400 break-all">
                {app.email}
              </p>
            </div>
            <div className="mb-4">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">
                Target Job
              </p>

              <p className="font-semibold text-gray-700">
                {app.job?.title || "Job Deleted"}
              </p>
            </div>
            <div className="mb-5">
              <span
                className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider
                ${
                  app.status === "shortlisted"
                    ? "bg-green-50 text-green-600"
                    : app.status === "rejected"
                    ? "bg-red-50 text-red-600"
                    : "bg-orange-50 text-orange-600"
                }`}
              >
                {app.status}
              </span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() =>
                  handleAction(app._id, "shortlisted")
                }
                className="flex-1 py-3 bg-[#5DBB63] text-white rounded-2xl flex items-center justify-center gap-2 font-bold hover:opacity-90 transition"
              >
                <Check size={18} />
                Approve
              </button>

              <button
                onClick={() =>
                  handleAction(app._id, "rejected")
                }
                className="flex-1 py-3 bg-red-500 text-white rounded-2xl flex items-center justify-center gap-2 font-bold hover:opacity-90 transition"
              >
                <X size={18} />
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}