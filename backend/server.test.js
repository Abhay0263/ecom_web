const request = require('supertest');
const app = require('./server');

// Mock pg module
jest.mock('pg', () => {
  const mClient = {
    query: jest.fn(),
    release: jest.fn(),
  };
  const mPool = {
    connect: jest.fn(() => Promise.resolve(mClient)),
    query: jest.fn(),
    end: jest.fn(),
  };
  return { Pool: jest.fn(() => mPool) };
});

const { Pool } = require('pg');

describe('E-Commerce Backend API Tests', () => {
  let pool;

  beforeEach(() => {
    jest.clearAllMocks();
    pool = new Pool();
  });

  describe('GET /api/health', () => {
    it('should return UP and database status HEALTHY when DB is reachable', async () => {
      // Mock pool query to succeed
      pool.query.mockResolvedValueOnce({ rows: [{ 1: 1 }] });

      const response = await request(app).get('/api/health');
      
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe('UP');
      expect(response.body.services.database).toBe('HEALTHY');
    });

    it('should return DOWN when DB is unreachable', async () => {
      // Mock pool query to throw error
      pool.query.mockRejectedValueOnce(new Error('Connection timeout'));

      const response = await request(app).get('/api/health');
      
      expect(response.statusCode).toBe(500);
      expect(response.body.status).toBe('DOWN');
      expect(response.body.services.database).toBe('UNHEALTHY');
    });
  });

  describe('POST /api/checkout', () => {
    it('should process order and return 200 with order details', async () => {
      const orderPayload = {
        items: [
          { id: 1, name: 'Aether mechanical keyboard', quantity: 1, price: 189.99 }
        ],
        total: 189.99
      };

      const response = await request(app)
        .post('/api/checkout')
        .send(orderPayload);

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.orderId).toMatch(/^ORD-\d{6}$/);
      expect(response.body.message).toContain('Order processed successfully');
    });

    it('should return 400 when cart is empty', async () => {
      const response = await request(app)
        .post('/api/checkout')
        .send({ items: [], total: 0 });

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('Cart is empty');
    });
  });
});
