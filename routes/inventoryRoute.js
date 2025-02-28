// wk04 https://blainerobertson.github.io/340-js/views/inv-delivery-classification.html

// Line 8 - brings Express into the scope of the file.
// Line 9 - uses Express to create a new Router object. Remember in lesson 2 that using separate router files for specific elements of the application would keep the server.js file smaller and more manageable? That's what we're doing.
// Line 10 - brings the inventory controller into this router document's scope to be used.

// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// wk05 assignment https://byui-cse.github.io/cse340-ww-content/assignments/assign3.html
router.get("/detail/:inventoryId", invController.buildByInventoryId);

// https://byui-cse.github.io/cse340-ww-content/assignments/assign4.html
router.get("/", invController.buildManagement);

// https://byui-cse.github.io/cse340-ww-content/assignments/assign4.html
router.get("/newclassification", invController.buildNewClassification);

// https://byui-cse.github.io/cse340-ww-content/assignments/assign4.html
router.get("/addinventory", invController.buildAddInventory);

module.exports = router;



