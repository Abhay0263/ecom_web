-- Database Initialization Script for DevOps E-Commerce Project

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100),
    image_url VARCHAR(255),
    stock INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed products
INSERT INTO products (name, description, price, category, image_url, stock) VALUES
(
    'Nouveau Lounge Chair',
    'A minimalist Scandinavian lounge chair featuring premium white bouclé fabric upholstery and a natural solid oak wood frame. Designed for ultimate ergonomic comfort and timeless lounge aesthetics.',
    649.00,
    'Chairs',
    '/assets/lounge_chair.png',
    15
),
(
    'Sylvan Pendant Light',
    'A stunning hand-blown amber glass pendant light. Features custom organic shape, brushed brass accents, and an energy-efficient warm glowing LED bulb. Creates an intimate ambient glow.',
    189.00,
    'Lighting',
    '/assets/pendant_light.png',
    24
),
(
    'Ceramic Vessel Duo',
    'Set of two hand-thrown ceramic vases. Designed with organic silhouettes, matte warm white and textured sand glaze. Perfect as standalone pieces or styling shelves.',
    75.00,
    'Decor',
    '/assets/ceramic_vases.png',
    45
),
(
    'Travertine Coffee Table',
    'A sculptural modern low coffee table carved from organic cream travertine stone. Features a honed matte surface revealing rich natural details and unique textures.',
    899.00,
    'Tables',
    '/assets/coffee_table.png',
    8
);
