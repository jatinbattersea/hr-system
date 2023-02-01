const asyncHandler = require("express-async-handler");
const { Shift } = require("../models/shiftModel");
const Employee = require("../models/employeeModel");

//get shifts
const getShifts = asyncHandler(async (req, res) => {

    try {
        const shifts = await Shift.find({});
        res.status(200).json(shifts);
    } catch (err) {
        res.status(500).json(err);
    }

});

// add shift
const addShift = asyncHandler(async (req, res, next) => {
    try {
        const { name, startTime, endTime } = req.body;

        if (!name || !startTime || !endTime) {
            return res.status(400).send("Please Enter all the Feilds !");
        }

        const shiftExists = await Shift.findOne({ name: name });

        if (shiftExists) {
            return res.status(409).send("Shift already exists !");
        }

        const shift = await Shift.create({
            name,
            startTime,
            endTime,
        });

        if (shift) {
            res.status(201).send("Shift generated successfully !");
        }
    } catch (error) {
        return res.status(500).send("Something went wrong !");
    }
});

//update shift
const updateShift = asyncHandler(async (req, res) => {
    try {

        await Shift.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        });

        await Employee.updateMany({
            "shift._id": req.params.id
        }, {
            $set: {
                "shift.name": req.body.name,
                "shift.startTime": req.body.startTime,
                "shift.endTime": req.body.endTime,
            }
        });

        res.status(200).send("Shift has been updated");
    } catch (err) {
        return res.status(500).json(err);
    }
})

// delete shift
const deleteShift = asyncHandler(async (req, res) => {

    try {

        await Employee.updateMany({
            "shift._id": req.params.id
        }, {
            $set: {
                shift: null
            }
        });

        await Shift.findByIdAndDelete(req.params.id);

        res.status(200).send("Shift has been deleted");
    } catch (err) {
        return res.status(500).json(err);
    }

});

module.exports = { getShifts, addShift, updateShift, deleteShift };