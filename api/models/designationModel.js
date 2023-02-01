const mongoose = require("mongoose");

const DesignationSchema = mongoose.Schema(
    {
        name: {
            type: String,
        },
        authorities: {
            type: Array,
            default: ["/", "/leaves", "/holidays", "/profile"]
        }
    },
    {
        timeStamps: true,
    },
);

const Designation = mongoose.model("Designation", DesignationSchema);

module.exports = { Designation, DesignationSchema };