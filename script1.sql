-- Drop existing tables and types if they exist
DROP TYPE IF EXISTS photo_state CASCADE;
DROP TABLE IF EXISTS photos CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create enum for photo states
CREATE TYPE photo_state AS ENUM ('booked', 'sold', 'available');

-- Create users table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_salt VARCHAR(50) NOT NULL, --non deve essere unique
    password_hash VARCHAR(50) NOT NULL, --non deve essere unique
    email VARCHAR(100) UNIQUE NOT NULL,
    verified TIMESTAMP DEFAULT NULL,
    admin SMALLINT NOT NULL DEFAULT 0,
    collaborator SMALLINT NOT NULL DEFAULT 0
);

-- Create sessions table
CREATE TABLE sessions (
    session_id SERIAL PRIMARY KEY,
    token varchar(44) NOT NULL,
    created TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires TIMESTAMPTZ NOT NULL DEFAULT NOW() + interval '7 days',
    expired boolean DEFAULT false,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE
);

-- Create products table
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    available INT NOT NULL,
    booked INT NOT NULL,
    sold INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL
);

-- Create photos table
CREATE TABLE photos (
    photo_id SERIAL PRIMARY KEY,
    path VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(100) UNIQUE NOT NULL,
    original_title VARCHAR(100) UNIQUE NOT NULL,
    year SMALLINT NOT NULL,
    place VARCHAR(100) NOT NULL,
    description TEXT,
    state photo_state NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    booked_by INT REFERENCES users(user_id) ON DELETE SET NULL
);

CREATE OR REPLACE FUNCTION fn_reset_photo_state()
RETURNS TRIGGER AS $$
BEGIN
    -- Controlla se booked_by è cambiato in NULL
    IF NEW.booked_by IS NULL AND OLD.booked_by IS NOT NULL THEN
        NEW.state := 'available';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_after_unbooking
BEFORE UPDATE OF booked_by ON photos
FOR EACH ROW
EXECUTE FUNCTION fn_reset_photo_state();