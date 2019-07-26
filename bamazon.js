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
    showAllProducts();
});

//Functions////////////////////////////////////////////////////////////////////////////////////////////////////////////

function showAllProducts() {
    console.log("Showing all products...\n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        for (i = 0; i < res.length; i++) {
            console.log(`*** ${res[i].product_name} ***`);
            console.log(`Item ID: ${res[i].item_id}`);
            console.log(`Department: ${res[i].department_name}`);
            console.log(`Price: ${res[i].price}`);
            console.log(`Stock Quantity: ${res[i].stock_quantity}`);
            console.log('\n')
        }
        connection.end();
    });
}