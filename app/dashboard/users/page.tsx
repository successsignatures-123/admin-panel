"use client";

import { useEffect, useState } from "react";
import { usersAPI } from "../../../services/api";
import { UserX, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

export default function UsersPage() {
  const [users, setUsers] = useState([]);

  const fetchUsers = () =>
    usersAPI.getAllUsers().then((res) => setUsers(res.data));

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggle = async (id: string, status: boolean) => {
    try {
      await usersAPI.toggleEmployerStatus(id, !status);
      toast.success("Status Updated");
      fetchUsers();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="p-3 sm:p-5 lg:p-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-[#00004d]">
          User Directory
        </h1>

        <p className="text-gray-400 text-sm mt-1">
          Manage all registered platform users
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {users.map((u: any) => (
          <div
            key={u._id}
            className="
              bg-white
              p-5 sm:p-6 lg:p-8
              rounded-3xl
              border border-gray-100
              shadow-sm
              hover:shadow-lg
              transition-all duration-300
              flex flex-col sm:flex-row
              sm:items-center
              sm:justify-between
              gap-5
            "
          >
            <div className="min-w-0">
              <h2 className="font-black text-[#00004d] text-lg sm:text-xl truncate">
                {u.name}
              </h2>

              <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                {u.role}
              </p>
            </div>
            {u.role === "employer" && (
              <button
                onClick={() => toggle(u._id, u.isApproved)}
                className={`
                  w-full sm:w-auto
                  px-5 py-3
                  rounded-2xl
                  font-black
                  text-[10px]
                  tracking-widest
                  flex items-center justify-center gap-2
                  transition-all duration-300
                  hover:scale-105
                  
                  ${
                    u.isApproved
                      ? "bg-green-50 text-green-600 border border-green-100"
                      : "bg-red-50 text-red-600 border border-red-100"
                  }
                `}
              >
                {u.isApproved ? (
                  <ShieldCheck size={16} />
                ) : (
                  <UserX size={16} />
                )}

                {u.isApproved ? "APPROVED" : "PENDING"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}