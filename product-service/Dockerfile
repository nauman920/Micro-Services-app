# Use official Node image
FROM node:18-alpine
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
COPY package*.json ./
RUN npm install
# Bundle app source
COPY . .
# Expose the port your app runs on
EXPOSE 5002
# Command to run your app
CMD [ "node", "server.js" ]