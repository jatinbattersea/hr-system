const express = require("express");
const {
    getHolidays,
    getUpComingHoliday,
    addHoliday,
    updateHoliday,
    deleteHoliday,
} = require("../controllers/holidayControllers");
const router = express.Router();

router.get("/", getHolidays);
router.get("/up/awaited", getUpComingHoliday);
router.post("/addHoliday", addHoliday);
router.put("/:id", updateHoliday);
router.delete("/:id", deleteHoliday);

module.exports = router;