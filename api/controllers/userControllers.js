const asyncHandler = require("express-async-handler");
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const Employee = require("../models/employeeModel");
const User = require("../models/userModel");
const { Shift } = require("../models/shiftModel");
const { Designation } = require("../models/designationModel");
const { Team } = require("../models/teamModel");

// Add Member
const addMember = asyncHandler(async (req, res) => {
    try {
        const { name, email, phone, employeeID, password, doj, dob, designationName, teamName, profileImage, address, bankName, accNo, ifsc, shiftName } = req.body;

        if (!name || !email || !phone || !employeeID || !password || !doj || !dob || !designationName || !teamName || !address || !shiftName) {
            return res.status(400).send("Please Enter all the Feilds !");
        }

        const employeeExists = await User.findOne({ email, phone, employeeID });
        const shift = await Shift.findOne({ name: shiftName });
        const designation = await Designation.findOne({ name: designationName });
        const team = await Team.findOne({ name: teamName });

        if (employeeExists) {
            return res.status(409).send("User alerady exist.");
        }

        const employee = await Employee.create({
            name,
            email,
            phone,
            employeeID,
            password,
            address,
            dob,
            doj,
            profileImage,
            designation: {
                id: designation._id,
                name: designation.name,
            },
            team,
            bankName,
            accNo,
            ifsc,
            shift
        });

        if (employee) {

            await User.create({
                _id: employee._id,
                email,
                phone,
                employeeID,
                designation: {
                    id: designation._id,
                    name: designation.name,
                },
                password,
                authorizedPages: designation.authorities,
            });
            res.status(201).send("User created successfully.");
        }
    } catch (error) {
        res.status(500).send("Something went wrong.");
    }
})

// Get Members
const getMembers = asyncHandler(async (req, res) => {
    const filter = {};
    try {
        let all = await Employee.find(filter);

        // Prevent from getting admin details
        all = all.filter((doc) => {
            if (doc.designation.name?.toUpperCase() !== "ADMINISTRATOR") return doc
            return doc
        })

        res.status(200).json(all);
    } catch (error) {
        console.log(error);
    }
})

// Get User
const getUser = asyncHandler(async (req, res) => {
    const filter = { employeeID: req.params.employeeID };
    try {
        const user = await Employee.findOne(filter);
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
    }
})

const uploadFile = asyncHandler(async (req, res) => {
    try {
        return res.status(200).json(req.file.filename);
    } catch (error) {
        console.error(error);
    }
})

//update user
const updateUser = asyncHandler(async (req, res) => {
    try {
        await Employee.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        });

        await User.findByIdAndUpdate(req.params.id, {
            $set: {
                email: req.body.email,
                phone: req.body.phone,
                employeeID: req.body.employeeID,
                designation: req.body.designation,
                password: req.body.password,
            },
        });

        res.status(200).send("User has been updated");
    } catch (error) {
        return res.status(500).send(error);
    }
})

// Delete Profile Picture
const deleteProfilePicture = asyncHandler(async (req, res) => {
    try {
        await Employee.findByIdAndUpdate(req.params.id, {
            $set: {
                profileImage: "",
            },
        });

        res.status(200).send("Profile Picture has been Removed");
    } catch (error) {
        return res.status(500).send(error);
    }
})

//get User Specific Data
const getUserSpecificData = asyncHandler(async (req, res) => {
    try {
        const requestedData = await Employee.find().select({
            "employeeID": 1,
            "shift": 1,
        });

        res.status(200).json(requestedData);
    } catch (error) {
        return res.status(500).send(error);
    }
})

// Get User Offs
const getUserLeaves = asyncHandler(async (req, res) => {
    const filter = { employeeID: req.params.employeeID };
    try {
        const response = await Employee.findOne(filter).select({
            "cl": 1,
            "leavesTaken": 1,
            "_id": 0,
        });
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
    }
})


//change Password
const changePassword = asyncHandler(async (req, res) => {
    try {
        await Employee.findByIdAndUpdate(req.body.id, {
            $set: {
                password: req.body.confirmPassword,
            },
        });

        const id = new mongoose.Types.ObjectId();

        const accessToken = jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '30d'
        });

        await User.findByIdAndUpdate(req.body.id, {
            $set: {
                password: req.body.confirmPassword,
                tokens: [ { _id: id, token: accessToken, logged_at: new Date(Date.now())}]
            },
        });


        res.cookie('_goJwt', accessToken, { expires: new Date(Date.now() + 25892000000), overwrite: true });

        res.status(200).send("Password Changed Successfully!");
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
})

//delete user
const deleteUser = asyncHandler(async (req, res) => {
    try {
        await Employee.findByIdAndDelete(req.params.id);

        await User.findByIdAndDelete(req.params.id);

        res.status(200).send("User has been deleted");
    } catch (error) {
        return res.status(500).send(error);
    }
})
module.exports = { addMember, getMembers, getUser, updateUser, deleteUser, deleteProfilePicture, changePassword, getUserSpecificData, getUserLeaves, uploadFile };