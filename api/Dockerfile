# Use the official Node.js image as the base image
FROM node:22.19-alpine AS builder

RUN npm install -g pnpm

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./
COPY prisma ./prisma

# Install the application dependencies
RUN pnpm install

# Copy the rest of the application files
COPY . .

# Generate the Prisma client
RUN pnpm run prisma:generate

# Build the NestJS application
RUN pnpm run build

FROM node:22.19-alpine

WORKDIR /app

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma

# DATABASE_URL will be provided by docker-compose

# Expose the application port
EXPOSE 8080

# Command to run migrations and then start the application
CMD ["npm", "run", "start:migrate:prod"]