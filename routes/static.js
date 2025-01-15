const express = require('express');
const router = express.Router();

// Static Routes
// Set up "public" folder / subfolders for static files
router.use(express.static("public"))
router.use("/css", express.static(__dirname + "public/css"))
router.use("/js", express.static(__dirname + "public/js"))
router.use("/images", express.static(__dirname + "public/images"))

// Exports the router object, along with all of these use statements for use in other areas of the application. This is VERY IMPORTANT. If a resource is NOT exported, it cannot be used somewhere else.
module.exports = router



