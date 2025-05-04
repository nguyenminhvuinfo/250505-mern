# Use Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Set environment to development
ENV NODE_ENV=development

# Install all dependencies including devDependencies
RUN npm install

# Copy rest of the source code
COPY . .

# Expose backend port (nếu có)
EXPOSE 5000

# Start app
CMD ["npm", "run", "dev"]
