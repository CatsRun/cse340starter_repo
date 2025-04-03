const utilities = require(".")
  const { body, validationResult } = require("express-validator")
  const validate = {}

  /*  **********************************
  *  newclassification Data Validation Rules
  * ********************************* */
  validate.classRules= () => {
    return [
      // classification is required and must be string
      body("classification_name")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .isAlpha()
        .withMessage("Please provide a classification name."), // on error this message is sent.        
    ]
  }


  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("inventory/newclassification", {
        errors,
        title: "New Classification",
        nav,
        classification_name,
      })
      return
    }
    next()
  }
  





  // build here middlewaer 
  module.exports = validate