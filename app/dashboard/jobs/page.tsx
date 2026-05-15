"use client"
import { useEffect, useState } from 'react';
import { jobsAPI } from '../../../services/api';
import { Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

export default function JobsPage() {
    const [jobs, setJobs] = useState([]);

    const fetchJobs = async () => {
        const res = await jobsAPI.getAllJobs();
        setJobs(res.data);
    };

    const deleteJob = async (id: string) => {
        if(confirm("Are you sure you want to delete this job?")) {
            await jobsAPI.deleteJob(id);
            toast.success("Job deleted successfully");
            fetchJobs();
        }
    };

    useEffect(() => { fetchJobs(); }, []);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Manage All Jobs</h2>
            <div className="bg-white shadow rounded-xl overflow-hidden border">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4">Title</th>
                            <th className="p-4">Employer</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.map((job: any) => (
                            <tr key={job._id} className="border-b hover:bg-gray-50">
                                <td className="p-4 font-medium">{job.title}</td>
                                <td className="p-4 text-gray-600">{job.employerId?.name || 'N/A'}</td>
                                <td className="p-4">
                                    <button onClick={() => deleteJob(job._id)} className="text-red-500 hover:bg-red-50 p-2 rounded-full transition">
                                        <Trash2 size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}