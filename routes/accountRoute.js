// wk06 https://blainerobertson.github.io/340-js/views/account-login.html

// Needed Resources
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")

// gives access to utilities > index file.
const utilities = require("../utilities/")

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))
// router.get("/login", (accountController.buildLogin))

// ", utilities.handleErrors" This is the error handling middle ware. 

// Route to build registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister))
// router.get("/register", (accountController.buildRegister))

// *** post ***
router.post('/register', utilities.handleErrors(accountController.registerAccount))


module.exports = router;