# --- Build / Test Stage ---
FROM node:18-alpine AS builder
WORKDIR /usr/src/app

# Install build dependencies
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

# Run unit tests to verify build integrity before packing (critical CI step)
RUN npm test

# --- Production Stage ---
FROM node:18-alpine AS runner
WORKDIR /usr/src/app

# Set environment to production
ENV NODE_ENV=production

# Copy package descriptors and install only production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy source code from the builder (excluding test artifacts)
COPY server.js ./

# Set security context: Run as non-root user 'node'
USER node

# Expose backend service port
EXPOSE 5000

# Start application
CMD ["node", "server.js"]
