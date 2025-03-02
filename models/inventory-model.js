const pool = require("../database")

/* ***************************
 *  Get all classification data
 * ************************** */
async function  getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

// wk04 https://blainerobertson.github.io/340-js/views/inv-delivery-classification.html
/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

// wk05 assignment https://byui-cse.github.io/cse340-ww-content/assignments/assign3.html
// a function to retrieve the data for a specific vehicle in inventory, based on the inventory id (this should be a single function, not a separate one for each vehicle), which is part of the inventory-model,
async function getInventoryByInventoryId(inventory_id) {
  console.log(inventory_id + "look here")
  try {
    const data = await pool.query(
    `SELECT * FROM public.inventory
    WHERE inv_id = $1`,
    [inventory_id]
  )
    return data.rows
  } catch (error) {
    console.error("getInventoryByInventoryId error " + error)
  }


}

// ******************************************
// ***** add new classification to nav*******
// ******************************************
// reference old asignment: https://byui-cse.github.io/cse340-ww-content/views/account-process-register.html
// current asignment: https://byui-cse.github.io/cse340-ww-content/assignments/assign4.html 

async function addClassification(classification_name){
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
    return await pool.query(sql, [classification_name])
  } catch (error) {
    return error.message
  }
}


// ******************************************
// *     add new inventory
// ******************************************
// reference old asignment: https://byui-cse.github.io/cse340-ww-content/views/account-process-register.html

async function addInventory(
  classification_id, inv_make,  inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
)
{console.log("Look here:  " + classification_id, inv_make,  inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color)
  try {
    const sql = "INSERT INTO inventory (classification_id,inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color) VALUES ($1, $2, $3, $4,$5, $6, $7, $8, $9, $10) RETURNING *"
    return await pool.query(sql, [classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color])
  } catch (error) {
    return error.message
  }
  
}





// module.exports = {getClassifications}
module.exports = {getClassifications, getInventoryByClassificationId, getInventoryByInventoryId, addClassification, addInventory};