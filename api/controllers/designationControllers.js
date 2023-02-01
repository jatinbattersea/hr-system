const asyncHandler = require("express-async-handler");
const { Designation } = require("../models/designationModel");
const Employee = require("../models/employeeModel");
const User = require("../models/userModel");

//get designations
const getDesignations = asyncHandler(async (req, res) => {

    try {
        const designations = await Designation.find({});
        res.status(200).json(designations);
    } catch (err) {
        res.status(500).json(err);
    }

});

// add designation
const addDesignation = asyncHandler(async (req, res, next) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).send("Please Enter the Name of Designation !");
        }

        const designationExists = await Designation.findOne({ name: name });

        if (designationExists) {
            return res.status(409).send("Designation already exists !");
        }

        const designation = await Designation.create({
            name,
        });

        if (designation) {
            res.status(201).send("Designation generated successfully !");
        }
    } catch (error) {
        return res.status(500).send("Something went wrong !");
    }
});

//update designation
const updateDesignation = asyncHandler(async (req, res) => {
    try {
        await Designation.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        });

        await Employee.updateMany({
            "designation.id": req.params.id
        }, {
            $set: {
                "designation.name": req.body.name,
            }
        })

        await User.updateMany({
            "designation.id": req.params.id
        }, {
            $set: {
                "designation.name": req.body.name,
            }
        })

        res.status(200).send("Designation has been updated");
    } catch (err) {
        return res.status(500).send(err);
    }
})

//update designation
const updateAuthorities = asyncHandler(async (req, res) => {
    let roles = {};
    const dataObject = req.body;
    for (const property in dataObject) {
        if (dataObject[property] !== null) {
            dataObject[property].forEach((item) => {
                if (!(item.value in roles)) {
                    (property === "dashboard") ? (roles[item.value] = ["/"]) :( roles[item.value] = ["/" + property]);
                } else {
                    (property === "dashboard") ? (roles[item.value].push("/")) :
                        (roles[item.value].push(("/" + property)));
                }
            })
        }
    }
    try {
        for (const role in roles) {
            await Designation.findByIdAndUpdate(role, {
                $set: {
                    authorities: roles[role], 
                },
            });

            await User.updateMany({
                "designation.id": role
            }, {
                $set: {
                    authorizedPages: roles[role],
                }
            });
        }

        res.status(200).send("Authorities has been updated");
    } catch (err) {
        return res.status(500).send(err);
    }
})

// delete designation
const deleteDesignation = asyncHandler(async (req, res) => {

    try {

        await Employee.updateMany({
            "designation.id": req.params.id
        }, {
            $set: {
                designation: null,
            }
        })

        await User.updateMany({
            "designation.id": req.params.id
        }, {
            $set: {
                designation: null,
            }
        })

        await Designation.findByIdAndDelete(req.params.id);
        res.status(200).send("Designation has been deleted");
    } catch (err) {
        return res.status(500).send(err);
    }

});

module.exports = { getDesignations, addDesignation, updateDesignation, updateAuthorities, deleteDesignation };