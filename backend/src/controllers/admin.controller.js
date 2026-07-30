import User from "../models/user.model.js";

// Get all pending account requests
export const getPendingUsers = async (req, res) => {
    try {
        const users = await User.find({
            status: "pending"
        })
        .select("-password")
        .sort({ createdAt: -1 });

        return res.status(200).json(users);

    } catch (error) {
        console.error("Error getting pending users:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};


// Approve a user
export const approveUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findByIdAndUpdate(
            userId,
            {
                status: "approved"
            },
            {
                new: true
            }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "User approved successfully",
            user
        });

    } catch (error) {
        console.error("Error approving user:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};


// Reject a user
export const rejectUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findByIdAndUpdate(
            userId,
            {
                status: "rejected"
            },
            {
                new: true
            }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "User rejected successfully",
            user
        });

    } catch (error) {
        console.error("Error rejecting user:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};