//  https://blainerobertson.github.io/340-js/views/inv-delivery-classification.html 

const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

module.exports = invCont

// wk05 assignment https://byui-cse.github.io/cse340-ww-content/assignments/assign3.html
//  detail view == buildByInventorylId
invCont.buildByInventoryId = async function (req, res, next) {
    const inventory_id = req.params.inventoryId
    const data = await invModel.getInventoryByInventoryId(inventory_id)
    const grid = await utilities.buildDetailGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/detail", {
      title: className + " vehicles",
      nav,
      grid,
    })
  }