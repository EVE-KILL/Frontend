# syntax=docker/dockerfile:1.4
FROM bitnami/minideb:latest

LABEL org.opencontainers.image.source = "https://github.com/EVE-KILL/Frontend"

# Run as root
USER root

# Non interactive
ENV DEBIAN_FRONTEND=noninteractive

ARG NODE_VERSION="22"
RUN \
    apt update && \
    apt upgrade -y && \
    install_packages \
    curl \
    gpg \
    software-properties-common \
    gettext-base \
    patch \
    wget \
    && \
    curl -fsSL https://dl.yarnpkg.com/debian/pubkey.gpg | gpg --dearmor -o /usr/share/keyrings/yarnkey.gpg && \
    sh -c 'echo deb [signed-by=/usr/share/keyrings/yarnkey.gpg] https://dl.yarnpkg.com/debian stable main > /etc/apt/sources.list.d/yarn.list' && \
    curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg && \
    sh -c 'echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_VERSION.x nodistro main" > /etc/apt/sources.list.d/nodesource.list' && \
    # Prioritize nodesource higher
    echo 'Package: *' > /etc/apt/preferences.d/nodesource && \
    echo 'Pin: origin deb.nodesource.com' >> /etc/apt/preferences.d/nodesource && \
    echo 'Pin-Priority: 900' >> /etc/apt/preferences.d/nodesource && \
    apt update && \
    install_packages \
    nodejs \
    yarn \
    && \
    # Shrink binaries
    (find /usr/local/bin -type f -print0 | xargs -n1 -0 strip --strip-all -p 2>/dev/null || true) && \
    (find /usr/local/lib -type f -print0 | xargs -n1 -0 strip --strip-all -p 2>/dev/null || true) && \
    # Cleanup
    rm -rf /tmp/* /src

# Set workdir
WORKDIR /app

# Copy the code
COPY . /app

# Install dependencies and build application
RUN \
    yarn global add vite && \
    yarn install && \
    yarn run build

# Expose the port
EXPOSE 3000
CMD [ "npm", "run", "production" ]
