//Requirements
var mysql = require('mysql')
var dbkeys = require('./dbkeys')

//Define Database Connection
var connection = mysql.createConnection({
    host: dbkeys.Xhost,
    user: dbkeys.Xuser,
    password: dbkeys.Xpassword,
    database: dbkeys.Xdatabase,
});

//What to do when database connects
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    checkStock(11, 2);
});

//Functions////////////////////////////////////////////////////////////////////////////////////////////////////////////

function showAllProducts() {
    console.log(`Showing current inventory list:`)
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log('-----------------------------------------------------------------------------------------')
        console.log(`| NAME     \t | ID \t | DEPARTMENT      \t | PRICE: \t | STOCK QUANTITY:   \t|`);
        console.log('-----------------------------------------------------------------------------------------')
        for (i = 0; i < res.length; i++) {
            console.log(`| ${res[i].product_name}     \t | ${res[i].item_id} \t | ${res[i].department_name}     \t | ${res[i].price}     \t | ${res[i].stock_quantity}            \t|`);
        }
        console.log('-----------------------------------------------------------------------------------------')
        connection.end()
    });
}

function checkStock(itemID, desiredQuantity) {
    console.log("Seeing how many of those we have in stock...");
    connection.query(`SELECT * FROM products WHERE item_id='${itemID}'`, function (err, res) {
        if (err) throw err;
        let currentStockCount = res[0].stock_quantity
        let unitPrice = res[0].price
        console.log(`You're looking for ${desiredQuantity} ${res[0].product_name}s. We have ${res[0].stock_quantity} in stock.`);
        if (currentStockCount < desiredQuantity) {
            console.log('Sorry! Insufficient quantity!')
            return
        } else {
            decreaseStockAndShowAll(itemID, currentStockCount, desiredQuantity, unitPrice)
        }
    })
};

function decreaseStockAndShowAll(itemID, currentStockCount, desiredQuantity, unitPrice) {
    console.log("Pulling from the shelf...");
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: (currentStockCount - desiredQuantity)
            },
            {
                item_id: itemID
            }
        ],
        function (err, res) {
            if (err) throw err;
        }
    );
    console.log(`Done. The total cost is $${unitPrice * desiredQuantity}\n`)
    showAllProducts()
};