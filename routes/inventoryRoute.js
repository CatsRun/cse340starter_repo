// wk04 https://blainerobertson.github.io/340-js/views/inv-delivery-classification.html

// Line 8 - brings Express into the scope of the file.
// Line 9 - uses Express to create a new Router object. Remember in lesson 2 that using separate router files for specific elements of the application would keep the server.js file smaller and more manageable? That's what we're doing.
// Line 10 - brings the inventory controller into this router document's scope to be used.

// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")

// https://blainerobertson.github.io/340-js/views/server-validation.html

// ***
const regValidateClass = require('../utilities/inventory-validation')
const regValidate = require('../utilities/addinventory-validation')

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// wk05 assignment https://byui-cse.github.io/cse340-ww-content/assignments/assign3.html
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));

// https://byui-cse.github.io/cse340-ww-content/assignments/assign4.html
// router.get("/", accountController.authUserAccess, utilities.handleErrors(invController.buildManagement), accountController.authUserAccess);
router.get("/", utilities.checkAuthData, utilities.handleErrors(invController.buildManagement));

// https://byui-cse.github.io/cse340-ww-content/assignments/assign4.html
router.get("/newclassification", utilities.checkAuthData, utilities.handleErrors(invController.buildNewClassification));

// https://byui-cse.github.io/cse340-ww-content/assignments/assign4.html
router.get("/addinventory", utilities.checkAuthData, utilities.handleErrors(invController.buildAddInventory));

// https://byui-cse.github.io/cse340-ww-content/views/select-products-ajax.html
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// https://byui-cse.github.io/cse340-ww-content/views/update-one.html
router.get("/edit/:inventory_id",  utilities.checkAuthData, utilities.handleErrors(invController.editInventoryView))
 

router.get("/delete/:inv_id",  utilities.checkAuthData, utilities.handleErrors(invController.deleteInventoryView))



// ********************
// ******* post *******
// ********************

// add new classification to nav
router.post(
    "/newclassification",
    utilities.checkAuthData,
    regValidateClass.classRules(),
    regValidateClass.checkRegData,
    utilities.handleErrors(invController.addClassification)
  )


// add new inventory to database
router.post(
    "/addinventory",
    utilities.checkAuthData,
    regValidate.inventoryRules(),
    regValidate.checkRegData,
    utilities.handleErrors(invController.addInventory)
  )

router.post(
  "/edit_inventory",
  utilities.checkAuthData,
  regValidate.newInventoryRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(invController.editInventoryView)
)


// https://byui-cse.github.io/cse340-ww-content/views/update-two.html
// update inventory when form is submitted
router.post("/update/", //if update inv does not work - remove second /
  // add error handling here
  utilities.checkAuthData, utilities.handleErrors(invController.updateInventory))
// router.post("/edit_inventory/", utilities.handleErrors(invController.updateInventory))

// * ****Delete post**** *
// https://byui-cse.github.io/cse340-ww-content/views/delete.html
router.post(
  "/delete",
  utilities.checkAuthData, utilities.handleErrors(invController.deleteInventoryItem)
)



module.exports = router;



