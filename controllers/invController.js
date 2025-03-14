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
    errors: null,
  })
} 




/* ***************************
 *  Build inventory by inventory view
 * ************************** */
// wk05 assignment https://byui-cse.github.io/cse340-ww-content/assignments/assign3.html
//  detail view == buildByInventorylId
invCont.buildByInventoryId = async function (req, res, next) {
    const inventory_id = req.params.inventoryId
    const data = await invModel.getInventoryByInventoryId(inventory_id)
    const grid = await utilities.buildDetailGrid(data)
    let nav = await utilities.getNav()
    let in_make = data[0].inv_make
    let in_model = data[0].inv_model
    let in_year = data[0].inv_year
    // what does res.render mean?
    res.render("./inventory/detail", {
      title: in_year +" " + in_make + " " + in_model,
      nav,
      grid,
      errors: null,
    })
  }



/* ***************************
 *  Build management view
 * ************************** */
//  https://byui-cse.github.io/cse340-ww-content/assignments/assign4.html
invCont.buildManagement = async function (req, res, next)
  {
    let nav = await utilities.getNav()

    const classificationList = await utilities.buildClassificationList()  //https://byui-cse.github.io/cse340-ww-content/views/select-products-ajax.html
    res.render("./inventory/management", {
      title: "Vehicle " + "Management",
      nav,
      errors: null,
      // classificationSelect,
      classificationList,
    })
  }



  /* ***************************
 *  Build add-classification view
 * ************************** */
//  https://byui-cse.github.io/cse340-ww-content/assignments/assign4.html
invCont.buildNewClassification = async function (req, res, next)
{
  let nav = await utilities.getNav()
  res.render("./inventory/newclassification", {
    title: "New Classification",
    nav,
    errors: null,
  })
}

  /* ***************************
 *  Build Add Inventory view
 * ************************** */
// dropdown menue inventory > addinventory
//  https://byui-cse.github.io/cse340-ww-content/assignments/assign4.html
invCont.buildAddInventory = async function (req, res, next)
{
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()
  const classification_id = req.params. classificationId
  res.render("./inventory/addinventory", {
    title: "Add New Vehicle",
    nav,
    classificationList,
    classification_id,
    errors: null,
    
  })
}


// ******************************************
// ***** add new classification to nav ******
// ******************************************
invCont.addClassification = async function (req, res, next)
{
  
  const { classification_name } = req.body

  // try {
  //   // regular password and cost (salt is generated automatically)
  //   hashedPassword = await bcrypt.hashSync(account_password, 10)
  // } catch (error) {
  //   req.flash("notice", 'Sorry, there was an error processing the request.')
  //   res.status(500).render("./inventory/newclassification", {
  //     title: "Add New Classification",
  //     nav,
  //     errors: null,
  //   })
  // }

  const regResult = await invModel.addClassification(
    classification_name
  )

  let nav = await utilities.getNav()
    
  if (regResult) {
    req.flash(
      "notice",
      `It worked! ${classification_name} was added to the navigation bar.`
    )

    res.redirect("/inv/"    //this uses .redirect instead of rebuilding the page with .render
    // res.status(201).render("./inventory/management", {
    //   title: "Vehicle Management",
    //   nav, //why is this nav bar not refreshing when the item is
    //   errors: null,
    )

  } else {
    req.flash("notice", "Sorry, it failed.")
    res.status(501).render("./inventory/newclassification", {
      title: "New Classification",
      nav,
      errors: null,
    }
  )
  }
}


// ******************************************
// *          add new Inventory 
// ****************************************** 
invCont.addInventory = async function (req, res, next)
{
  let nav = await utilities.getNav()
  const { classification_id, inv_make,  inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body

  // try {
  //   // regular password and cost (salt is generated automatically)
  //   hashedPassword = await bcrypt.hashSync(account_password, 10)
  // } catch (error) {
  //   req.flash("notice", 'Sorry, there was an error processing the request.')
  //   res.status(500).render("./inventory/newclassification", {
  //     title: "Add New Classification",
  //     nav,
  //     errors: null,
  //   })
  // }

  const regResult = await invModel.addInventory(
    classification_id, inv_make,  inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
    
  )
    console.log(classification_id)
  if (regResult) {
    req.flash(
      "notice",
      `It worked! Your vehicle was added.`
      // `It worked! ${inv_year, inv_make, inv_model} was added.`
    )

    // res.redirect("./inventory/management", {   //this uses .redirect instead of rebuilding the page with .render
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      nav, //why is this nav bar not refreshing when the item is
      errors: null,
    })

  } else {
    req.flash("notice", "Sorry, it failed.")
    res.status(501).render("./inventory/addinvetory", {
      title: "Add New Vehicle",
      nav,
      errors: null,
    }
  )
  }
}


/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}


// ******************************************
// *          Build Inventory Edit View
// ****************************************** 
// https://byui-cse.github.io/cse340-ww-content/views/update-one.html
invCont.editInventoryView = async function (req, res, next)
{
  const inventory_id = (req.params.inventory_id)
  console.log(inventory_id +"look here")
  let nav = await utilities.getNav()
  // const itemData = await invModel.getInventoryByInventoryId(inventory_id)

  const data = await invModel.getInventoryByInventoryId(inventory_id)
  const itemData = data[0]
  const classificationList = await utilities.buildClassificationList(itemData.classification_id)  
  // console.log(itemData.inv_make)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationList: classificationList,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
    
  })
}


  module.exports = invCont