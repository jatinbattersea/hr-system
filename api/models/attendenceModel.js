const mongoose = require("mongoose");
const DateSchema = mongoose.Schema(
    {
        timeIn: {
            type: String,
        },
        timeOut: {
            type: String,
        },
        day: {
            type: String,
        },
        status: {
            type: String,
        }
    }
);

const ScheduleSchema = mongoose.Schema(
    {
        date: {
            type: DateSchema,
        }
    },
    {
        strict: false
    }
);

const AttendenceSchema = mongoose.Schema(
    {
        employeeID: {
            type: String,
        },
        name: {
            type: String,
        },
        year: {
            type: String,
        },
        month: {
            type: Number,
        },
        schedule: {
            type: ScheduleSchema,
            required: true
        },
    },
    {
        timeStamps: true,
    }
);

const Attendence = mongoose.model("Attendence", AttendenceSchema);

module.exports = Attendence;

// ***************** Attendence JSON Format *****************
// {
//     _id: objectID(XXXXXXXXXXXX),
//     employeeID: XXXXXXXXXXXX,
//     name: "xyz",
//     year: "yyyy",
//     schedule: {
//         "dd/mm/yyyy": {
//             timeIn: "HH: MM: SS AM/ PM",
//             timeOut: "HH: MM:SS AM / PM"
//             day: "Mon",
//         },
//         ...
//      }
// }