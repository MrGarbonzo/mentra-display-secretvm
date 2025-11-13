# Building & Running the MentraOS Display TEE App

This document explains how to build and run the MentraOS Display app (transcription/display) in a Docker container for deployment to SecretVM TEE infrastructure.

## Prerequisites

1. **Docker Desktop** installed and running
   - Windows: https://www.docker.com/products/docker-desktop/
   - Ensure Docker is running before building

2. **Project Structure**
   ```
   F:\coding\Mentra\
   ├── MentraOS-Display-Example-App/     # This app (transcription/display)
   ├── glasses_emulator/                # Simulator SDK
   └── Dockerfile, build scripts        # Build configuration
   ```

## Building the Docker Image

### Option 1: Using the Build Script (Recommended)

From the `F:\coding\Mentra\` directory:

```bash
# Make script executable (Linux/Mac)
chmod +x build-docker.sh

# Build with 'latest' tag
./build-docker.sh

# Build with custom tag
./build-docker.sh v1.0.0
```

### Option 2: Manual Docker Build

```bash
cd F:\coding\Mentra\

docker build \
  -f MentraOS-Display-Example-App/Dockerfile \
  -t mentraos-display-tee:latest \
  --platform linux/amd64 \
  .
```

**Important Notes:**
- Build context must be `F:\coding\Mentra\` (parent directory)
- The `-f` flag specifies the Dockerfile location
- `--platform linux/amd64` ensures compatibility with SecretVM

## Running Locally for Testing

### Prerequisites for Local Testing
1. Start the glasses simulator:
   ```bash
   cd F:\coding\Mentra\glasses_emulator\packages\web-simulator
   npm run dev
   ```
2. Note the 6-digit pairing code from the simulator
3. Open browser to http://localhost:5173

### Option 1: Using the Run Script (Recommended)

```bash
# Run with default pairing code (000000)
./run-docker.sh

# Run with specific pairing code
./run-docker.sh 123456
```

### Option 2: Manual Docker Run

```bash
docker run \
  --name mentraos-display-test \
  --network host \
  -e PACKAGE_NAME="com.mentra.display.tee" \
  -e MENTRAOS_API_KEY="simulator-mode" \
  -e PORT=3000 \
  -it \
  --rm \
  mentraos-display-tee:latest \
  tsx src/index.ts 123456
```

**Note:** `--network host` allows the container to connect to the simulator running on `localhost:3001`

## Environment Variables

The following environment variables can be configured:

| Variable | Default | Description |
|----------|---------|-------------|
| `PACKAGE_NAME` | `com.mentra.display.tee` | Application package identifier |
| `MENTRAOS_API_KEY` | `simulator-mode` | API key for MentraOS (use real key in production) |
| `PORT` | `3000` | Port for the app server |
| Pairing Code | `000000` | Passed as command argument (simulator only) |

## Deployment to SecretVM

### 1. Tag the Image for Your Registry

```bash
# Example: Docker Hub
docker tag mentraos-display-tee:latest your-username/mentraos-display-tee:v1.0.0

# Example: Private registry
docker tag mentraos-display-tee:latest registry.example.com/mentraos-display-tee:v1.0.0
```

### 2. Push to Registry

```bash
docker push your-username/mentraos-display-tee:v1.0.0
```

### 3. Deploy to SecretVM

See [SECRETVM_DEPLOYMENT.md](./SECRETVM_DEPLOYMENT.md) for detailed SecretVM deployment instructions.

## Multi-Stage Build Architecture

The Dockerfile uses a 3-stage build process:

1. **sdk-builder**: Builds the MentraOS SDK simulator
2. **app-builder**: Installs app dependencies and prepares source
3. **runtime**: Creates minimal production image with only what's needed

This approach:
- Reduces final image size
- Improves security (no build tools in production)
- Speeds up deployment

## Troubleshooting

### Docker Command Not Found
- Ensure Docker Desktop is installed
- Make sure Docker Desktop is running
- Restart your terminal after installation

### Build Context Errors
- Verify you're building from `F:\coding\Mentra\` directory
- Check that both `MentraOS-Display-Example-App/` and `glasses_emulator/` exist

### Container Can't Connect to Simulator
- Ensure simulator is running: `cd glasses_emulator/packages/web-simulator && npm run dev`
- Use `--network host` flag when running container
- Verify pairing code matches simulator

### SDK Linking Issues
- The Dockerfile creates a symlink: `node_modules/@mentra/sdk` → `sdk-simulator`
- This allows code to `import from '@mentra/sdk'` seamlessly

## Next Steps

1. **Local Testing**: Verify app works in container with simulator
2. **SecretVM Access**: Confirm you have access to SecretVM infrastructure
3. **Production Config**: Update environment variables for production
4. **TEE Attestation**: Extract attestation proof after deployment
5. **Documentation**: Create launch materials and blog posts

## File Structure

```
F:\coding\Mentra\
├── .dockerignore                               # Optimizes build context
├── build-docker.sh                             # Build script
├── run-docker.sh                               # Local testing script
├── MentraOS-Display-Example-App/
│   ├── Dockerfile                              # Multi-stage build config
│   ├── BUILD.md                                # This file
│   ├── src/
│   │   └── index.ts                            # Main app entry point
│   └── package.json
└── glasses_emulator/packages/sdk-simulator/    # Bundled SDK
```

## Production Considerations

For SecretVM TEE deployment:

1. **Switch to Real SDK**: Replace simulator SDK with production MentraOS SDK
2. **Remove Simulator Config**: Update app to connect to real MentraOS infrastructure
3. **Environment Variables**: Use real API keys and configuration
4. **Network Config**: Remove `--network host`, configure proper networking
5. **Security**: Ensure sensitive data stays within TEE
6. **Monitoring**: Add logging and health checks

## Questions?

- MentraOS Documentation: https://docs.mentra.glass/
- SecretVM Documentation: https://docs.scrt.network/
- Issues: [GitHub issues link]
