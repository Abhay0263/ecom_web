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

-- Seed products (Combined Workspace Furniture & Premium Electronics)
INSERT INTO products (name, description, price, category, image_url, stock) VALUES
(
    'Nouveau Lounge Chair',
    'A minimalist Scandinavian lounge chair featuring premium white bouclé fabric upholstery and a natural solid oak wood frame. Designed for ultimate ergonomic comfort and timeless lounge aesthetics.',
    649.00,
    'Furniture',
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
    'Furniture',
    '/assets/coffee_table.png',
    8
),
(
    'Aether Mechanical Keyboard',
    'A premium 75% wireless mechanical keyboard featuring hot-swappable tactile switches, double-shot PBT keycaps, dynamic warm amber backlight, and a CNC-machined dark aluminum casing.',
    189.99,
    'Keyboards',
    '/assets/cyber_keyboard.png',
    42
),
(
    'Vortex Studio Headphones',
    'High-fidelity active noise-canceling headphones with 40mm dynamic drivers, custom acoustic chamber, 45-hour battery life, and ultra-plush memory foam ear cups for ultimate focus.',
    299.99,
    'Audio',
    '/assets/studio_headphones.png',
    25
),
(
    'Zenith Ergonomic Mouse',
    'Precision engineered vertical ergonomic wireless mouse. Reduces wrist strain with a 57-degree vertical angle, high-precision 4000 DPI sensor, and silent metal scroll wheel.',
    89.50,
    'Peripherals',
    '/assets/ergonomic_mouse.png',
    60
),
(
    'Aura Wireless Earbuds',
    'Premium active noise-canceling earbuds. Featuring audiophile-grade dynamic drivers, IPX5 sweat resistance, intelligent ambient awareness, and a compact matte-finish charging case.',
    159.00,
    'Audio',
    '/assets/earbuds.png',
    35
);
