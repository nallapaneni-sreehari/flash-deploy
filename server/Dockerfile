# Install Node and git
FROM node:20 AS builder

RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Clone repo
ARG git_url
ARG project_name
RUN git clone $git_url $project_name
WORKDIR /app/$project_name

# Use legacy OpenSSL provider for Node
ENV NODE_OPTIONS=--openssl-legacy-provider

# Install deps
RUN if [ -f yarn.lock ] && [ ! -f package-lock.json ]; then \
      corepack enable && yarn install --frozen-lockfile; \
    else \
      npm install --legacy-peer-deps; \
    fi

# Build project
RUN if [ -f yarn.lock ]; then \
      yarn build; \
    else \
      npm run build; \
    fi

# Normalize output into /app/output
RUN mkdir -p /app/output && \
    if [ -d build ]; then cp -r build/* /app/output/; fi && \
    if [ -d dist ]; then cp -r dist/* /app/output/; fi && \
    # handle Angular's nested dist/<app-name>
    if [ -d dist ] && [ "$(ls -A dist)" ]; then \
      find dist -mindepth 1 -maxdepth 1 -type d -exec cp -r {}/. /app/output/ \; ; \
    fi
