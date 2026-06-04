# 1. Use a lightweight version of Node.js
FROM node:20-alpine

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy only package files first (to cache dependencies)
COPY package*.json ./

# 4. Install production dependencies
RUN npm install --omit=dev

# 5. Copy the rest of your application code
COPY . .

# 6. Expose the port your app runs on
EXPOSE 3000

# 7. Start the application
CMD ["npm", "start"]