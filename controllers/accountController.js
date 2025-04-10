
/* ***************************
 *  Require
 * ************************** */

const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
// const invModel = require("../models/inventory-model")
const bcrypt = require("bcryptjs")

// https://blainerobertson.github.io/340-js/views/login.html
// this makes cookie that allows a login
const jwt = require("jsonwebtoken")
require("dotenv").config()


/* ****************************************
*  Deliver login view
* *************************************** */
// wk06 https://blainerobertson.github.io/340-js/views/account-login.html

  async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
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
*  Deliver account management view
*  edited for final project
* *************************************** */

async function buildAccntManagement(req, res, next) {
  let nav = await utilities.getNav()
  const { account_id } = res.locals.accountData
  const review_data = await accountModel.getReviewByAccount_id(account_id)
  const review_item = await utilities.buildAccountReviewGrid(review_data)



  res.render("account/account-management", {
    errors: null,
    title: "Account Management",
    nav,
    review_item,
  })
}


/* ****************************************
*  Deliver Account Update view
* *************************************** */
// wk06 https://blainerobertson.github.io/340-js/views/account-login.html

async function buildAccountUpdate(req, res, next) {
  let nav = await utilities.getNav()
  res.render("./account/account-update", {
    title: "Account Update",
    errors: null,
    nav,
  })
}

/* ****************************************
*  Process Account Data Update
* *************************************** */
async function updateAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email } = req.body //this pulls from the body 
  const { account_id } = res.locals.accountData
  console.log(account_firstname + " test 1 does cont update accnt work?")
   const accntResult = await accountModel.updateAccountData( 
    account_firstname,//change these names
    account_lastname,
    account_email,
    account_id

    // account_password
    // hashedPassword
  )
  
  console.log(account_firstname + "  test 3 does cont update accnt work?")
  if (accntResult) {
    const newAccountData = await accountModel.getAccountByAccountId(account_id)



    console.log(newAccountData.account_firstname + "  new data does cont update accnt work?")
    console.log(account_firstname + "  test 6 does cont update accnt work?")
    req.flash(
      "notice",
      `Congratulations ${account_firstname}, you have updated your account. `
    )
    console.log(account_firstname + "  test 7 does cont update accnt work?")
    // res.redirect("account/account-management")
    res.status(201).render("account/account-management", {
      title: "Account Management", //should this be rendered or redirected?
      nav,
      errors: null,
      account_firstname, //how do I get the header and title updated? How was it done in inv?
      account_lastname,
      account_email, 

    })
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("account/account-update", {
      title: "Account Management",
      nav,
      errors: null
    })
  }
}

/* ****************************************
*  Process Password update
* *************************************** */
async function passwordUpdateAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_password, account_id } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the update.')
    res.status(500).render("account/account-update", {
      title: "Account Update",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.updateAccountPassword(
    // account_password
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations ${account_firstname}, you updated your password.`
    )
    res.status(201).render("account/account-management", {
      title: "Account Management",
      nav,
      errors: null
    })
  } else {
    req.flash("notice", "Sorry, the password update failed.")
    res.status(501).render("account/account-update", {
      title: "Account Update",
      nav,
      errors: null
    })
  }
}


/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    // account_password
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null
    })
  }
}


/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  console.log(accountData.account_type)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })


        // res.locals.account_type = accountData.account_type
        // res.locals.account_firstname = accountData.account_firstname
        // res.locals.account_lastname = accountData.account_lastname

        // console.log(locals.account_type + 'local account type')
        // console.log(account_type + 'local fiest name')
        // console.log(account_type + 'local last name')

      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })


      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      // res.locals.accountData = accountData
      res.locals.account_type = accountData.account_type
      res.locals.account_firstname = accountData.account_firstname
      res.locals.account_lastname = accountData.account_lastname
      res.locals.account_type
  
      return res.redirect("/account/") 
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

// ------------test 6.0--------------
// /* ****************************************
//  *  Verify user permissions
//  * ************************************ */

async function authUserAccess(req, res, next) {
  req.flash("notice", "this worked! accntContr.")
  const account_type = accountData.account_type
  console.log(accountData + '  local accout_type')
  // if (account_type === "admin" || account_type === "employee"){
  if (!account_type === "admin" || !account_type === "employee"){
    req.flash("notice", "Access denied. Contact Admin.")
    return res.redirect("/account/")
  }else{
    req.flash("notice", "Welcome")    
  }
  next()
}



//   // let nav = await utilities.getNav()
//   const account_type = "admin"
//   // const { account_email, account_password } = req.body
//   // const accountData = await accountModel.getAccountByEmail(account_email)
//   // console.log(accountData + " this is the accountDATA")
//   console.log(account_type + " this is the account type")
//   // console.log(res.locals.loggedin + " this is .loggedin")
//   // console.log(res.locals + " this is .locals")
//   if (!account_type === "admin") { //add if works:   ||   (req.body.account_type === "employee")
//     req.flash("notice", "Please check your credentials and try again.")
//     res.status(400).render("account/login", {
//       title: "Login",
//       nav,
//       errors: null,
//       account_email,
//     })
//     return
//   }
//   try {
//     if (await bcrypt.compare(account_password, accountData.account_password)) {
//       delete accountData.account_password
//       const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
//       if(process.env.NODE_ENV === 'development') {
//         res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
//       } else {
//         res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
//       }
//       return res.redirect("/account/")
//     }
//     else {
//       req.flash("message notice", "Please check your credentials and try again.")
//       res.status(400).render("account/login", {
//         title: "Login",
//         nav,
//         errors: null,
//         account_email,
//       })
//     }
//   } catch (error) {
//     throw new Error('Access Forbidden')
//   }
// }

// async function userAuth(params) {
  
// }

// /* ****************************************
//  *  Verify user permissions
//  * ************************************ */
// async function authUserAccess(req, res, next) {
//   // let nav = await utilities.getNav()
//   const { account_type } = req.body
//   console.log(account_type)
//   // const accountData = await accountModel.getAccountByEmail(account_email)
//   if (account_type === 'client' || account_type === 'admin') {
//     // access full site
//     req.flash("notice", "TEST, Please check your credentials and try again.")
//     // res.status(400).render("account/login", {
//     //   title: "Login",
//     //   nav,
//     //   errors: null,
//     //   account_email,
      
//     // })
//     // return
//   }
//   else{ req.flash("notice", "TEST works.")}
//   // try {
//   //   if (await bcrypt.compare(account_password, accountData.account_password)) {
//   //     delete accountData.account_password
//   //     const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
//   //     if(process.env.NODE_ENV === 'development') {
//   //       res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
//   //     } else {
//   //       res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
//   //     }
//   //     return res.redirect("/account/")
//   //   }
//   //   else {
//   //     req.flash("message notice", "Please check your credentials and try again.")
//   //     res.status(400).render("account/login", {
//   //       title: "Login",
//   //       nav,
//   //       errors: null,
//   //       account_email,
//   //     })
//   //   }
//   // } catch (error) {
//   //   throw new Error('Access Forbidden')
//   // }
// }

// // need to restict some view to until logged in 
// // classification and detail views are always available

// // this needs to see what the account_type is. 

// // if (account_type === 'client') {
// //   'restrict access to add, edit, delete views'
// // }

// // if (req.query.admin === 'true') {
// //   next()
// // }else{
// //   req.flash("Unauthorized")
// }



// this is the export code
module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccntManagement
, authUserAccess, buildAccountUpdate, updateAccount, passwordUpdateAccount

}

// module.exports = { buildLogin, buildRegister, registerAccount} 