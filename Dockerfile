# Simple single-stage Dockerfile (fallback)
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Clean cache and install dependencies
RUN npm cache clean --force
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Remove dev dependencies to reduce size
RUN npm prune --production

# Expose port
EXPOSE $PORT

# Set environment
ENV NODE_ENV=production

# Start command
CMD ["npm", "start"]
