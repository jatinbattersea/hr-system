const express = require("express");
const multer = require("multer");
const path = require("path");
const {
    addAttendence,
    getAttendence,
    getEmployeeAttendence,
    deleteAttendence,
    updateAttendence,
} = require("../controllers/attendenceControllers");
// const { protect } = require("../middleware/authMiddleware");

var storage = multer.diskStorage({
    //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, "./uploads/");
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(
            null,
            file.fieldname +
            "-" +
            datetimestamp +
            "." +
            file.originalname.split(".")[file.originalname.split(".").length - 1]
        );
    },
});
var upload = multer({
    //multer settings
    storage: storage,
    fileFilter: function (req, file, callback) {
        //file filter
        if (
            ["xls", "xlsx"].indexOf(
                file.originalname.split(".")[file.originalname.split(".").length - 1]
            ) === -1
        ) {
            return callback(new Error("Wrong extension type"));
        }
        callback(null, true);
    },
});

const router = express.Router();

router.post("/", upload.single('attendenceFile'), addAttendence);
router.post("/update", updateAttendence);
router.get("/:year/:month", getAttendence);
router.get("/:year/:month/:employeeId", getEmployeeAttendence);
router.delete("/:year/:month", deleteAttendence);
module.exports = router;