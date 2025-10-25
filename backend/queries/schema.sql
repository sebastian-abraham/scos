DROP TABLE IF EXISTS users;

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
