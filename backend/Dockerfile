# Stage 1: Base image with production dependencies
FROM node:20-alpine AS base
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./

# Use --omit=dev to not install devDependencies
RUN npm install --omit=dev

# Stage 2: Production image
FROM node:20-alpine AS production
WORKDIR /usr/src/app

# Copy dependencies from the base stage
COPY --from=base /usr/src/app/node_modules ./node_modules

# Copy the rest of your application code
COPY . .

# Expose the port the app runs on
EXPOSE 3001

CMD ["npm", "run", "start"]
