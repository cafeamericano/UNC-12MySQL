//Requirements
var mysql = require('mysql')
var dbkeys = require('./dbkeys')
var inquirer = require("inquirer");

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
    showAllProducts()
    setTimeout(function () {
        runInquirer()
    }, 1000);
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
            console.log('Sorry! Insufficient quantity!\n')
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
    console.log(`Done. The total cost is $${(unitPrice * desiredQuantity).toFixed(2)}\n`)
    showAllProducts()
};

//Inquirer////////////////////////////////////////////////////////////////////////////////////////////////////////////

function runInquirer() {
    inquirer.prompt([
        {
            type: "input",
            name: "itemID",
            message: "Enter the item ID of the product that you would like to purchase."
        },
        {
            type: "input",
            name: "quantity",
            message: "How many of these would you like to purchase?",
        }
    ]).then(function (answer) {
        checkStock(answer.itemID, answer.quantity)
        setTimeout(function () {
            askClientToBuyMore()
        }, 1000);
    });
}

function askClientToBuyMore() {
    inquirer.prompt([
        {
            type: "confirm",
            name: "buyMore",
            message: "Would you like to make another purchase?"
        },
    ]).then(function (clientWill) {
        if (clientWill.buyMore) {
            runInquirer()
        } else {
            console.log(`\n Goodbye! \n`)
            process.exit()
        }
    })
}