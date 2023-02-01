const mongoose = require("mongoose");

const TeamSchema = mongoose.Schema(
    {
        name: {
            type: String,
        },
    },
    {
        timeStamps: true,
    }
);

const Team = mongoose.model("Team", TeamSchema);

module.exports = { Team, TeamSchema };