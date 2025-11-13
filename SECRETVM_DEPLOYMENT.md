# SecretVM TEE Deployment Guide

This guide explains how to deploy the MentraOS Display app (transcription/display functionality) to Secret Network's SecretVM TEE infrastructure.

## 🎯 What This Deployment Achieves

This deployment demonstrates:
- **First smart glasses transcription/display app in TEE**: Verifiable execution of voice-interface wearables
- **Cryptographic attestation**: Proof that code runs in genuine Intel/AMD TEE hardware
- **Privacy-preserving architecture**: Display logic and formatting secured in trusted execution environment
- **Reproducible builds**: Verifiable Docker images with sha256 digests

## 📋 Prerequisites

### 1. SecretVM Access
- **Internal Secret Network employees**: Contact DevOps/Infrastructure team
- **External developers**: Apply for access via Secret Network Discord or developer portal
- **Required info**: Use case description, estimated compute needs

### 2. Development Environment
- [x] Docker Desktop installed and running
- [x] GitHub account with repository access
- [x] Git configured for version tagging

### 3. Accounts & Access
- GitHub Personal Access Token (for GHCR)
- SecretVM credentials and access keys
- MentraOS production API key (if using real hardware)

## 🚀 Deployment Workflow

### Phase 1: Build & Publish Docker Image

#### Option A: Automated (Recommended)

**1. Push a version tag to trigger GitHub Actions:**

```bash
cd F:\coding\Mentra\MentraOS-Display-Example-App

# Create and push a version tag
git tag -a v1.0.0 -m "Release v1.0.0 for SecretVM deployment"
git push origin v1.0.0
```

**2. Monitor the GitHub Actions workflow:**
- Go to your repository's Actions tab
- Watch the "Build and Push Docker Image" workflow
- Wait for completion (typically 5-10 minutes)

**3. Get the image digest:**
- Check the GitHub Release created automatically
- Copy the full image reference with sha256 digest:
  ```
  ghcr.io/yourusername/mentraos-display-tee@sha256:abc123...
  ```

#### Option B: Manual Build & Push

**1. Build the image:**
```bash
cd F:\coding\Mentra\
./build-docker.sh v1.0.0
```

**2. Tag for GitHub Container Registry:**
```bash
docker tag mentraos-display-tee:v1.0.0 ghcr.io/yourusername/mentraos-display-tee:v1.0.0
```

**3. Login to GHCR:**
```bash
echo $GITHUB_TOKEN | docker login ghcr.io -u yourusername --password-stdin
```

**4. Push the image:**
```bash
docker push ghcr.io/yourusername/mentraos-display-tee:v1.0.0
```

**5. Get the digest:**
```bash
docker inspect ghcr.io/yourusername/mentraos-display-tee:v1.0.0 --format='{{index .RepoDigests 0}}'
```

### Phase 2: Configure Deployment

**1. Update docker-compose.yaml with the exact image digest:**

```yaml
services:
  mentraos-display-tee:
    # ✅ GOOD: Pinned with sha256 digest (verifiable)
    image: ghcr.io/yourusername/mentraos-display-tee:v1.0.0@sha256:abc123...

    # ❌ BAD: Floating tag (not verifiable)
    # image: ghcr.io/yourusername/mentraos-display-tee:latest
```

**2. Set environment variables:**

For production deployment to SecretVM, you'll need to configure:

```yaml
environment:
  - PACKAGE_NAME=com.mentra.display.tee
  - MENTRAOS_API_KEY=${MENTRAOS_API_KEY}  # Use secrets management
  - PORT=3000
  - NODE_ENV=production
```

**3. Adjust resource limits based on SecretVM tier:**

```yaml
deploy:
  resources:
    limits:
      cpus: '1.0'      # Adjust based on your VM size
      memory: 1G
```

### Phase 3: Deploy to SecretVM

**1. Access SecretVM dashboard/CLI:**
```bash
# Example - actual commands will depend on SecretVM interface
secret-vm login --credentials <your-credentials>
```

**2. Upload docker-compose.yaml:**
```bash
# Example deployment command (adjust based on actual SecretVM CLI)
secret-vm deploy --file docker-compose.yaml --name mentraos-display-tee
```

**3. Verify deployment:**
```bash
# Check deployment status
secret-vm status mentraos-display-tee

# View logs
secret-vm logs mentraos-display-tee
```

### Phase 4: Extract TEE Attestation

**1. Generate attestation proof:**
```bash
# This command extracts the TEE attestation that proves your app runs in genuine TEE hardware
secret-vm attestation generate --deployment mentraos-display-tee --output attestation.json
```

**2. Verify attestation locally:**
```bash
# Verify the attestation proof
secret-vm attestation verify --file attestation.json
```

**3. Save attestation artifacts:**
- `attestation.json` - The attestation proof
- `measurement.txt` - TEE measurements
- `certificate.pem` - TEE certificate chain

These files prove:
- Your app runs in genuine Intel SGX/TDX or AMD SEV hardware
- The exact code version deployed (via image digest)
- No tampering with the execution environment

### Phase 5: Documentation & Launch

**1. Create public documentation:**
- README with deployment info
- Architecture diagram showing TEE boundaries
- Honest privacy analysis (what's in TEE, what's not)
- Verification instructions for end users

