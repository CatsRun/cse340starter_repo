/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")


const baseController = require("./controllers/baseController")

const inventoryRoute = require("./routes/inventoryRoute.js")

// wk06 https://blainerobertson.github.io/340-js/views/account-login.html
const accountRoute = require("./routes/accountRoute.js")

// wk06 https://blainerobertson.github.io/340-js/views/session-message.html
// the session, and access to the database connection
const session = require("express-session")
const pool = require('./database/')

// added wk04 THIS CRASHED THE TERMINAL**********************
const utilities = require("./utilities/")
// const utilities = require("../utilities/")  //this is how it shows in the assignment but it breaks the code to have two '..'  https://byui-cse.github.io/cse340-ww-content/views/login.html

// https://blainerobertson.github.io/340-js/views/account-process-register.html
const bodyParser = require("body-parser")

// https://blainerobertson.github.io/340-js/views/login.html
const cookieParser = require("cookie-parser")




/* ***********************
 * Middleware
 * ************************/

// wk06 https://blainerobertson.github.io/340-js/views/session-message.html
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

// *********  Express Messages Middleware  ***********
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

 
// *** these must be above Routes ***
// https://blainerobertson.github.io/340-js/views/account-process-register.html
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// https://blainerobertson.github.io/340-js/views/login.html
app.use(cookieParser())

// ***          ***             ***



//* *********************
//* utilities index JWT 
//* *********************
//https://byui-cse.github.io/cse340-ww-content/views/login.html
app.use(utilities.checkJWTToken)




/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root


/* ***********************
 * Routes
 *************************/
app.use(static)

// https://blainerobertson.github.io/340-js/views/account-login.html 
// from the video
app.use(require("./routes/static.js"))
// app.get asdf







/* ***********************
 * Index Routes
 *************************/
// app.get("/",function(req, res){
//   res.render("index", {title: "Home"})
// })

//Index route

// app.get("/", baseController.buildHome)
app.get("/", utilities.handleErrors(baseController.buildHome))

// wk05
app.get("/error", async (req, res, next) => {
    next({status: 500, message: 'Sorry, there appears to be a server error.'})
  })




//****  wk04*** https://blainerobertson.github.io/340-js/views/inv-delivery-classification.html 
// ** app.use() is an Express function that directs the application to use the resources passed in as parameters.
// ** /inv is a keyword in our application, indicating that a route that contains this word will use this route file to work with inventory-related processes; "inv" is simply a short version of "inventory".
// ** inventoryRoute is the variable representing the inventoryRoute.js file which was required (brought into the scope of the server.js file) earlier.

// Inventory routes

// app.use("/inv", inventoryRoute)
app.use("/inv", require("./routes/inventoryRoute"))

app.use("/account", require("./routes/accountRoute"))



// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})



/* ***********************
* Express Error Handler
* Place after all other middleware
* This allows 404 page not found and other error messages
* wk04 https://blainerobertson.github.io/340-js/views/basic-errors.htmlz
*************************/

app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message: err.message,
    nav
  })
})



/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
