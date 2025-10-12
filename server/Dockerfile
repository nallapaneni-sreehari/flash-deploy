# Install Node and git
FROM node:18-bullseye AS builder

RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Clone repo
ARG git_url
ARG project_name
RUN git clone $git_url $project_name
WORKDIR /app/$project_name

# Use legacy OpenSSL provider for Node
ENV NODE_OPTIONS=--openssl-legacy-provider

# Install deps (support pnpm, yarn, npm)
RUN if [ -f pnpm-lock.yaml ]; then \
      corepack enable && corepack prepare pnpm@latest --activate && pnpm install --frozen-lockfile || pnpm install; \
    elif [ -f yarn.lock ] && [ ! -f package-lock.json ]; then \
      corepack enable && yarn install --frozen-lockfile; \
    else \
      npm install --legacy-peer-deps; \
    fi

# Build project (detect framework and run correct build/export/generate, but never fail the Docker build)
RUN set -eux; \
    if [ -f pnpm-lock.yaml ]; then PM=pnpm; \
    elif [ -f yarn.lock ] && [ ! -f package-lock.json ]; then PM=yarn; \
    else PM=npm; fi; \
    FRAMEWORK=$(node -e "const p=require('./package.json'); const d=Object.assign({},p.dependencies||{},p.devDependencies||{}); if(d['next']){console.log('next');} else if(d['@angular/core']){console.log('angular');} else if(d['@sveltejs/kit']){console.log('sveltekit');} else if(d['nuxt']||d['@nuxtjs/kit']){console.log('nuxt');} else if(d['@vue/cli-service']){console.log('vue-cli');} else if(d['vue']&&d['vite']){console.log('vue-vite');} else if(d['vite']){console.log('vite');} else if(d['react-scripts']){console.log('cra');} else{console.log('unknown');}"); \
    echo "Detected framework: $FRAMEWORK"; \
    # Try build, but never fail the Docker build
    ( \
      if [ "$PM" = "pnpm" ]; then $PM build; \
      elif [ "$PM" = "yarn" ]; then $PM build; \
      else $PM run build; fi; \
      if [ "$FRAMEWORK" = "next" ]; then \
        if node -e "const s=require('./package.json');console.log(!!(s.scripts&&s.scripts.export));" | grep -q true; then $PM export || true; fi; \
      fi; \
      if [ "$FRAMEWORK" = "nuxt" ]; then \
        if node -e "const s=require('./package.json');console.log(!!(s.scripts&&s.scripts.generate));" | grep -q true; then $PM generate || true; \
        elif command -v npx >/dev/null 2>&1; then npx nuxi generate || true; fi; \
      fi \
    ) || echo "Build failed, continuing anyway to collect static files..."

# Normalize output into /app/output (support build, dist, out, public, .output, .next/static, .vercel/output/static, and Angular/Vue nested dist)
RUN mkdir -p /app/output && \
    for d in build dist out public .output .next/_static .next/static .vercel/output/static; do \
      if [ -d "$d" ]; then cp -r "$d"/. /app/output/; fi; \
    done && \
    # handle nested dist like dist/<app-name> (Angular, some Vue setups)
    if [ -d dist ] && [ "$(ls -A dist)" ]; then \
      for sub in dist/*; do \
        if [ -d "$sub" ]; then cp -r "$sub"/. /app/output/; fi; \
      done; \
    fi
