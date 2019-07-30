-- USE bamazon;

-- CREATE TABLE departments (
-- 	department_id INT NOT NULL AUTO_INCREMENT,
--     department_name VARCHAR(255),
--     over_head_costs FLOAT,
--     PRIMARY KEY (department_id)
-- );

-- ALTER TABLE products ADD product_sales FLOAT;

-- SET SQL_SAFE_UPDATES = 0;
-- UPDATE products SET product_sales = 0 WHERE product_sales IS NULL;
-- ALTER TABLE products MODIFY COLUMN product_sales FLOAT NOT NULL DEFAULT 0;
-- SET SQL_SAFE_UPDATES = 0;

-- INSERT INTO departments (department_name, over_head_costs) VALUES ('electronics', 10000);
-- INSERT INTO departments (department_name, over_head_costs) VALUES ('clothing', 3000);
-- INSERT INTO departments (department_name, over_head_costs) VALUES ('furniture', 8000);
-- INSERT INTO departments (department_name, over_head_costs) VALUES ('food_grocery', 2000);
-- INSERT INTO departments (department_name, over_head_costs) VALUES ('hardware', 5000);

-- SET sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));

SELECT departments.department_id, departments.department_name, departments.over_head_costs, SUM(IFNULL(product_sales, 0)) AS product_sales, SUM(IFNULL(product_sales, 0))-departments.over_head_costs AS total_profit
FROM products 
RIGHT JOIN departments ON products.department_name=departments.department_name 
GROUP BY departments.department_name 
ORDER BY departments.department_id;