# Stage 1: Build the React application
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./ 
RUN npm run build

# Stage 2: Serve the application using serve
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/build ./
RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", ".", "-l", "3000"]