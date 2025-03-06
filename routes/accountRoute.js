// wk06 https://blainerobertson.github.io/340-js/views/account-login.html

// Needed Resources
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
// https://blainerobertson.github.io/340-js/views/server-validation.html
const regValidate = require('../utilities/account-validation')

// gives access to utilities > index file.
const utilities = require("../utilities/")

// https://blainerobertson.github.io/340-js/views/login.html

router.get("/accountmanagement", utilities.handleErrors(accountController.buildAccountManagement)) //is this how to:Add the new default route for accounts to the accountRoute file.

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

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

// Process the login attempt, this is temp while testing
// router.post(
//     "/login",
//     (req, res) => {
//       res.status(200).send('login process')
//     }
//   )

// https://blainerobertson.github.io/340-js/views/login.html
// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)
module.exports = router;