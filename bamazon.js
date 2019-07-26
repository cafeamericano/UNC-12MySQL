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
    checkCurrentStock(11, 1000);
    showAllProducts()
});

//Functions////////////////////////////////////////////////////////////////////////////////////////////////////////////

function showAllProducts() {
    console.log("Showing all products...\n");
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

function checkCurrentStock(itemID, desiredQuantity) {
    console.log("Seeing how many we have in stock...\n");
    connection.query(`SELECT * FROM products WHERE item_id='${itemID}'`, function (err, res) {
        if (err) throw err;
        console.log(`*** ${res[0].product_name} ***`);
        console.log(`Stock Quantity: ${res[0].stock_quantity}`);
        let currentStockCount = res[0].stock_quantity
        let unitPrice = res[0].price
        if (currentStockCount < desiredQuantity) {
            console.log('Insufficient quantity!')
            return
        } else {
            decreaseStock(itemID, currentStockCount, desiredQuantity, unitPrice)
        }
    })
};

function decreaseStock(itemID, currentStockCount, desiredQuantity, unitPrice) {
    console.log("Pulling from the shelf...\n");
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
    console.log(`Done. The total cost is ${unitPrice * desiredQuantity}`)
};