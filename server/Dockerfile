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

# Install deps and build
RUN npm install --legacy-peer-deps && npm run build
