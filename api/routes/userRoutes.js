const express = require("express");
const {
    addMember,
    getMembers,
    getUser,
    updateUser,
    deleteUser,
    deleteProfilePicture,
    getUserSpecificData,
    getUserLeaves,
    uploadFile,
    changePassword,
} = require("../controllers/userControllers");
const { upload } = require("../middlewares/uploadMiddleware");
const router = express.Router();

router.post("/addMember", addMember);
router.post("/upload", upload.single('file'), uploadFile);
router.get("/", getMembers);
router.get("/:employeeID", getUser);
router.put("/:id", updateUser);
router.get("/employee/shifts", getUserSpecificData); 
router.get("/leaves/:employeeID", getUserLeaves); 
router.delete("/:id", deleteUser);
router.delete("/profile/:id", deleteProfilePicture);
router.put("/accounts/settings/forget-password", changePassword);

module.exports = router;