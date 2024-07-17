# syntax=docker/dockerfile:1.4
FROM node:22 AS build

# Set workdir
WORKDIR /app

# Copy the code
COPY . /app

# Install dependencies and build application
RUN \
    yarn install && \
    yarn run build

# syntax=docker/dockerfile:1.4
FROM node:22

LABEL org.opencontainers.image.source = "https://github.com/EVE-KILL/Frontend"

# Set workdir
WORKDIR /app

# Copy the build folder from the first stage
COPY --from=build /app/build /app

# Create a package.json that sets the type to module
RUN echo "{ \"type\": \"module\" }" > /app/package.json

# Expose the port
EXPOSE 3000
CMD [ "node", "index.js" ]
