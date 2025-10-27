-- Drop tables in the correct order to respect dependencies.
-- 'shops' depends on 'users', so 'shops' must be dropped first.
-- Using CASCADE handles dependent objects automatically.
DROP TABLE IF EXISTS shops;
DROP TABLE IF EXISTS users CASCADE; -- CASCADE will handle dependencies like the one from shops
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS items;

-- User table schema
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    uuid VARCHAR(128) UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    firstname VARCHAR(50),
    lastname VARCHAR(50),
    imageurl TEXT,
    role VARCHAR(50) DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shop table schema
CREATE TABLE shops (
    id SERIAL PRIMARY KEY,
    -- Foreign key to the Users table.
    shopkeeper_id INT NOT NULL, 
    -- Shop Details
    name VARCHAR(100) NOT NULL,
    location VARCHAR(255),
    -- Stores the raw image file directly in the database.
    shop_image BYTEA, 
    -- Default Operating Hours
    open_time TIME,
    close_time TIME,
    -- To activate/deactivate the shop
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Link to the shopkeeper (user)
    FOREIGN KEY (shopkeeper_id) 
        REFERENCES users(id) 
        ON DELETE RESTRICT -- Prevents deleting a user if they own a shop
);


CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    -- The shop this item belongs to
    shop_id INT NOT NULL, 
    name VARCHAR(100) NOT NULL,
    description TEXT,
    -- Using DECIMAL for currenc
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0), 
    -- Storing the URL
    image_url TEXT,
    -- For filters like 'Veg', 'Non-Veg', 'Spicy'
    tags TEXT[], 
    -- This is the "In Stock" toggle for the shopkeeper
    quantity INT DEFAULT 0 CHECK (quantity_available >= 0), 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Links the item to its shop
    FOREIGN KEY (shop_id) 
        REFERENCES shops(id) 
        ON DELETE CASCADE -- If a shop is deleted, all its items are deleted
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    -- The student (from the 'users' table) who placed the order
    student_id INT NOT NULL, 
    -- The shop the order was placed at
    shop_id INT NOT NULL, 
    total_amount DECIMAL(10, 2) NOT NULL,
    
    -- Using VARCHAR with a CHECK constraint is flexible
    order_status VARCHAR(50) NOT NULL DEFAULT 'Pending' 
        CHECK (order_status IN (
            'Pending', 
            'In Progress', 
            'Ready for Pickup', 
            'Completed', 
            'Cancelled'
        )),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- This is the order time
    -- Links to the student
    FOREIGN KEY (student_id) 
        REFERENCES users(id)
        ON DELETE RESTRICT, -- Don't delete a user if they have orders
    -- Links to the shop
    FOREIGN KEY (shop_id) 
        REFERENCES shops(id)
        ON DELETE RESTRICT -- Don't delete a shop if it has orders
);

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    -- The order this entry belongs to
    order_id INT NOT NULL, 
    -- The item that was ordered
    item_id INT NOT NULL, 
    quantity INT NOT NULL CHECK (quantity > 0),
    
    FOREIGN KEY (order_id) 
        REFERENCES orders(id)
        ON DELETE CASCADE, -- If an order is deleted, remove its line items
        
    FOREIGN KEY (item_id) 
        REFERENCES items(id)
        ON DELETE RESTRICT -- Don't delete an item if it's part of an order history
);



-- Insert initial data
INSERT INTO users (uuid, email, firstname, lastname, role) VALUES
('', 'sebastianabraham2006@gmail.com', '', '', 'manager'),
('', '@gmail.com', '', '', 'manager');
