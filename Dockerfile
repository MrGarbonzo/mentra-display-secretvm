# Production Dockerfile for MentraOS Display App
# Deploys transcription/display app to SecretVM TEE
#
# Build command: docker build -t mentraos-display-tee .

FROM node:20-slim AS base

# Install build dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# ============================================
# Stage 1: Build Application
# ============================================
FROM base AS app-builder

WORKDIR /app

# Copy package files
COPY --chown=node:node package*.json ./

# Copy pre-built SDK simulator (already compiled)
COPY --chown=node:node sdk-simulator ./sdk-simulator

# Install dependencies
RUN npm install --omit=optional

# Copy application source
COPY --chown=node:node src ./src
COPY --chown=node:node tsconfig.json* ./

# ============================================
# Stage 2: Production Runtime
# ============================================
FROM node:20-slim AS runtime

WORKDIR /app

# Copy node_modules and SDK from builder
COPY --from=app-builder /app/node_modules ./node_modules
COPY --from=app-builder /app/sdk-simulator ./sdk-simulator

# Copy application source
COPY src ./src
COPY package*.json ./

# Environment variables (override at runtime)
ENV NODE_ENV=production
ENV PORT=3000
ENV PACKAGE_NAME=com.mentra.display.tee
ENV MENTRAOS_API_KEY=simulator-mode
ENV SIMULATOR_URL=ws://localhost:3001
ENV PAIRING_CODE=000000

# Expose port
EXPOSE 3000

# Default command: run display app using npx tsx
CMD ["npx", "tsx", "src/index.ts"]
