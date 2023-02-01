const express = require("express");
const {
    getDesignations,
    addDesignation,
    updateDesignation,
    updateAuthorities,
    deleteDesignation,
} = require("../controllers/designationControllers");
const router = express.Router();

router.get("/", getDesignations);
router.post("/addDesignation", addDesignation);
router.post("/updating/authorities", updateAuthorities);
router.put("/:id", updateDesignation);
router.delete("/:id", deleteDesignation);

module.exports = router;