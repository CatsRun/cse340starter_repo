
const utilities = require(".") //require the utilities > index.js
const { body, validationResult } = require("express-validator")
const validate = {}
const accountModel = require("../models/account-model")

  /*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
  validate.registrationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the DB
    //   body("account_email")
    //   .trim()
    //   .escape()
    //   .notEmpty()
    //   .isEmail()
    //   .normalizeEmail() // refer to validator.js docs
    //   .withMessage("A valid email is required."),

      // valid email is required and cannot already exist in the database  https://blainerobertson.github.io/340-js/views/stickiness.html 
    body("account_email")
    .trim()
    .isEmail()
    .normalizeEmail() // refer to validator.js docs
    .withMessage("A valid email is required.")
    .custom(async (account_email) => {
    const emailExists = await accountModel.checkExistingEmail(account_email)
    if (emailExists){
        throw new Error("Email exists. Please log in or use different email")
    }
    }),
  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
  }



  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/register", {
        errors,
        title: "Registration",
        nav,
        account_firstname,
        account_lastname,
        account_email,
      })
      return
    }
    next()
  }


  /*  **********************************
  *  Login Rules Validation
  * ********************************* */
  validate.loginRules = () => {
    return [
      
      
      // valid email is required and cannot already exist in the database  https://blainerobertson.github.io/340-js/views/stickiness.html 
    body("account_email")
    .trim()
    .isEmail()
    .normalizeEmail() // refer to validator.js docs
    .withMessage("A valid email is required.")
    // .custom(async (account_email) => {
    // const emailExists = await accountModel.checkExistingEmail(account_email)
    // if (emailExists){
    //     throw new Error("Email exists. Please log in or use different email")
    // }
    // })
    ,
  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password did not work. PLease try again."),
    ]
  }


  
  /* ******************************
 * Check Login data and return errors or continue to registration
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body
  let errors = []
  errors = validationResult(req)
  console.log(errors)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      errors,
      title: "Login",
      nav,
      account_email,
    })
    return
  }
  next()
}

  

 /*  **********************************
  *  Update Data Validation Rules
  * ********************************* */
 validate.updateAccountRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), // on error this message is sent.

    // valid email is required and cannot already exist in the DB
  //   body("account_email")
  //   .trim()
  //   .escape()
  //   .notEmpty()
  //   .isEmail()
  //   .normalizeEmail() // refer to validator.js docs
  //   .withMessage("A valid email is required."),

    // valid email is required and cannot already exist in the database  https://blainerobertson.github.io/340-js/views/stickiness.html 
  body("account_email")
  .trim()
  .isEmail()
  .normalizeEmail() // refer to validator.js docs
  .withMessage("A valid email is required.")
  .custom(async (account_email) => {
  const emailExists = await accountModel.checkExistingEmail(account_email)
  if (!emailExists){
    // add here to update to new email, CAN I add to verify that this is wanted? a second submit?
      throw new Error("No email found. Please enter your email address.")
  }
  })    

  ]
}



/* ******************************
* Check update account  data and return errors or continue to ...
* ***************************** */
validate.checkAccntUpdateData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)
  // req.flash("message notice", "Your information was updated") //is this msg in the right place?
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/account-update", { //should this be res.render or res.redirect("/account/update")
      errors,
      title: "Account Update",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  } 
  // res.redirect("/account/") //correct path
  next()
}


 /*  **********************************
  *  Update Password Validation Rules
  * ********************************* */
 validate.passwordUpdateRules = () => {
  return [    
    // password is required and must be strong password
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

  /* ******************************
 * Check Password and return errors 
 * ***************************** */
// not working
  validate.checkPasswordData = async (req, res, next) => {
    const { account_email } = req.body
    let errors = []
    errors = validationResult(req)
    console.log(errors)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/login", {
        errors,
        title: "Login",
        nav,
        account_email,
      })
      return
    }
    next()
  }


  module.exports = validate