# Multi-stage Dockerfile for MentraOS Display Example App
# This containerizes the transcription/display app for deployment to SecretVM TEE
#
# NOTE: This Dockerfile expects to be built from the parent directory (F:\coding\Mentra\)
# Build command: docker build -f MentraOS-Display-Example-App/Dockerfile -t mentraos-display-tee .

FROM node:20-slim AS base

# Install dependencies needed for building
RUN apt-get update && apt-get install -y \
    python3 \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# ============================================
# Stage 1: Build SDK Simulator
# ============================================
FROM base AS sdk-builder

WORKDIR /sdk-simulator

# Copy SDK simulator source (from build context root)
COPY --chown=node:node glasses_emulator/packages/sdk-simulator ./

# Install SDK dependencies and build
RUN npm ci && npm run build

# ============================================
# Stage 2: Build Application
# ============================================
FROM base AS app-builder

WORKDIR /app

# Copy package files
COPY --chown=node:node MentraOS-Display-Example-App/package*.json ./

# Copy built SDK from previous stage
COPY --from=sdk-builder --chown=node:node /sdk-simulator /app/sdk-simulator

# Create node_modules/@mentra/sdk symlink to simulator
RUN mkdir -p node_modules/@mentra && \
    ln -s /app/sdk-simulator node_modules/@mentra/sdk

# Install app dependencies (excluding the local file: dependency)
RUN npm install --omit=optional

# Copy application source
COPY --chown=node:node MentraOS-Display-Example-App/src ./src
COPY --chown=node:node MentraOS-Display-Example-App/tsconfig.json* ./

# ============================================
# Stage 3: Production Runtime
# ============================================
FROM node:20-slim AS runtime

# Install tsx for TypeScript execution
RUN npm install -g tsx

WORKDIR /app

# Copy node_modules and built SDK
COPY --from=app-builder --chown=node:node /app/node_modules ./node_modules
COPY --from=app-builder --chown=node:node /app/sdk-simulator ./sdk-simulator

# Copy application source
COPY --chown=node:node MentraOS-Display-Example-App/src ./src
COPY --chown=node:node MentraOS-Display-Example-App/package*.json ./

# Create @mentra/sdk symlink
RUN mkdir -p node_modules/@mentra && \
    ln -s /app/sdk-simulator node_modules/@mentra/sdk

# Environment variables (can be overridden at runtime)
ENV NODE_ENV=production
ENV PORT=3000
ENV PACKAGE_NAME=com.mentra.display.tee
ENV MENTRAOS_API_KEY=simulator-mode

# Expose port (optional, depends on deployment)
EXPOSE 3000

# Switch to non-root user
USER node

# Default command: run display app
# Pass pairing code as first argument if needed
CMD ["tsx", "src/index.ts"]
