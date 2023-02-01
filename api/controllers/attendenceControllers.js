const asyncHandler = require("express-async-handler");
const fs = require("fs");
const xlstojson = require("xls-to-json-lc");
const xlsxtojson = require("xlsx-to-json-lc");
const Attendence = require("../models/attendenceModel");
const Leave = require("../models/leaveModel");
const { Holiday } = require("../models/holidayModel");
const moment = require('moment');
// add attendence
const addAttendence = asyncHandler(async (req, res, next) => {
    
    let status;
    let isOnLeave;
    let employeeLeavesArray = [];
    var exceltojson;
    //  Multer gives us file info in req.file object 
    if (!req.file) {
        res.json({ error_code: 1, err_desc: "No file passed" });
        return;
    }
    // Check the extension of the incoming file and use the appropriate module
    if (
        req.file.originalname.split(".")[
        req.file.originalname.split(".").length - 1
        ] === "xlsx"
    ) {
        exceltojson = xlsxtojson;
    } else {
        exceltojson = xlstojson;
    }
    
    try {

        const holidaysArray = await Holiday.find().select({
            "date": 1,
        });

        const leavesArray = await Leave.find({
            year: req.body.year,
            month: req.body.month - 1,
            status: "Approved",
        }).select({
            "leaveDates": 1,
            "employeeID": 1,
            "_id": 0,
        });

        exceltojson(
            {
                input: req.file.path,
                output: null, //since we don't need output.json
                lowerCaseHeaders: true,
            },
            function (err, result) {
                if (err) {
                    return res.json({ error_code: 1, err_desc: err, data: null });
                }

                const year = req.body.year;
                const month = req.body.month;
                let tempIds = [];
                result.map((d) => {
                    if (!tempIds.includes(d.employeeid)) {
                        tempIds.push(d.employeeid);
                    }
                });

                for (i = 0; i < tempIds.length; i++) {

                    let schedule = {};

                    let tempData = result.filter((row) => {
                        return row.employeeid == tempIds[i];
                    });

                    if (tempData != "") {

                        let name = tempData[0].name;
                        let employeeID = tempData[0].employeeid;

                        leavesArray.forEach((leave) => {
                            if (leave.employeeID === employeeID && leave) {
                                leave.leaveDates.forEach((leaveDay) => {
                                    employeeLeavesArray.push(leaveDay);
                                })
                            }
                        });


                        tempData.map((d) => {
                            
                            if (d["time-in"] !== "00:00 AM" || d["time-out"] !== "00:00 PM") {
                                status = "working";
                            } else {
                                const isHoliday = holidaysArray.find((holiday) => {
                                    const dateDiff = moment(holiday.date).diff(moment(moment(d.date)), 'days');

                                    if (dateDiff === 0) {
                                        return true;
                                    } else {
                                        return false;
                                    }

                                });

                                if (isHoliday) {
                                    status = "holiday";
                                } else {
                                    
                                    if (employeeLeavesArray.length > 0) {
                                        isOnLeave = employeeLeavesArray.find((leaveDay) => {
                                            const dateDiff = moment(leaveDay).diff(moment(moment(d.date)), 'days');
                                            if (dateDiff === 0) {
                                                return true;
                                            } else {
                                                return false;
                                            }

                                        });
                                    }

                                    if (isOnLeave) {
                                        status = "Leave";
                                    } else if (d["day"].toUpperCase() === "SAT" || d["day"].toUpperCase() === "SUN") {
                                        status = "week off";
                                    } else {
                                        status = "N/A";
                                    }
                                }
                            }

                            schedule[d.date] = {
                                timeIn: d["time-in"],
                                timeOut: d["time-out"],
                                day: d["day"],
                                status,
                            }
                        });

                        const AttendenceDoc = new Attendence({
                            employeeID,
                            name,
                            year,
                            month,
                            schedule,
                        });

                        AttendenceDoc.save((err, cust) => {
                            if (err) return console.error(err);
                        });
                        
                    }
                }
                res.status(200).json({
                    dataUpdated: true
                });
                try {
                    fs.unlinkSync(req.file.path);
                } catch (e) {
                    console.log(e)
                }
            }
        );
    } catch (e) {
        console.log(e)
        res.json({ error_code: 1, err_desc: "Corupted excel file" });
    }

});

//get attendence
const getAttendence = asyncHandler(async (req, res) => {

    try {
        const attendence = await Attendence.find({
            year: req.params.year,
            month: req.params.month,
        });
        res.status(200).json(attendence);
    } catch (err) {
        res.status(500).json(err);
    }

});

const getEmployeeAttendence = asyncHandler(async (req, res) => {

    try {
        const attendence = await Attendence.find({
            employeeID: req.params.employeeId,
            year: req.params.year,
            month: req.params.month,
        });
        res.status(200).json(attendence);
    } catch (error) {
        res.status(500).json(err);
    }
});

//update attendence
const updateAttendence = asyncHandler(async (req, res) => {
    const date = req.body.date;
    try {
        await Attendence.updateOne({
            employeeID: req.body.employeeId,
            year: req.body.year,
            month: req.body.month,
        }, {
            $set: {
                ["schedule." + date + ".timeIn"]: req.body.timeIn,
                ["schedule." + date + ".timeIn"]: req.body.timeIn,
                ["schedule." + date + ".status"]: req.body.status,
            }
        });
        res.status(200).send(`Attendances has been updated`);
    } catch (err) {
        res.status(500).json(err);
        console.log(err)
    }

});

// delete Attendence
const deleteAttendence = asyncHandler(async (req, res) => {

    try {
        await Attendence.deleteMany({
            year: req.params.year,
            month: req.params.month,
        });
        res.status(200).send(`Attendances of requested month ${req.params.month} has been deleted`);
    } catch (err) {
        return res.status(500).send(err);
    }

});

module.exports = { addAttendence, updateAttendence, getAttendence, getEmployeeAttendence, deleteAttendence };