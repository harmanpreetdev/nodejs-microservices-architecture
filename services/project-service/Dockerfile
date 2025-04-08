# Use a Node.js base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app/services/project-service

# Copy the monorepo's base configuration
COPY tsconfig.base.json /app/tsconfig.base.json

# Copy root monorepo package files to install dependencies
COPY package.json /app/

# Copy the shared code into container
COPY shared /app/shared

# Copy service-specific package.json for proper dependency scoping

COPY services/project-service/package.json ./ 

# Copy the entire service source code
COPY services/project-service/ ./ 

# Install dependencies for the workspace
RUN npm install

# Expose the service's port
EXPOSE 5002

# Start the service
CMD ["npm", "start"]
