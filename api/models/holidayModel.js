const mongoose = require("mongoose");

const HolidaySchema = mongoose.Schema(
    {
        name: {
            type: String,
        },
        date: {
            type: String,
        },
        description: {
            type: String,
        },
    },
    {
        timeStamps: true,
    }
);

const Holiday = mongoose.model("Holiday", HolidaySchema);

module.exports = { Holiday };