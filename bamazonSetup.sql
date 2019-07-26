CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
	item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(255),
    department_name VARCHAR(255),
    price FLOAT,
    stock_quantity INT,
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('phone', 'electronics', 499.99, 5);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('watch', 'electronics', 249.99, 7);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('video game', 'electronics', 59.99, 10);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('chair', 'furniture', 69.99, 9);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('couch', 'furniture', 899.99, 3);

INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('soup', 'food', 1.49, 40);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('banana', 'food', 0.29, 50);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('bread', 'food', 2.99, 20);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('taco', 'food', 2.49, 10);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('yogurt', 'food', 1.29, 15);