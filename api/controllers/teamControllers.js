const asyncHandler = require("express-async-handler");
const { Team } = require("../models/teamModel");
const Employee = require("../models/employeeModel");

//get Teams
const getTeams = asyncHandler(async (req, res) => {

    try {
        const teams = await Team.find({});
        res.status(200).json(teams);
    } catch (err) {
        res.status(500).json(err);
    }

});

// add team
const addTeam = asyncHandler(async (req, res, next) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).send("Please Enter the Name of Team !");
        }

        const teamExists = await Team.findOne({ name: name });

        if (teamExists) {
            return res.status(409).send("Team already exists !");
        }

        const team = await Team.create({
            name,
        });

        if (team) {
            res.status(201).send("Team generated successfully !");
        }
    } catch (error) {
        res.status(500).send("Something went wrong !");
    }
});

//update team
const updateTeam = asyncHandler(async (req, res) => {
    try {
        await Team.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        });

        await Employee.updateMany({
            "team._id": req.params.id
        }, {
            $set: {
                "team.name": req.body.name,
            }
        })

        res.status(200).send("Team has been updated");
    } catch (err) {
        return res.status(500).send(err);
    }
})

// delete team
const deleteTeam = asyncHandler(async (req, res) => {

    try {

        await Employee.updateMany({
            "team._id": req.params.id
        }, {
            $set: {
                team: null
            }
        })

        await Team.findByIdAndDelete(req.params.id);
        res.status(200).send("Team has been deleted");
    } catch (err) {
        return res.status(500).send(err);
    }

});

module.exports = { getTeams, addTeam, updateTeam, deleteTeam };