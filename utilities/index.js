const invModel = require("../models/inventory-model")
const Util = {}

const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

// module.exports = Util


// wk04 https://blainerobertson.github.io/340-js/views/inv-delivery-classification.html
/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}



/* **************************************
* Build the detail view HTML
* ************************************ */
// wk05 assignment https://byui-cse.github.io/cse340-ww-content/assignments/assign3.html

Util.buildDetailGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="detail-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_image
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="detailNamePrice">'
      // grid += '<hr />'
      grid += '<h2>'
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' Details'
      // grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      // + vehicle.inv_make + ' ' + vehicle.inv_model + ' ' + vehicle.inv_year + ' details">' 
      // + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span class="desc_row">' 
      + 'Price: $' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      // add details description
      grid += '<p>'
      // should I move the <strong> to a different file? Should I use CSS to make the first word strong? DOes it make a difference?
      // I can change the <strong> to  <span class="first_word"> and then style with CSS 
      + '<span>Description:</span> ' + vehicle.inv_description + '</p>'
      grid += '<p>' 
      + '<span class="desc_row">Color:</span> ' + vehicle.inv_color + '</p>'
      grid += '<p>' 
      + '<span>Milies:</span> ' + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + '</p>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}


// https://byui-cse.github.io/cse340-ww-content/assignments/assign4.html
/* ****************************************
 * Build Add Inventory view
 **************************************** */

// ***** Classification dropdown menu in newclassification.ejs*****

Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}




// wk04 https://byui-cse.github.io/cse340-ww-content/views/error-handling.html
/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)





/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }

  /* ******************************
  * Check Login admin or 
  * ***************************** */
  Util.checkAuthData = async (req, res, next) => {
    const { account_type } = res.locals.accountData
    // res.locals.accountData //use this
    let nav = await Util.getNav()
    if (account_type === "Client") {
      req.flash("notice", "Please check your credentials and try again.")
      res.render("account/login", {
            title: "Login",
            errors:null,
            nav,
          })
    } 
      next()
  }


  
//  https://byui-cse.github.io/cse340-ww-content/views/jwt-authorize.html
 /* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }


 /* ****************************************
 *  Check Authorization 
 used for employee or admin in the inventory administrative views or processes that add/edit/delete items
 * ************************************ */
//  Util.checkAuth = (req, res, next) => {
//   // if (authUserAccess()) { //fix this to check for emplyee or admin    
//   if (res.locals.authenticated) { //fix this to check for emplyee or admin
//     next()
//   } else {
//     req.flash("notice", "Restricted Page")
//     return res.redirect("/account/login")
//   }
//  }

 /* ****************************************
 *      Populate Review Inventory Item
 *      final project
 * ************************************ */
 Util.buildReviewGrid = async function(data){
  
  let grid
  
  if(data.length > 0){
    grid = '<ul id="detail-display">'
    

    data.forEach(review => { 
    const reviewDate = (review.review_date).toDateString()
    // console.log(accountData.account_firstname + '30 accountData.account_firstname')
    // const userName = account_id.account_firstname.charAt(0) + account_id.account_lastname
      
    console.log(new Date(review.review_date).toDateString() + " with date")
      grid += '<li>'
      grid += '<p>' +'<span>  '+ '• '+ 'userName' + ' </span>' +' wrote on: '  + '  ' + reviewDate + ' '+  review.review_text + '</p>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Be the first to leave a review.</p>'
  }
  return grid
}

/* ****************************************
 *      Populate Review Inventory by account_id
 *      final project
 * ************************************ */
Util.buildAccountReviewGrid = async function(data){
  
  let grid
  
  if(data.length > 0){
    grid = '<ul id="detail-display">'

    data.forEach(review => { 
    const reviewDate = (review.review_date).toDateString()
    // console.log(accountData.account_firstname + '30 accountData.account_firstname')
    // const userName = account_id.account_firstname.charAt(0) + account_id.account_lastname
      
    console.log(new Date(review.review_date).toDateString() + " with date")
      grid += '<li>'
      grid += '<p>' +'<span>  '+ '• '+ 'userName' + ' </span>' +'  ' + reviewDate + ' '+  review.review_text + '</p>' + ''
      // grid += `<td><a href='/inv/edit/${review.inv_id}' title='Click to update'>Modify</a></td>`; 
      // grid += `<td><a href='/account/review-edit/${review.account_id}' title='Click to delete'>Delete</a></td></tr>`;
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Be the first to leave a review.</p>'
  }
  return grid
}

// dataTable += `<td><a href='/inv/edit/${element.inv_id}' title='Click to update'>Modify</a></td>`; 
//      dataTable += `<td><a href='/inv/delete/${element.inv_id}' title='Click to delete'>Delete</a></td></tr>`;

// ----------------------------------TESTING-----------------
Util.buildAccountReviewGridTest = async function(data) { 

  // if(data.length > 0){

  const reviewDate = (review.review_date).toDateString()

  let inventoryDisplay = document.getElementById("inventoryDisplay"); 
  // Set up the table labels 
  let dataTable = '<thead>'; 
  dataTable += '<tr><th>userName</th><td>&nbsp;</td><td>&nbsp;</td></tr>'; 
  dataTable += '</thead>'; 
  // Set up the table body 
  dataTable += '<tbody>'; 
  // Iterate over all vehicles in the array and put each in a row 
  data.forEach(function (element) { 
  //  console.log(element.inv_id + ", " + element.inv_model + "inventory.js"); 
   dataTable += `<tr><td>${element.inv_make} ${element.inv_model}</td>`; 
   dataTable += `<td><a href='/inv/edit/${element.inv_id}' title='Click to update'>Modify</a></td>`; 
   dataTable += `<td><a href='/inv/delete/${element.inv_id}' title='Click to delete'>Delete</a></td></tr>`; 
  }) 
  dataTable += '</tbody>'; 
  // Display the contents in the Inventory Management view 
  inventoryDisplay.innerHTML = dataTable; 

// } else { 
//   grid += '<p class="notice">Be the first to leave a review.</p>'
// }
// return grid
 }











module.exports = Util