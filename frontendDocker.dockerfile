# Use the official Node.js image as the base image
FROM node:18-slim

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock) to install dependencies first
COPY package*.json ./

# Install the project dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Expose the port that your app will run on
EXPOSE 3001

# Set the default command to run the application
CMD ["npm", "start"]
