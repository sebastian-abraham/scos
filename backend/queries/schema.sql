-- Drop tables in the correct order to respect dependencies.
-- 'shops' depends on 'users', so 'shops' must be dropped first.
-- Using CASCADE handles dependent objects automatically.
DROP TABLE IF EXISTS shops;
DROP TABLE IF EXISTS users CASCADE; -- CASCADE will handle dependencies like the one from shops

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

-- Insert initial data
INSERT INTO users (uuid, email, firstname, lastname, role) VALUES
('', 'sebastianabraham2006@gmail.com', '', '', 'manager');
