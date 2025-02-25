const utilities = require("../utilities/")
const baseController = {}
  // wk06 https://blainerobertson.github.io/340-js/views/session-message.html
  
  
  
  
baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  // add this back to make the message visible in views->index.ejs
  // req.flash("notice", "This is a flash message test.")
  res.render("index", {title: "Home", nav})
}

module.exports = baseController