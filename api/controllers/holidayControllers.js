const asyncHandler = require("express-async-handler");
const { Holiday } = require("../models/holidayModel");
const moment = require('moment');
//get Holidays
const getHolidays = asyncHandler(async (req, res) => {

    try {
        const holidays = await Holiday.find({});
        res.status(200).json(holidays);
    } catch (err) {
        res.status(500).json(err);
    }

});

//get Up Coming Holiday
const getUpComingHoliday = asyncHandler(async (req, res) => {

    try {
        const datesToBeChecked = await Holiday.find({});

        const date = new Date();

        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        // This arrangement can be altered based on how we want the date's format to appear.
        let dateToCheckFor = `${year}-${month}-${day}`;

        let nearestDate = {
            name: "",
            date: "",
        };

        datesToBeChecked.forEach(holiday => {
            let diff = moment(holiday.date).diff(moment(dateToCheckFor), 'days');
            if (diff > 0) {
                if (nearestDate.date) {
                    if (moment(holiday.date).diff(moment(nearestDate.date), 'days') < 0) {
                        nearestDate = {
                            name: holiday.name,
                            date: holiday.date,
                        };
                    }
                } else {
                    nearestDate = {
                        name: holiday.name,
                        date: holiday.date,
                    };
                }
            }
        });

        res.status(200).json(nearestDate);
        
    } catch (err) {
        res.status(500).json(err);
    }

});

// add Holiday
const addHoliday = asyncHandler(async (req, res, next) => {
    try {
        const { name, date, description } = req.body;

        if (!name || !date || !description) {
            return res.status(400).send("Please Enter all the Feilds !");
        }

        const holidayExists = await Holiday.findOne({ date: date });

        if (holidayExists) {
            return res.status(409).send("Holiday already exists !");
        }

        const holiday = await Holiday.create({
            name,
            date,
            description,
        });

        if (holiday) {
            res.status(201).send("Holiday generated successfully !");
        }
    } catch (error) {
        return res.status(500).send("Something went wrong !");
    }
});

//update Holiday
const updateHoliday = asyncHandler(async (req, res) => {
    try {
        await Holiday.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        });

        res.status(200).send("Holiday has been updated");
    } catch (err) {
        return res.status(500).send(err);
    }
})

// delete Holiday
const deleteHoliday = asyncHandler(async (req, res) => {

    try {
        await Holiday.findByIdAndDelete(req.params.id);
        res.status(200).send("Holiday has been deleted");
    } catch (err) {
        return res.status(500).send(err);
    }

});

module.exports = { getHolidays, getUpComingHoliday, addHoliday, updateHoliday, deleteHoliday };