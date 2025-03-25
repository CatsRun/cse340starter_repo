const utilities = require(".")
  const { body, validationResult } = require("express-validator")
  const validate = {}

  /*  **********************************
  *  Add inventory Data Validation Rules
  * ********************************* */

  validate.inventoryRules = () => {
    return [
      // firstname is required and must be string
      body("inv_make")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide the make of the vehicle."), // on error this message is sent.
  
      // lastname is required and must be string
      body("inv_model")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide the make of the vehicle."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the DB
      body("inv_year")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide the four digit year of the vehicle."),
  
      // password is required and must be strong password
      body("inv_description")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })        
        .withMessage("Please provide a description."),

        body("inv_image")
        .trim()
        // .escape()  //does changing this make it not safe?
        .notEmpty()
        .isLength({ min: 1 })  
        // .isURL()      
        .withMessage("Please provide a valid URL."),

        body("inv_thumbnail")
        .trim()
        // .escape()
        .notEmpty()
        .isLength({ min: 1 })  
        // .isURL()             
        .withMessage("Please provide a valid URL."),

        body("inv_price")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })   
        .isNumeric()          
        .withMessage("Please provide a price."),

        body("inv_miles")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })    
        .isNumeric()    
        .withMessage("Please provide the milage."),

        body("inv_color")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })        
        .withMessage("Please provide the vehicle color."),
    ]
  }


/*  **********************************
  *  edit inventory Data Validation Rules
  * ********************************* */

validate.newInventoryRules = () => {
  return [
    // firstname is required and must be string
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide the make of the vehicle."), // on error this message is sent.

    // lastname is required and must be string
    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide the make of the vehicle."), // on error this message is sent.

    // valid email is required and cannot already exist in the DB
    body("inv_year")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 1 })
    .withMessage("Please provide the four digit year of the vehicle."),

    // password is required and must be strong password
    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })        
      .withMessage("Please provide a description."),

      body("inv_image")
      .trim()
      // .escape()  //does changing this make it not safe?
      .notEmpty()
      .isLength({ min: 1 })  
      // .isURL()      
      .withMessage("Please provide a valid URL."),

      body("inv_thumbnail")
      .trim()
      // .escape()
      .notEmpty()
      .isLength({ min: 1 })  
      // .isURL()             
      .withMessage("Please provide a valid URL."),

      body("inv_price")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })   
      .isNumeric()          
      .withMessage("Please provide a price."),

      body("inv_miles")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })    
      .isNumeric()    
      .withMessage("Please provide the milage."),

      body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })        
      .withMessage("Please provide the vehicle color."),

      body("inv_id")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })        
      .withMessage("An error occured with the vehicle ID number."),
  ]
}

  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { inv_make,  inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let classificationList = await utilities.buildClassificationList()
      let nav = await utilities.getNav()
      res.render("inventory/addinventory", {
        // should this go to a different page?
        errors,
        title: "Add New Vehicle",
        nav,
        inv_make,  inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classificationList,
      })
      return
    }
    next()
  }



    /* ******************************
 * Check data and return errors or continue to edit view
 * ***************************** */
// https://byui-cse.github.io/cse340-ww-content/views/update-two.html
validate.checkUpdateData = async (req, res, next) => {
  const { inv_make,  inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, inv_id } = req.body
  let errors = []
  errors = validationResult(req)
  const itemData = data[0]
  if (!errors.isEmpty()) {
    let classificationList = await utilities.buildClassificationList()
    let nav = await utilities.getNav()
    res.render("inventory/edit_inventory", {
      errors,
      title: "Edit" + itemData,
      nav,
      inv_make,  inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classificationList,
      inv_id,
    })
    return
  }
  next()
}
  
  module.exports = validate