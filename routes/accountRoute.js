// wk06 https://blainerobertson.github.io/340-js/views/account-login.html

// Needed Resources
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
// https://blainerobertson.github.io/340-js/views/server-validation.html
const regValidate = require('../utilities/account-validation')

// gives access to utilities > index file.
const utilities = require("../utilities/")

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))
// router.get("/login", (accountController.buildLogin))

// ", utilities.handleErrors" This is the error handling middle ware. 

// Route to build registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister))
// router.get("/register", (accountController.buildRegister))


// ********************
// ******* post *******
// ********************
// router.post('/register', utilities.handleErrors(accountController.registerAccount))

// Process the registration data
// https://blainerobertson.github.io/340-js/views/server-validation.html
router.post(
    "/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )


//   testing validation temp  https://blainerobertson.github.io/340-js/views/stickiness.html
// Process the login attempt
router.post(
    "/login",
    (req, res) => {
      res.status(200).send('login process')
    }
  )

module.exports = router;