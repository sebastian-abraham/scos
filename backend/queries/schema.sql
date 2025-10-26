DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS shops;

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

CREATE TABLE shops (
    id SERIAL PRIMARY KEY,
    
    -- Foreign key to the Users table.
    -- Your app will find the user_id associated with the selected email.
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
        REFERENCES Users(id) 
        ON DELETE RESTRICT -- Prevents deleting a user if they own a shop
);

insert into users (uuid, email, firstname, lastname, role) values
('', 'sebastianabraham2006@gmail.com', '', '', 'manager');