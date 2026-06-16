const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Log requests
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// PostgreSQL Connection Pool Setup
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'ecom_user',
    password: process.env.DB_PASSWORD || 'ecom_secure_password',
    database: process.env.DB_NAME || 'ecom_db',
});

// Graceful database connection retry logic
let dbConnected = false;
async function connectWithRetry(retries = 5, delay = 5000) {
    while (retries > 0) {
        try {
            const client = await pool.connect();
            console.log('Successfully connected to the PostgreSQL database.');
            client.release();
            dbConnected = true;
            break;
        } catch (err) {
            console.error(`Database connection failed. Retrying in ${delay / 1000}s... (${retries} retries left)`);
            console.error(err.message);
            retries -= 1;
            await new Promise(res => setTimeout(res, delay));
        }
    }
    if (!dbConnected) {
        console.error('Could not connect to database after maximum retries. Continuing but database queries will fail.');
    }
}

// Initialize database connection
connectWithRetry();

// --- API Endpoints ---

// 1. Healthcheck Endpoint (Used by Docker healthchecks / Jenkins / Orchestrators)
app.get('/api/health', async (req, res) => {
    try {
        // Query pg to check if database is alive
        const dbCheck = await pool.query('SELECT 1');
        res.status(200).json({
            status: 'UP',
            timestamp: new Date().toISOString(),
            services: {
                database: 'HEALTHY',
                api: 'HEALTHY'
            }
        });
    } catch (err) {
        res.status(500).json({
            status: 'DOWN',
            timestamp: new Date().toISOString(),
            services: {
                database: 'UNHEALTHY',
                api: 'HEALTHY'
            },
            error: err.message
        });
    }
});

// 2. Fetch All Products (with optional category filter)
app.get('/api/products', async (req, res) => {
    const { category } = req.query;
    try {
        let queryText = 'SELECT * FROM products ORDER BY id ASC';
        let values = [];

        if (category) {
            queryText = 'SELECT * FROM products WHERE category = $1 ORDER BY id ASC';
            values = [category];
        }

        const result = await pool.query(queryText, values);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching products:', err.message);
        res.status(500).json({ error: 'Database query error' });
    }
});

// 3. Fetch Single Product
app.get('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching product details:', err.message);
        res.status(500).json({ error: 'Database query error' });
    }
});

// 4. Mock Cart / Checkout endpoint (receives cart data and simulates transaction)
app.post('/api/checkout', (req, res) => {
    const { items, total } = req.body;
    if (!items || !items.length) {
        return res.status(400).json({ error: 'Cart is empty' });
    }

    console.log(`Processing mock order. Items count: ${items.length}, Order Total: $${total}`);
    
    // Simulate payment / processing success
    return res.status(200).json({
        success: true,
        orderId: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
        message: 'Order processed successfully! Thank you for your purchase.'
    });
});

// Export app for testing, but start server only if run directly
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Backend server running on port ${PORT}`);
    });
}

module.exports = app;
