const express = require("express");
const {
    getShifts,
    addShift,
    updateShift,
    deleteShift,
} = require("../controllers/shiftControllers");
const router = express.Router();

router.get("/", getShifts);
router.post("/addShift", addShift);
router.put("/:id", updateShift);
router.delete("/:id", deleteShift);

module.exports = router;