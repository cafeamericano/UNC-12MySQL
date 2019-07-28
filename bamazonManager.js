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
    inquireMain()
});

//Functions////////////////////////////////////////////////////////////////////////////////////////////////////////////

function showAllProducts() {
    console.log(`Showing current inventory list:`)
    drawFullInventory()
    inquireMain()
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
    inquireMain()
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
            inquireMain()
        }
    );
};

function addNewItem(name, department, price, initialStock) {
    console.log("Making room for the new item...");
    connection.query(
        "INSERT INTO products SET ?",
        [
            {
                product_name: name,
                department_name: department,
                price: parseFloat(price),
                stock_quantity: parseInt(initialStock)
            }
        ],
        function (err, res) {
            if (err) throw err;
        }
    );
    console.log(`The new item has been added! \n`)
    showAllProducts()
};

function drawFullInventory() {
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
//Inquirer////////////////////////////////////////////////////////////////////////////////////////////////////////////

function inquireMain() {
    setTimeout(function () {
        inquirer.prompt([
            {
                type: "list",
                name: "action",
                message: "Hello, Manager. What would you like to do today?",
                choices: ["Show all products", "View low inventory", "Increase stock", "Add new item", "Exit"]
            }
        ]).then(function (answer) {
            if (answer.action === "Show all products") {
                showAllProducts()
            }
            else if (answer.action === "View low inventory") {
                viewLowInventory()
            }
            else if (answer.action === "Increase stock") {
                drawFullInventory()
                setTimeout(function () {
                    inquireIncreaseStock()
                }, 1000);
            }
            else if (answer.action === "Add new item") {
                inquireAddNewItem()
            }
            else if (answer.action === "Exit") {
                process.exit()
            }
        });
    }, 1000)
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
            type: "input",
            name: "name",
            message: "What is the name of the new item?"
        },
        {
            type: "input",
            name: "department",
            message: "To what department will the new item belong?"
        },
        {
            type: "input",
            name: "price",
            message: "How much will the new product cost?"
        },
        {
            type: "input",
            name: "initialStock",
            message: "How many of the item should we have in initial stock?"
        },
    ]).then(function (answer) {
        addNewItem(answer.name, answer.department, answer.price, answer.initialStock)
    })
}