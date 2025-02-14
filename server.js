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

// wk06 https://blainerobertson.github.io/340-js/views/session-message.html
// the session, and access to the database connection
const session = require("express-session")
const pool = require('./database/')

// added wk04 THIS CRASHED THE TERMINAL**********************
// const utilities = require("./utilities/")

// wk06 https://blainerobertson.github.io/340-js/views/session-message.html
/* ***********************
 * Middleware
 * ************************/
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



/* ***********************
 * Index Routes
 *************************/
// app.get("/",function(req, res){
//   res.render("index", {title: "Home"})
// })

//Index route
app.get("/", baseController.buildHome)
// utilities.handleErrors(app.get("/", baseController.buildHome))

// wk05
app.get("/error", async (req, res, next) => {
    next({status: 500, message: 'Sorry, there appears to be a server error.'})
  })




//****  wk04*** https://blainerobertson.github.io/340-js/views/inv-delivery-classification.html 
// ** app.use() is an Express function that directs the application to use the resources passed in as parameters.
// ** /inv is a keyword in our application, indicating that a route that contains this word will use this route file to work with inventory-related processes; "inv" is simply a short version of "inventory".
// ** inventoryRoute is the variable representing the inventoryRoute.js file which was required (brought into the scope of the server.js file) earlier.

// Inventory routes
app.use("/inv", inventoryRoute)


// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})




/* ***********************
* Express Error Handler
* Place after all other middleware
* This allows 404 page not found and other error messages?
* wk04 https://blainerobertson.github.io/340-js/views/basic-errors.htmlz
*************************/
// const invModel = require("../models/inventory-model")
// is this right?
const utilities = require("./utilities/index.js")

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
