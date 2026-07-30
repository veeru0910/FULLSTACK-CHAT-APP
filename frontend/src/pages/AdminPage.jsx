import React, { useEffect, useState } from "react";
import { Check, X, Bell, Loader2, User } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios";
import { useAuthStore } from "../store/useAuthStore";

const AdminPage = () => {
  const { authUser } = useAuthStore();

  const [pendingUsers, setPendingUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const fetchPendingUsers = async () => {
    try {
      setIsLoading(true);

      const res = await axiosInstance.get(
        "/admin/pending-users"
      );

      setPendingUsers(res.data);
    } catch (error) {
      console.error("Error loading requests:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to load account requests"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (authUser) {
      fetchPendingUsers();
    }
  }, [authUser]);

  const handleApprove = async (userId) => {
    try {
      setProcessingId(userId);

      await axiosInstance.put(
        `/admin/approve/${userId}`
      );

      setPendingUsers((prev) =>
        prev.filter((user) => user._id !== userId)
      );

      toast.success("Account approved successfully");

    } catch (error) {
      console.error("Approve error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to approve account"
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (userId) => {
    try {
      setProcessingId(userId);

      await axiosInstance.put(
        `/admin/reject/${userId}`
      );

      setPendingUsers((prev) =>
        prev.filter((user) => user._id !== userId)
      );

      toast.success("Account rejected");

    } catch (error) {
      console.error("Reject error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to reject account"
      );
    } finally {
      setProcessingId(null);
    }
  };

  // Extra frontend protection
  if (
    !authUser ||
    authUser.email !==
      "veerendralolla5868@gmail.com"
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">

          <X className="size-16 mx-auto text-error mb-4" />

          <h1 className="text-2xl font-bold">
            Access Denied
          </h1>

          <p className="text-base-content/60 mt-2">
            You don't have permission to access this page.
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">

      <div className="max-w-3xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-8">

          <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Bell className="size-6 text-primary" />
          </div>

          <div>
            <h1 className="text-2xl font-bold">
              Account Requests
            </h1>

            <p className="text-base-content/60">
              Approve or reject new users
            </p>
          </div>

        </div>


        {/* LOADING */}
        {isLoading ? (
          <div className="flex justify-center py-20">

            <Loader2 className="size-10 animate-spin" />

          </div>
        ) : pendingUsers.length === 0 ? (

          /* NO REQUESTS */
          <div className="card bg-base-200 shadow-sm">

            <div className="card-body items-center text-center py-16">

              <Bell className="size-12 opacity-40" />

              <h2 className="text-xl font-semibold mt-3">
                No pending requests
              </h2>

              <p className="text-base-content/60">
                New account requests will appear here.
              </p>

            </div>

          </div>

        ) : (

          /* USER REQUESTS */
          <div className="space-y-4">

            {pendingUsers.map((user) => (

              <div
                key={user._id}
                className="card bg-base-200 shadow-sm"
              >

                <div className="card-body">

                  <div className="flex items-center gap-4">

                    {/* PROFILE */}
                    <div className="avatar">

                      <div className="size-14 rounded-full">

                        {user.profilePic ? (

                          <img
                            src={user.profilePic}
                            alt={user.fullName}
                          />

                        ) : (

                          <div className="size-full rounded-full bg-primary/10 flex items-center justify-center">

                            <User className="size-7 text-primary" />

                          </div>

                        )}

                      </div>

                    </div>


                    {/* USER INFO */}
                    <div className="flex-1 min-w-0">

                      <h2 className="font-semibold text-lg">
                        {user.fullName}
                      </h2>

                      <p className="text-sm text-base-content/60 truncate">
                        {user.email}
                      </p>

                      <p className="text-xs text-base-content/50 mt-1">
                        Request pending
                      </p>

                    </div>


                    {/* BUTTONS */}
                    <div className="flex gap-2">

                      <button
                        className="btn btn-success btn-sm"
                        disabled={processingId === user._id}
                        onClick={() =>
                          handleApprove(user._id)
                        }
                      >

                        {processingId === user._id ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Check className="size-4" />
                        )}

                        <span className="hidden sm:inline">
                          Accept
                        </span>

                      </button>


                      <button
                        className="btn btn-error btn-sm"
                        disabled={processingId === user._id}
                        onClick={() =>
                          handleReject(user._id)
                        }
                      >

                        <X className="size-4" />

                        <span className="hidden sm:inline">
                          Reject
                        </span>

                      </button>

                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
};

export default AdminPage;