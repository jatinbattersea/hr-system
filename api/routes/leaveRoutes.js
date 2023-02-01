const express = require("express");
const {
    getLeaves,
    getLeave,
    applyLeave,
    manageApplicationStatus,
    deleteLeaves,
} = require("../controllers/leaveControllers");
const router = express.Router();

router.post("/apply", applyLeave);
router.post("/:id", manageApplicationStatus);
router.get("/:year/:month", getLeaves);
router.get("/details/:id", getLeave);
router.delete("/:year/:month", deleteLeaves);

module.exports = router;