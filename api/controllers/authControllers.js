const asyncHandler = require("express-async-handler");
const Employee = require("../models/employeeModel");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');

// Login
const loginUser = asyncHandler(async (req, res) => {
    try {
        const employee = await Employee.findOne({
            employeeID: req.body.id
        });
        const user = await User.findOne({
            employeeID: req.body.id
        });
        const match = (req.body.password === employee.password);
        if (!match) return res.status(400).json("Invalid Credentials");
        const id = new mongoose.Types.ObjectId();
        console.log(id)
        const accessToken = jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '30d'
        });

        await User.updateOne({
            employeeID: req.body.id
        }, { $push: { tokens: { _id: id, token: accessToken, logged_at: new Date(Date.now())} } })

        res.cookie('_goJwt', accessToken, { expires: new Date(Date.now() + 25892000000) });
        res.json({ ...employee, authorizedPages: user.authorizedPages });
    } catch (error) {
        console.log(error)
        res.status(500).json("User not found");
    }
})

module.exports = { loginUser };