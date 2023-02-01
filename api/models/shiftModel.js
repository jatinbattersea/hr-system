const mongoose = require("mongoose");

const ShiftSchema = mongoose.Schema(
    {
        name: {
            type: String,
        },
        startTime: {
            type: String,
        },
        endTime: {
            type: String,
        },
    },
    {
        timeStamps: true,
    }
);

const Shift = mongoose.model("Shift", ShiftSchema);

module.exports = {Shift, ShiftSchema};