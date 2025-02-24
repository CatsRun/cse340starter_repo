
/* ***************************
 *  Require
 * ************************** */

const utilities = require("../utilities/")
// do Ineed to add 'index.js'?


/* ****************************************
*  Deliver login view
* *************************************** */
// wk06 https://blainerobertson.github.io/340-js/views/account-login.html

// original
  async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
    })
  }
  
  module.exports = { buildLogin }