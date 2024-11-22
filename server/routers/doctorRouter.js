const express = require("express");
const router = express.Router();
const {loginDoctor,registerDoctor}=require("../controllers/doctorController");

router.post("/registerDoctor",registerDoctor);
router.post("/loginDoctor",loginDoctor);
module.exports = router;    //export the router to use in other files