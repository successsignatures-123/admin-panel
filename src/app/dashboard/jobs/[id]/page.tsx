"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { jobsAPI } from "../../../../services/api";
import { CheckCircle, XCircle, ArrowLeft, Briefcase, MapPin, DollarSign, GraduationCap, NotebookPen } from "lucide-react";
import toast from "react-hot-toast";

export default function JobDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      const res = await jobsAPI.getJobById(id as string);
      setJob(res.data);
    } catch (err) {
      toast.error("Failed to load job details");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      await jobsAPI.updateJobStatus(id as string, newStatus);
      toast.success(`Job status updated to ${newStatus}`);
      fetchJobDetails();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!job) return <div className="p-10 text-center">Job not found</div>;

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto">
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-500 hover:text-black mb-6 transition"
      >
        <ArrowLeft size={20} /> Back to Jobs
      </button>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 sm:p-10 border-b border-gray-50 bg-slate-50/50">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                job.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}>
                {job.status}
              </span>
              <h1 className="text-3xl font-black text-[#00004d] mt-3">{job.category}</h1>
              <p className="text-gray-500 font-semibold flex items-center gap-2 mt-1">
                {job.company} • <MapPin size={16} /> {job.city}
              </p>
            </div>
            
            <div className="flex gap-3 w-full md:w-auto">
              <button
                onClick={() => handleStatusUpdate('pending')}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-yellow-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-yellow-700 transition shadow-lg shadow-yellow-100"
              >
                <NotebookPen size={18} /> Pending
              </button>
              <button
                onClick={() => handleStatusUpdate('active')}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-green-700 transition shadow-lg shadow-green-100"
              >
                <CheckCircle size={18} /> Approve
              </button>
              <button
                onClick={() => handleStatusUpdate('closed')}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-red-500 text-white px-6 py-3 rounded-2xl font-bold hover:bg-red-600 transition shadow-lg shadow-red-100"
              >
                <XCircle size={18} /> Cancel Job
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <div>
              <h3 className="text-lg font-bold text-[#00004d] mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {job.description || "No description provided."}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#00004d] mb-3">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills?.map((skill: string, index: number) => (
                  <span key={index} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-3xl space-y-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm text-blue-500">
                <DollarSign size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Salary</p>
                <p className="font-bold text-[#00004d]">{job.salary || "Not Mentioned"}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm text-purple-500">
                <Briefcase size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Job Type</p>
                <p className="font-bold text-[#00004d]">{job.type}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm text-orange-500">
                <GraduationCap size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Education</p>
                <p className="font-bold text-[#00004d]">{job.education}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Posted By</p>
              <p className="text-sm font-bold text-gray-700">{job.postedBy?.name}</p>
              <p className="text-xs text-gray-500">{job.postedBy?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}