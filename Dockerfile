# Use the official Node.js 18 image as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and yarn.lock files to the working directory
COPY package.json yarn.lock ./

# Install the application dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the application code to the working directory
COPY . .
COPY ./.env .

# Build the NestJS application
RUN yarn build

# Expose the port the app runs on
EXPOSE 3000

# Set the command to run the application
CMD ["yarn", "start-with-migrations"]