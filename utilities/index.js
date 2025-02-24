const invModel = require("../models/inventory-model")
const Util = {}

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

module.exports = Util


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


// wk06 https://blainerobertson.github.io/340-js/views/account-login.html
/* ****************************************
 * Build login view
 **************************************** */


// module.exports = Util






// wk04 https://byui-cse.github.io/cse340-ww-content/views/error-handling.html
/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)