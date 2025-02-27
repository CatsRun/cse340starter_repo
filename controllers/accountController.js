
/* ***************************
 *  Require
 * ************************** */

const utilities = require("../utilities/")
const accountModel = require("../models/account-model")

// do Ineed to add 'index.js'?


/* ****************************************
*  Deliver login view
* *************************************** */
// wk06 https://blainerobertson.github.io/340-js/views/account-login.html

  async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
    })
  }


/* ****************************************
*  Deliver registration view
* *************************************** */

async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    errors: null,
    title: "Register",
    nav,
  })
}




/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}

// this is the export code
module.exports = { buildLogin, buildRegister, registerAccount }