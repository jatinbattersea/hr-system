const mongoose = require("mongoose");

const LeaveSchema = mongoose.Schema(
    {
        name: {
            type: String,
        },
        email: {
            type: String,
        },
        employeeID: {
            type: String,
        },
        month: {
            type: String,
        },
        year: {
            type: String,
        },
        leaveType: {
            type: String,
        },
        reason: {
            type: String,
        },
        lastUpdated: {
            type: String,
        },
        leaveDates: {
            type: Array,
            default: [],
        },
        totalDays: {
            type: String,
        },
        status: {
            type: String,
        },
        approvedBy: {
            type: String,
            default: "N/A",
        },
        msg: {
            type: String,
        },
    },
    {
        timeStamps: true,
    }
);

const Leave = mongoose.model("Leave", LeaveSchema);

module.exports = Leave;