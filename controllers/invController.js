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
// added final project review
invCont.buildByInventoryId = async function (req, res, next) {
    const inventory_id = req.params.inventoryId
    console.log("detail view invrentory_id: " + inventory_id)
    const data = await invModel.getInventoryByInventoryId(inventory_id)
    const grid = await utilities.buildDetailGrid(data)
    // const reviewData = await invModel.reviewItem(data)
    
    let nav = await utilities.getNav()
    let in_make = data[0].inv_make
    let in_model = data[0].inv_model
    let in_year = data[0].inv_year
    let inv_id = data[0].inv_id
    let review_id = data[0].review_id
    res.render("./inventory/detail", {
      title: in_year +" " + in_make + " " + in_model,
      nav,
      inv_id,
      grid,
      // review_id,
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
    // const authUserAccess = accountController.authUserAccess
    const classificationList = await utilities.buildClassificationList()  //https://byui-cse.github.io/cse340-ww-content/views/select-products-ajax.html
    res.render("./inventory/management", {
      title: "Vehicle " + "Management",
      nav,
      errors: null,
      // classificationSelect,
      classificationList,
      // authUserAccess
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
  const classification_id = req.params.classificationId
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

  const regResult = await invModel.addClassification(
    classification_name
  )

  let nav = await utilities.getNav()
    
  if (regResult) {
    req.flash(
      "notice",
      `It worked! ${classification_name} was added to the navigation bar.`
    )

    res.redirect("/inv/"    //this uses .redirect instead of rebuilding the page insted of .render
    // res.status(201).render("./inventory/management", {
    //   title: "Vehicle Management",
    //   nav, //why is this nav bar not refreshing when the item does
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

  const regResult = await invModel.addInventory(
    classification_id, inv_make,  inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
    
  )
    // console.log(classification_id)kkjn m   b t70=
  if (regResult) {
    req.flash(
      "notice",
      `It worked! Your vehicle was added.`
      // `It worked! ${inv_year, inv_make, inv_model} was added.`
    )
    res.redirect("/inv/" 
    // res.redirect("./inventory/management", {   //this uses .redirect instead of rebuilding the page with .render
    // res.status(201).render("./inventory/management", {
      // title: "Vehicle Management",
      // nav, //why is this nav bar not refreshing when the item is
      // errors: null,
    // }
  )

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
  let nav = await utilities.getNav()
  // const itemData = await invModel.getInventoryByInventoryId(inventory_id)

  const data = await invModel.getInventoryByInventoryId(inventory_id)
  const itemData = data[0]
  const classificationList = await utilities.buildClassificationList(itemData.classification_id)  
  // console.log(itemData.inv_make)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
// -----------above is original 5.0
  // const inventory_id = parseInt(req.params.inventory_id) //parse int was added test 5.0
 
  // let nav = await utilities.getNav()
  // const itemData = await invModel.getInventoryByInventoryId(inventory_id)
  // const classificationList = await utilities.buildClassificationList(itemData.classification_id)  
  // const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  



  res.render("./inventory/edit_inventory", {
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


// ******************************************
// *          Update new Inventory 
// ****************************************** 
invCont.updateInventory = async function (req, res, next)
{
  // const inventory_id = (req.body.inventory_id) //try adding this to see if it workds to update the site after and update?
  let nav = await utilities.getNav()
  const { 
    
    inv_make,  
    inv_model, 
    inv_year, 
    inv_description, 
    inv_image, 
    inv_thumbnail, 
    inv_price, 
    inv_miles, 
    inv_color,
    classification_id, 
    inv_id,

  } = req.body

  const updateResult  = await invModel.updateInventory(
     
    inv_make,  
    inv_model, 
    inv_year, 
    inv_description, 
    inv_image, 
    inv_thumbnail, 
    inv_price, 
    inv_miles, 
    inv_color,
    classification_id,
    inv_id, 

  )
  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
    
  } else {   
    // const classificationList   = await utilities.buildClassificationList(itemData.classification_id)  
    const classificationList = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit_inventory", {
    title: "Edit " + itemName,
    nav,
    classificationList: classificationList,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
    })
  }
}


// ******************************************
// *          Delete Inventory Confirmation View
// ****************************************** 
// https://byui-cse.github.io/cse340-ww-content/views/delete.html
invCont.deleteInventoryView = async function (req, res, next)
{
  const inv_id = (req.params.inv_id)
  let nav = await utilities.getNav()
  const data = await invModel.getInventoryByInventoryId(inv_id)
  const itemData = data[0]
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`

  res.render("./inventory/delete-inventory", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
    
  })
}


// ******************************************
// *          Delete Inventory 
// ******************************************
// https://byui-cse.github.io/cse340-ww-content/views/delete.html
invCont.deleteInventoryItem = async function (req, res, next)
{
  let nav = await utilities.getNav()
  const inv_id = (req.body.inv_id)
  console.log(inv_id + " invController")
  const review = await invModel.deleteInventoryItem(inv_id)

  if (review) {
    req.flash("notice", `The item was successfully deleted.`)
    res.redirect("/inv/")

  } else {   
    req.flash("notice", "Sorry, the deletion failed.")
    res.redirect("/account/")    //this uses .redirect instead of rebuilding the page with .render
  }  
}



// ******************************************
// *          Review Inventory 
// *          final project
// ******************************************
invCont.reviewItem = async function (req, res, next)
{console.log(" 1 does it go there?")
  // const inventory_id = req.params.inventoryId

  // const { account_id } = res.locals.accountData //this pulls the account_id but not from the form
  
  const inv_id = (req.body.inv_id)
  // const data = await invModel.getInventoryByInventoryId(inv_id)
  console.log(inv_id + " 7 inv_id")
  const account_id = (req.body.account_id)

  console.log(account_id + " 11 account_id")

  let nav = await utilities.getNav()
    const review_text  = (req.body.review_text)

    const review = await invModel.reviewItem(    
      review_text, 
      // review_date, this is set in the model
      inv_id, 
      account_id
    )
    console.log(inv_id + " 12 inv_id")
    if (review) {
      req.flash("notice", `Thank you for your review.`)
      // res.redirect("/inv/")
      // res.render("./inventory/detail", {
      //   title: in_year +" " + in_make + " " + in_model,
      //   nav,
      //   // grid,
      //   // review_id,
      //   // reviewData,
      //   errors: null,
      // })

      res.redirect("/inv/detail/"+ inv_id)
    } else {   
      req.flash("notice", "Sorry, your review failed.")
      // res.redirect("/inv/detail" + inv_id)    //this uses .redirect instead of rebuilding the page with .render
      res.redirect("/inv/detail/"+ inv_id)  //fix this: change 4 ->  when inv_id is working
    }  




}







// ----------------------------------------test above
invCont.reviewItemTest = async function (req, res, next)
{console.log(" 1 does it go there?")
  // let nav = await utilities.getNav()
  // const inv_id = (req.body.inv_id)
  const account_id = (req.body.account_id)
  const inventory_id = req.params.inventoryId
  console.log(inventory_id + " 2 invController")
  const review = await invModel.reviewItem(inventory_id)







  
  // const data = await invModel.getInventoryByInventoryId(inventory_id)
  // const grid = await utilities.buildDetailGrid(data)
  // const reviewData = await invModel.reviewItem(data)
  
  let nav = await utilities.getNav()
  // let in_make = inventory_id[0].inv_make
  // let in_model = inventory_id[0].inv_model
  // let in_year = inventory_id[0].inv_year
  // let review_id = inventory_id[0].review_id
  // let inv_id = inventory_id[0].inv_id
// go to inventory-model to process sql
// console.log(inv_id + " 5 invController")
  if (review) {
    req.flash("notice", `Thank you for your review.`)
    // res.redirect("/inv/")
    res.render("./inventory/detail", {
      // title: in_year +" " + in_make + " " + in_model,
      nav,
      // grid,
      // review_id,reviewData,
      errors: null,
    })
  } else {   
    req.flash("notice", "Sorry, your review failed.")
    // res.redirect("/inv/detail" + inv_id)    //this uses .redirect instead of rebuilding the page with .render
    res.redirect("/account/") 
  }  
}

// ------------------example
invCont.buildByInventoryIdm = async function (req, res, next) {
  const inventory_id = req.params.inventoryId
  const data = await invModel.getInventoryByInventoryId(inventory_id)
  const grid = await utilities.buildDetailGrid(data)
  const reviewData = await invModel.reviewItem(data)
  
  let nav = await utilities.getNav()
  let in_make = data[0].inv_make
  let in_model = data[0].inv_model
  let in_year = data[0].inv_year
  let review_id = data[0].review_id
  res.render("./inventory/detail", {
    title: in_year +" " + in_make + " " + in_model,
    nav,
    grid,
    review_id,
    errors: null,
  })
}


  module.exports = invCont