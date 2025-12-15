# Stage 1: Build the React application
FROM node:20-alpine AS build

# Define build-time arguments
ARG VITE_API_BASE_URL
ARG VITE_STRIPE_PUBLIC_KEY

# Set them as environment variables for the build process
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_STRIPE_PUBLIC_KEY=$VITE_STRIPE_PUBLIC_KEY

WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the application for production
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:1.27-alpine

# Copy the built static files from the 'build' stage to the Nginx server directory
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80
