const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const dotenv = require("dotenv");
const nodeCron = require('node-cron');
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const attendenceRoutes = require("./routes/attendenceRoutes");
const shiftRoutes = require("./routes/shiftRoutes");
const designationRoutes = require("./routes/designationRoutes");
const teamRoutes = require("./routes/teamRoutes");
const holidayRoutes = require("./routes/holidayRoutes");
const leaveRoutes = require("./routes/leaveRoutes");
const authRoutes = require("./routes/authRoutes");
const verifyToken = require("./middlewares/VerifyToken");
const Employee = require("./models/employeeModel");

dotenv.config();
connectDB();
const app = express();

app.use(express.json()); // to accept json data

app.use(bodyParser.urlencoded({ extended: false }));

// Cron Job
nodeCron.schedule("0 0 1 * *", async function() {
    try {
        await Employee.updateMany({
            "designation.name": {
                $ne: "ADMINISTRATOR"
            }
        }, {
            $set: {
                cl: 1,
                leavesTaken: 0,
            }
        })
    } catch (error) {
        console.log(error)
    }
});

// Handle routes
app.use("/api/images", express.static(path.join(__dirname, "uploads/")));

app.use('/api/user', verifyToken, userRoutes);
app.use('/api/attendence', verifyToken, attendenceRoutes);
app.use('/api/shift', verifyToken, shiftRoutes);
app.use('/api/team', verifyToken, teamRoutes);
app.use('/api/designation', verifyToken, designationRoutes);
app.use('/api/holiday', verifyToken, holidayRoutes);
app.use('/api/leaves', verifyToken, leaveRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Local server running at ${PORT}.`);
});
