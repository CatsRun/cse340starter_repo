// wk06 https://blainerobertson.github.io/340-js/views/account-login.html

// Needed Resources
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
// add access to acount controller


// gives access to utilities > index file.
const utilIndex = require("../utilities")

// Route to build inventory by classification view

// router.get("login", utilities.handleErrors(accountController.buildLogin))

// , utilities.handleErrors This is the error handling middle ware. Why is utilities not working?
router.get("/login", (accountController.buildLogin))
// 3. Add a "GET" route for the path that will be sent when the "My Account" link is clicked. Note: within this router file, the route should reflect only the part of the path that follows "account". The account part of the path should be placed in the server.js file, when this router is required.
// what do I add to the server.js file?



// 4. The "GET" route must use a function from the account controller, to handle the request.




// 5. Add the error handler middleware to the route to deal with any errors.







module.exports = router;