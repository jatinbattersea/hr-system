const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/");
    },
    filename: (req, file, cb) => {
        let name = req.body.name;
        cb(null, name);
    },
});

const upload = multer({ storage: storage });

module.exports.upload = upload;