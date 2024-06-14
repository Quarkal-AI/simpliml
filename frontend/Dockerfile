# Use the official Node.js image as the base  
FROM node:20.6.0-alpine3.18 

# Set the working directory inside the container  
WORKDIR /app 

# Copy the app source code to the container  
COPY . . 

# Build the Next.js app  
RUN npm install && npm run build  

# Expose the port the app will run on  
EXPOSE 3000  

# Start the app  
CMD ["npm", "start"]