**2. Publish attestation proof:**
```bash
# Add attestation to your repository
mkdir -p attestation/
cp attestation.json attestation/v1.0.0-attestation.json
git add attestation/
git commit -m "Add TEE attestation proof for v1.0.0"
git push
```

**3. Update docker-compose.yaml in repository:**
Commit the production-ready docker-compose.yaml with the verified image digest.

## 🔒 Security Considerations

### What Runs in TEE (✅ Protected)
- Display layout selection logic
- Text formatting and display decisions
- Business rules (e.g., battery warnings)
- Session state management

### What's NOT in TEE (❌ Not Protected - Phase 1)
- Audio transcription (happens in MentraOS Cloud via Deepgram)
- WebSocket connection to MentraOS
- Voice input capture

**Note for Phase 1:** This deployment demonstrates the *pattern* of running glasses apps in TEE. True end-to-end privacy requires moving transcription into the TEE (Phase 2 roadmap).

### Best Practices

1. **Never commit secrets** to docker-compose.yaml
   - Use environment variables
   - Use SecretVM's secrets management

2. **Pin exact image digests** for verifiability
   - Users can verify the exact code running
   - Prevents tag mutation attacks

3. **Open source everything** for maximum trust
   - Users can audit the code
   - Reproducible builds possible

4. **Document trust assumptions**
   - GitHub Actions builds (trust in GitHub)
   - Base image trust (node:20-slim)
   - Dependency trust (npm packages)

## 📊 Monitoring & Maintenance

### Health Checks

The docker-compose.yaml includes a health check:
```yaml
healthcheck:
  test: ["CMD", "node", "-e", "..."]
  interval: 30s
  timeout: 10s
  retries: 3
```

### Viewing Logs

```bash
# Real-time logs
secret-vm logs -f mentraos-display-tee

# Last 100 lines
secret-vm logs --tail 100 mentraos-display-tee
```

### Updating the Deployment

1. Build new version with new tag: `v1.0.1`
2. Get new image digest
3. Update docker-compose.yaml
4. Redeploy: `secret-vm deploy --file docker-compose.yaml`
5. Generate new attestation for the new version

## 🐛 Troubleshooting

### Image Pull Failures
```bash
# Ensure image is public or credentials are configured
docker pull ghcr.io/yourusername/mentraos-display-tee@sha256:abc123...

# Make GitHub package public:
# Go to GitHub Package settings → "Change visibility" → Public
```

### Container Won't Start
```bash
# Check logs for errors
secret-vm logs mentraos-display-tee

# Common issues:
# - Missing environment variables
# - Port conflicts
# - Resource limits too low
```

### Attestation Generation Fails
```bash
# Ensure deployment is running
secret-vm status mentraos-display-tee

# Check TEE support
secret-vm tee-info
```

### Health Check Failing
```bash
# Exec into container to debug
secret-vm exec mentraos-display-tee -- /bin/bash

# Test health check manually
node -e "require('http').get('http://localhost:3000', (r) => console.log(r.statusCode))"
```

## 📖 Additional Resources

- **SecretVM Documentation**: https://docs.scrt.network/secret-network-documentation/secretvm-confidential-virtual-machines/
- **MentraOS Documentation**: https://docs.mentra.glass/
- **GitHub Actions**: https://docs.github.com/en/actions
- **Docker Compose**: https://docs.docker.com/compose/

## 🎓 Understanding the Trust Chain

SecretVM establishes a "chain of trust":

1. **Hardware Root of Trust**: Intel/AMD TEE processors with secure boot
2. **TEE Attestation**: Cryptographic proof from hardware
3. **Docker Image**: Verified via sha256 digest
4. **Application Code**: Open source, auditable on GitHub
5. **Build Process**: Transparent via GitHub Actions logs

Users can verify each link in this chain independently.

## 📝 Post-Deployment Checklist

- [ ] Docker image built and pushed with sha256 digest
- [ ] docker-compose.yaml updated with exact digest
- [ ] Deployed to SecretVM successfully
- [ ] TEE attestation extracted and verified
- [ ] Attestation proof published to repository
- [ ] Documentation updated with deployment details
- [ ] Blog post drafted
- [ ] Launch announcement prepared
- [ ] Community feedback channels set up

## 🚦 Next Steps After Deployment

1. **Verify end-to-end functionality** with real glasses/simulator
2. **Document the architecture** with diagrams
3. **Create demo video** showing app + TEE attestation
4. **Write launch blog post** for Secret Network community
5. **Cross-post to MentraOS community**
6. **Engage with both communities** for feedback
7. **Plan Phase 2**: Full transcription in TEE

## ❓ Getting Help

- **SecretVM Issues**: Secret Network Discord #dev-chat
- **MentraOS Issues**: MentraOS Discord/GitHub
- **This Project**: [GitHub Issues link]

## 🎉 Success Criteria

Your deployment is successful when:
- ✅ App runs in SecretVM without errors
- ✅ TEE attestation proof generated and verified
- ✅ Documentation published with attestation
- ✅ Community members can verify the deployment
- ✅ Demo video shows working functionality

---

**Ready to deploy?** Follow Phase 1 above and let's get your transcription/display app running in a TEE! 🚀
