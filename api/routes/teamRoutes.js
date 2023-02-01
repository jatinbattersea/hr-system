const express = require("express");
const {
    getTeams,
    addTeam,
    updateTeam,
    deleteTeam,
} = require("../controllers/teamControllers");
const router = express.Router();

router.get("/", getTeams);
router.post("/addTeam", addTeam);
router.put("/:id", updateTeam);
router.delete("/:id", deleteTeam);

module.exports = router;