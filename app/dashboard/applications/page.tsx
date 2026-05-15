"use client"
import { useEffect, useState } from 'react';
import { applicationsAPI } from '../../../services/api';
import { toast } from 'react-toastify';

export default function ApplicationsPage() {
    const [apps, setApps] = useState([]);

    const fetchApps = async () => {
        const res = await applicationsAPI.getAllApplications();
        setApps(res.data);
    };

    const handleAction = async (id: string, status: string) => {
        try {
            await applicationsAPI.updateApplicationStatus(id, status);
            toast.success(`Application ${status}`);
            fetchApps();
        } catch (error) {
            toast.error("Action failed");
        }
    };

    useEffect(() => { fetchApps(); }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Manage Applications</h1>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-100 border-b">
                        <tr>
                            <th className="p-4">Job Title</th>
                            <th className="p-4">Applicant</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {apps.map((app: any) => (
                            <tr key={app._id} className="border-b">
                                <td className="p-4">{app.job?.title || 'N/A'}</td>
                                <td className="p-4">{app.fullName}</td>
                                <td className="p-4 uppercase text-xs font-bold">{app.status}</td>
                                <td className="p-4 flex gap-2">
                                    <button onClick={() => handleAction(app._id, 'shortlisted')} className="bg-green-600 text-white px-3 py-1 rounded text-sm">Approve</button>
                                    <button onClick={() => handleAction(app._id, 'rejected')} className="bg-red-600 text-white px-3 py-1 rounded text-sm">Reject</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}