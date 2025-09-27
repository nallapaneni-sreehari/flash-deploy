# Stage 1: Build the project
FROM node:20 AS builder

ARG git_url
ARG project_name
ENV GIT_URL=$git_url
ENV PROJECT_NAME=$project_name

RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

WORKDIR /app
RUN git clone $GIT_URL $PROJECT_NAME
WORKDIR /app/$PROJECT_NAME
RUN npm install && npm run build
