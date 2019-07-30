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
    drawDepartmentListing()
    inquireMain()
}

function drawDepartmentListing() {
    connection.query(`SELECT departments.department_id, departments.department_name, departments.over_head_costs, SUM(IFNULL(product_sales, 0)) AS product_sales, SUM(IFNULL(product_sales, 0))-departments.over_head_costs AS total_profit FROM products RIGHT JOIN departments ON products.department_name=departments.department_name GROUP BY departments.department_id, departments.department_name ORDER BY departments.department_id;`, function (err, res) {
        if (err) throw err;
        console.log('-------------------------------------------------------------------------------------------------------------------------')
        console.log(`| DEPARTMENT ID \t | DEPARTMENT NAME \t | OVER HEAD COSTS     \t | PRODUCT SALES\t | TOTAL PROFIT   \t|`);
        console.log('-------------------------------------------------------------------------------------------------------------------------')
        for (i = 0; i < res.length; i++) {
            console.log(`| ${res[i].department_id}               \t | ${res[i].department_name}       \t | ${res[i].over_head_costs.toFixed(2)}            \t | ${res[i].product_sales.toFixed(2)}             \t | ${res[i].total_profit.toFixed(2)}     \t|`);
        }
        console.log('-------------------------------------------------------------------------------------------------------------------------')
    });
}

function addNewDepartment(newDeparmentName, overHeadCosts) {
    connection.query(`INSERT INTO departments (department_name, over_head_costs) VALUES ('${newDeparmentName}', '${overHeadCosts}');`, function (err, res) {
        if (err) throw err;
        console.log(`New department, ${newDeparmentName}, added!\n`)
        inquireMain()
    });
}
//Inquirer////////////////////////////////////////////////////////////////////////////////////////////////////////////

function inquireMain() {
    setTimeout(function () {
        inquirer.prompt([
            {
                type: "list",
                name: "action",
                message: "Hello, Supervisor. What would you like to do today?",
                choices: ["View Product Sales by Department", "Create New Department", "Exit"]
            }
        ]).then(function (answer) {
            if (answer.action === "View Product Sales by Department") {
                showAllProducts()
            }
            else if (answer.action === "Create New Department") {
                inquireAddDepartment()
            }
            else if (answer.action === "Exit") {
                process.exit()
            }
        });
    }, 1000)
}

function inquireAddDepartment() {
    setTimeout(function () {
        inquirer.prompt([
            {
                type: "input",
                name: "name",
                message: "What is the name of the new department?"
            },
            {
                type: "input",
                name: "costs",
                message: "What is the overhead costs of the new department?"
            }
        ]).then(function (answer) {
            addNewDepartment(answer.name, answer.costs)
        })
    }, 1000)
}