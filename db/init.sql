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

-- Seed products (Royal Antique + Semi-Modern Workspace & Home Design)
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
    'Travertine Coffee Table',
    'A sculptural modern low coffee table carved from organic cream travertine stone. Features a honed matte surface revealing rich natural details and unique textures.',
    899.00,
    'Furniture',
    '/assets/coffee_table.png',
    8
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
    'Antique Brass Desk Lamp',
    'A classic library desk lamp featuring a polished emerald green glass shade, heavy brushed solid brass base, and dimmable warm vintage LED bulb. A timeless addition to high-end desks.',
    220.00,
    'Lighting',
    '/assets/brass_desk_lamp.png',
    18
),
(
    'Antique Brass Hourglass',
    'A beautifully sculpted 30-minute marine hourglass made of solid antiqued brass and hand-blown glass, filled with dark volcanic sand. A perfect combination of vintage charm and modern lines.',
    120.00,
    'Gadgets',
    '/assets/brass_hourglass.png',
    30
),
(
    'Gramophone Speaker',
    'An acoustic gramophone speaker featuring a hand-spun copper horn and a modern walnut wood block base. Blends classic acoustic amplification with integrated modern Bluetooth connectivity.',
    349.00,
    'Gadgets',
    '/assets/gramophone_speaker.png',
    12
),
(
    'Mechanical Watch Stand',
    'A sculptural walnut wood and brass stand holding an open-heart mechanical skeleton pocket watch. Displays ticking gold gears through crystal glass, serving as an active desktop sculpture.',
    85.00,
    'Gadgets',
    '/assets/pocket_watch_stand.png',
    25
),
(
    'Imperial Leather Desk Mat',
    'Hand-crafted full-grain Italian leather desk mat in deep chestnut brown. Embellished with subtle gold-foiled geometric borders and modern anti-slip backing.',
    95.00,
    'Decor',
    '/assets/leather_desk_mat.png',
    40
),
(
    'Organic Ceramic Vases',
    'A set of three minimalist ceramic vases featuring organic textures and neutral earthy tones. Perfect for displaying dried botanicals or standing as independent art pieces.',
    65.00,
    'Decor',
    '/assets/ceramic_vases.png',
    20
),
(
    'Smart Ambient Light',
    'An elegant smart ambient light bar offering customizable color spectrums, reactive music syncing, and seamless smart home integration. Housed in a sleek dark aluminum shell.',
    149.00,
    'Lighting',
    '/assets/smart_ambient_light.png',
    15
);

