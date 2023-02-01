const asyncHandler = require("express-async-handler");
const Leave = require("../models/leaveModel");
const Employee = require("../models/employeeModel");

// apply leave
const applyLeave = asyncHandler(async (req, res, next) => {
    try {
        const { name, email, employeeID, leaveType, reason, lastUpdated, leaveDates, totalDays, status, msg } = req.body;

        if (!name || !email || !employeeID || !leaveType || !reason || !leaveDates || !totalDays || !status) {
        return res.status(400).send("Please Enter all the Fields.");
    }
    
    const year = new Date().getFullYear();
    const month = new Date().getMonth();

    const leave = await Leave.create({
        name,
        email,
        employeeID,
        year,
        month,
        leaveType,
        reason,
        lastUpdated,
        leaveDates,
        totalDays,
        status,
        msg
    });

    if (leave) {
        res.status(201).send("Leave Applied successfully.");
    }
    } catch (error) {
       return res.status(500).send("Something went wrong."); 
    }
});

// manage application status
const manageApplicationStatus = asyncHandler(async (req, res) => {
    try {

        const leave = await Leave.findById(req.params.id);

        await Leave.findByIdAndUpdate(req.params.id, {
            lastUpdated: req.body.lastUpdated,
            status: req.body.status,
            approvedBy: req.body.approvedBy,
            msg: req.body.msg,
        });

        if (req.body.status === "Approved" && leave.status !== "Approved") {

            const employee = await Employee.findOne({ email: req.body.email });

            if (req.body.totalDays > employee.cl) {

                var leavesTaken = (employee.leavesTaken + (req.body.totalDays - employee.cl));
                var cl = 0;

                await Employee.updateOne({ email: req.body.email }, {
                    $set: {
                        cl,
                        leavesTaken,
                    }
                });
            } else {
                var cl = (employee.cl - req.body.totalDays);
                var leavesTaken = 0;

                await Employee.updateOne({ email: req.body.email }, {
                    $set: {
                        cl,
                        leavesTaken,
                    }
                });
            }
        }

        res.status(200).send(`Leave has been ${req.body.status}`);
    } catch (err) {
        console.log(err)
        return res.status(500).send(err);
    }
});

// Get Leaves
const getLeaves = asyncHandler(async (req, res) => {
    try {
        const leaves = await Leave.find({
            year: req.params.year,
            month: req.params.month,
        });

        res.status(200).json(leaves);
    } catch (err) {
        return res.status(500).json(err);
    }

});

// Get Leave
const getLeave = asyncHandler(async (req, res) => {
    try {
        const leave = await Leave.findById(req.params.id);

        res.status(200).json(leave);
    } catch (err) {
        return res.status(500).json(err);
    }

});

// delete leave
const deleteLeaves = asyncHandler(async (req, res) => {

    try {
        await Leave.deleteMany({
            year: req.params.year,
            month: req.params.month,
        });
        res.status(200).send(`Leave of requested month has been deleted`);
    } catch (err) {
        return res.status(500).send(err);
    }

});

module.exports = { applyLeave, manageApplicationStatus, getLeaves, getLeave, deleteLeaves };