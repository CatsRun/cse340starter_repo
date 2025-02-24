const utilities = require("../utilities/")
const baseController = {}
  // wk06 https://blainerobertson.github.io/340-js/views/session-message.html
  // add this back to make the message visible in views->index.ejs
  // req.flash("notice", "This is a flash message test.")
  
  
baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  res.render("index", {title: "Home", nav})
}

module.exports = baseController