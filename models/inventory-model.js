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
  // console.log(inventory_id + "look here")
  try {
    const data = await pool.query(
    `SELECT * FROM public.inventory
    WHERE inv_id = $1`,
    [inventory_id]
  )
  console.log(data.rows + "data.rows inv get")
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
{
  try {
    const sql = 
    "INSERT INTO inventory (classification_id,inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color) VALUES ($1, $2, $3, $4,$5, $6, $7, $8, $9, $10) RETURNING *"
    return await pool.query(sql, [
      classification_id, 
      inv_make, inv_model, 
      inv_year, inv_description, 
      inv_image, inv_thumbnail, 
      inv_price, 
      inv_miles, 
      inv_color])
  } catch (error) {
    return error.message
  }
  
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
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
  inv_id
) {
  try {
    const sql =

      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_year = $3, inv_description = $4, inv_image = $5, inv_thumbnail = $6, inv_price = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
// console.log(inv_id + " look here for update inv_id")
      // console.log(
      //   inv_make + " Ford  "+
      // inv_model +" inv_model  " +
      // inv_year +" inv_year  " +
      // inv_description +"inv_description  ",
      // inv_image +"inv_image  ",
      // inv_thumbnail +"inv_thumbnail  ",
      // inv_price +"inv_price  " +
      // inv_miles +" inv_miles  ",
      // inv_color +" inv_color  ",
      // classification_id +"classification_id  ",
      // inv_id + "inv_id  "
      // )
    const data = await pool.query(sql, [
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
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}


/* ***************************
 *  Delete Inventory Item
 * ************************** */
// this will delete an inventory item
async function deleteInventoryItem(
  inv_id 
) {
  
  try {
    const sql ='DELETE FROM inventory WHERE inv_id = $1'
    const data = await pool.query(sql, [ inv_id ])
    return data
  } catch (error) {
    // new error("Delete Inventory Error" )
    console.error("model error: " + error)
    // return error.message
  }
}


/* ***************************
 *  Review Inventory Item
 *  final project
 * ************************** */
async function reviewItem(
  review_text,
  // review_date,
  inv_id,
  account_id,
) {
  
  const review_date = new Date()
  try {
    console.log(inv_id + " 11.5 inv_id")
    const sql =

      "INSERT INTO public.review ( review_text, review_date, inv_id, account_id ) VALUES ($1, $2, $3, $4 ) RETURNING *"


  return await pool.query(sql, [
  review_text,
  review_date,
  inv_id,
  account_id,
])
  } catch (error) {
    console.error("model error: " + error)
  }
}


/* *****************************
* Gets reviews based on the review id
* Use this to organize by inventory (vehicle)
* Ordered by review_datedecending
* final project
* ***************************** */
async function getReviewByInv_id (
  inv_id
) {
  // console.log(inv_id +' 19.5 inv_id')
  try {
    const result = await pool.query(

      `SELECT * FROM review WHERE inv_id = $1 ORDER BY review_date DESC;`,
      [inv_id])

      // console.log(result.rows +' 19.75 result')
      return result.rows
  } catch (error) {
    console.error("model error: " + error)
  }
}





// module.exports = {getClassifications}
module.exports = {getClassifications, getInventoryByClassificationId, getInventoryByInventoryId, addClassification, addInventory, updateInventory, deleteInventoryItem, reviewItem, getReviewByInv_id};