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
            console.log(`| ${res[i].product_name}     \t | ${res[i].item_id} \t | ${res[i].department_name}     \t | ${res[i].price}     \t | ${res[i].stock_quantity}               \t|`);
        }
        console.log('-----------------------------------------------------------------------------------------')
    });
}

function viewLowInventory() {
    console.log(`Showing items with stock quantities less than 5:`)
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log('-----------------------------------------------------------------------------------------')
        console.log(`| NAME     \t | ID \t | DEPARTMENT      \t | PRICE: \t | STOCK QUANTITY:   \t|`);
        console.log('-----------------------------------------------------------------------------------------')
        for (i = 0; i < res.length; i++) {
            if (res[i].stock_quantity < 5) {
                console.log(`| ${res[i].product_name}     \t | ${res[i].item_id} \t | ${res[i].department_name}     \t | ${res[i].price}     \t | ${res[i].stock_quantity}               \t|`);
            }
        }
        console.log('-----------------------------------------------------------------------------------------')
    });
}

function increaseStock(itemID, desiredAddAmount) {
    console.log("Adding more to your stockpile...");
    let currentStockCount = 0;
    connection.query(
        `SELECT * FROM products WHERE item_id=${itemID}`,
        function (err, res) {
            if (err) throw err;
            currentStockCount = (res[0].stock_quantity)
            let newStockTotal = (currentStockCount + parseInt(desiredAddAmount))
            
            connection.query(
                "UPDATE products SET ? WHERE ?",
                [
                    {
                        stock_quantity: newStockTotal
                    },
                    {
                        item_id: itemID
                    }
                ],
                function (err, res) {
                    if (err) throw err;
                }
            );
            console.log(`Done. You now have ${newStockTotal} of these items in stock. \n`)
            showAllProducts()
        }
    );
};

function addNewItem(name, department, price, initialStock) {
    console.log("Making room for the new item...");
    connection.query(
        "INSERT INTO products SET ?",
        [
            {
                name: name
            },
            {
                department: department
            },
            {
                price: price
            },
            {
                initialStock: initialStock
            }
        ],
        function (err, res) {
            if (err) throw err;
        }
    );
    console.log(`The new item has been added! \n`)
    showAllProducts()
};

//Inquirer////////////////////////////////////////////////////////////////////////////////////////////////////////////

function runInquirer() {
    inquirer.prompt([
        {
            type: "list",
            name: "action",
            message: "Hello, Manager. What would you like to do today?",
            choices: ["Show all products", "View low inventory", "Increase stock", "Add new item"]
        }
    ]).then(function (answer) {
        if (answer.action === "Show all products") {
            showAllProducts()
        }
        else if (answer.action === "View low inventory") {
            viewLowInventory()
        }
        else if (answer.action === "Increase stock") {
            showAllProducts()
            setTimeout(function () {
                inquireIncreaseStock()
            }, 1000);
        }
        else if (answer.action === "Add new item") {

        }
    });
}

function inquireIncreaseStock() {
    inquirer.prompt([
        {
            type: "input",
            name: "itemID",
            message: "Enter the Item ID for which you would like to increase the stock quantity."
        },
        {
            type: "input",
            name: "increaseAmount",
            message: "How much of this item would you like to re-order?"
        }
    ]).then(function (answer) {
        increaseStock(answer.itemID, answer.increaseAmount)
    })
}

function inquireAddNewItem() {
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