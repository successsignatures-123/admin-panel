"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { applicationsAPI } from "../../../../services/api";
import toast from "react-hot-toast";
import { ArrowLeft, Phone, Mail, MapPin, GraduationCap } from "lucide-react";

export default function ApplicationDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [app, setApp] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDetails = async () => {
    try {
      const res = await applicationsAPI.getSingleApplication(id as string);
      setApp(res.data);
    } catch (err) {
      toast.error("Application not found");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (status: string) => {
    try {
      await applicationsAPI.updateApplicationStatus(id as string, status);
      toast.success(`Application ${status}`);
      fetchDetails();
    } catch (err) {
      toast.error("Action failed");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this application permanently?")) return;
    try {
      await applicationsAPI.deleteApplication(id as string);
      toast.success("Deleted successfully");
      router.push("/dashboard/applications");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  useEffect(() => { fetchDetails(); }, [id]);

  if (loading) return <div className="p-10 text-center">Loading details...</div>;
  if (!app) return <div className="p-10 text-center text-red-500">Not Found</div>;

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 mb-6 hover:text-[#00004d]">
        <ArrowLeft size={20} /> Back to List
      </button>

      <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-[#00004d] p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-5">
            <img src={app.image || "/avatar-placeholder.png"} className="w-24 h-24 rounded-3xl object-cover border-4 border-white/20" alt="Profile" />
            <div>
              <h1 className="text-3xl font-black">{app.fullName}</h1>
              <p className="opacity-80 font-medium">{app.category} | {app.jobtype}</p>
            </div>
          </div>
          <div className="flex gap-3">
             <button onClick={() => handleAction("shortlisted")} className="bg-green-500 p-4 rounded-2xl hover:bg-green-600 transition shadow-lg">Accept</button>
             <button onClick={() => handleAction("rejected")} className="bg-orange-500 p-4 rounded-2xl hover:bg-orange-600 transition shadow-lg">Reject</button>
             <button onClick={handleDelete} className="bg-red-600 p-4 rounded-2xl hover:bg-red-700 transition shadow-lg">Delete</button>
          </div>
        </div>

        <div className="p-8 grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <section>
              <h2 className="text-[#00004d] font-black uppercase tracking-widest text-xs mb-4">Contact Details</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-600"><Mail size={18}/> {app.email}</div>
                <div className="flex items-center gap-3 text-gray-600"><Phone size={18}/> {app.phone} (WhatsApp: {app.whatsapp})</div>
                <div className="flex items-center gap-3 text-gray-600"><MapPin size={18}/> {app.city}, {app.country}</div>
              </div>
            </section>

            <section>
              <h2 className="text-[#00004d] font-black uppercase tracking-widest text-xs mb-4">Education & Skills</h2>
              <div className="p-4 bg-gray-50 rounded-2xl">
                <div className="flex gap-3 mb-2"><GraduationCap className="text-[#00004d]"/> <p className="font-bold">{app.education}</p></div>
                <p className="text-sm text-gray-500">Salary Demand: <span className="font-bold text-[#00004d]">{app.salaryDemand}</span></p>
              </div>
            </section>
          </div>

          <div>
            <h2 className="text-[#00004d] font-black uppercase tracking-widest text-xs mb-4">Work Experience</h2>
            {app.isFresher ? (
              <p className="text-gray-400 italic">Fresher (No experience yet)</p>
            ) : (
              <div className="space-y-4">
                {app.experience?.map((exp: any, i: number) => (
                  <div key={i} className="border-l-4 border-[#00004d] pl-4 py-1">
                    <p className="font-black text-gray-800">{exp.designation}</p>
                    <p className="text-sm text-gray-500">{exp.companyName}</p>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-8">
              <h2 className="text-[#00004d] font-black uppercase tracking-widest text-xs mb-4">Achievements</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{app.achievements || "No achievements mentioned."}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}