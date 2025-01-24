-- assignment 2 task 1 step 5.1
INSERT INTO account (
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
VALUES (
        'Tony',
        'Stark',
        'tony@startent.com',
        'Iam1ronM@n'
    );
-- assignment 2 task 1 step 5.2
UPDATE account
SET account_type = 'Admin'
WHERE account_id = 1;
-- assignment 2 task 1 step 5.3
DELETE FROM account
WHERE account_id = 1;
-- assignment 2 task 1 step 5.4
UPDATE inventory
SET inv_description = REPLACE(
        inv_description,
        'small interiors',
        'a huge interior'
    );
-- assignment 2 task 1 step 5.5
SELECT inventory.inv_make,
    inventory.inv_model,
    classification_name
FROM inventory
    INNER JOIN classification ON inv_model = classification_name;
-- assignment 2 task 1 step 5.6
UPDATE inventory
SET inv_image = REPLACE(inv_image, 'images', 'images/vehicles'),
    inv_thumbnail = REPLACE(inv_thumbnail, 'images', 'images/vehicles');