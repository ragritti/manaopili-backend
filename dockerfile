# Use an official Node.js runtime as a parent image
FROM node:18-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Install common dependencies required by Puppeteer
RUN apt-get update && apt-get install -y \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxi6 \
    libxtst6 \
    libxrandr2 \
    libasound2 \
    libpangocairo-1.0-0 \
    libatk1.0-0 \
    libcups2 \
    libxss1 \
    libgconf-2-4 \
    libpango1.0-0 \
    libgbm1 \
    libatk-bridge2.0-0 \
    libgtk-3-0 \
    libxshmfence1 \
    lsb-release \
    xdg-utils \
    wget \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Puppeteer
RUN npm install puppeteer

# Rebuild canvas module if necessary
RUN npm rebuild canvas

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3001

# Command to run the application
CMD ["node", "server.js"]
