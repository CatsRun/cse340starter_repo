
const pool = require("../database")


/* *****************************
*   Register new account
* *************************** */
// https://byui-cse.github.io/cse340-ww-content/views/account-process-register.html 

async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try {
      const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
      return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
      return error.message
    }
  }

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
    try {
      const sql = "SELECT * FROM account WHERE account_email = $1"
      const email = await pool.query(sql, [account_email])
      return email.rowCount
    } catch (error) {
      return error.message
    }
  }


  /* *****************************
* Return account data using email address
* ***************************** */
// https://blainerobertson.github.io/340-js/views/login.html
// this uses a cookie
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

 /* *****************************
* Return account data using account id
* ***************************** */
// https://blainerobertson.github.io/340-js/views/login.html
// this uses a cookie

// ***where do I use this?***
async function getAccountByAccountId (account_id) {
  try {
    const result = await pool.query(
      // 'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_id = $1',
      'SELECT account_id FROM account WHERE account_id = $1',
      [account_id])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching account found")
  }
}

 /* *****************************
* Update Account Data by account id
* ***************************** */
// where do I use this?
async function updateAccountData(
  account_firstname,
  account_lastname,
  account_email,
  account_id,
) {
  try {console.log(account_firstname + "  test 4 does cont update accnt work?")
    const sql =

    "UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *"

    const data = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_id,
    ])
    return data.rows[0]
  } catch (error) {console.log(account_firstname + "  test 5 does cont update accnt work?")
    // console.error("model error: " + error)
    return error.message
  }
}


/* *****************************
* Update Password by account id
* ***************************** */
// where do I use this?
async function updateAccountPassword(
  // account_password
  account_id, 
  hashedPassword
) {
  try {
    const sql =

    "UPDATE public.account SET account_password = $1, WHERE account_id = $2 RETURNING *"

    const data = await pool.query(sql, [
      // account_password
      account_id,
      hashedPassword
    ])
    return data.rows[0]

  } catch (error) {
    console.error("model error: " + error)
  }
}

/* *****************************
* Gets reviews based on the account id
* Use this to organize by user
* final project
* ***************************** */
async function getReviewByAccount_id (
  account_id
) {
  try {
    const result = await pool.query(

      `SELECT * FROM review WHERE account_id = $1 ORDER BY review_date DESC;`,
      // "SELECT * FROM review WHERE account_id = $1 ORDER BY review_date DESC;",
      [account_id])

      return result.rows
  } catch (error) {
    console.error("model error: " + error)
  }
}





  module.exports = {registerAccount, checkExistingEmail, getAccountByEmail, getAccountByAccountId, updateAccountData, updateAccountPassword,getReviewByAccount_id}

  // module.exports = {registerAccount, checkExistingEmail}