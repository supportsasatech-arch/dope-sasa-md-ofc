# Use official Node.js LTS image
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Expose the port Render/Fly will assign (3000 by default)
EXPOSE 3000

# Start the bot + web panel
CMD ["npm", "start"]
