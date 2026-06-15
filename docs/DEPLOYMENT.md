# Deployment Checklist — Cloud + Docker

This checklist covers deploying the Task Management application to production using Docker and common cloud providers (AWS, GCP, Azure). It includes image/build steps, registry, infrastructure, security, monitoring, and rollback guidance.

---

## 1. Pre-deploy (prepare repository)
- Add a `Dockerfile` for `backend` and `frontend` (already present). Verify they build cleanly.
- Add `.dockerignore` files to each service to reduce image size.
- Ensure `backend` and `frontend` contain production build scripts in `package.json`.
- Add `VITE_API_URL`/`REACT_APP_API_URL` defaults and a `.env.example` in both folders.
- Ensure `docker-compose.yml` is up-to-date for local/in-cloud compose deployments.

Commands to test locally:

```bash
# build backend image (local)
cd backend
docker build -t task-management-backend:local .

# build frontend production bundle and image
cd ../frontend
npm run build
docker build -t task-management-frontend:local .

# run via compose
cd ..
docker compose up --build
```

---

## 2. Production architecture options
- Single VM / Docker Compose: good for small projects; uses `docker-compose.yml` and a reverse proxy (nginx).
- Container Service (recommended): AWS ECS / Azure Container Instances / Google Cloud Run for simpler operations.
- Container Orchestration: AWS EKS / Azure AKS / GKE for Kubernetes — use for autoscaling and high availability.
- Managed DB: Use MongoDB Atlas or managed cloud MongoDB service (avoid self-hosting MongoDB in production unless you manage backups and HA).

---

## 3. Build & push images
1. Build production images locally or in CI. Tag with semantic version or commit SHA.

```bash
# example
docker build -t myorg/task-backend:1.0.0 -f backend/Dockerfile backend
docker build -t myorg/task-frontend:1.0.0 -f frontend/Dockerfile frontend

# push to registry
docker push myorg/task-backend:1.0.0
docker push myorg/task-frontend:1.0.0
```

2. Use a private registry (Docker Hub, GitHub Packages, GCR, ECR, ACR). Authenticate CI runner accordingly.

---

## 4. Environment & secrets
- Do NOT store secrets in code or `.env` files committed to VCS. Use secret stores: AWS Secrets Manager, Azure Key Vault, Google Secret Manager, or Kubernetes Secrets.
- Required secrets/env vars (example):
  - `MONGODB_URI` (or connection config for Atlas)
  - `JWT_SECRET`
  - `JWT_EXPIRATION`
  - `FRONTEND_URL` / `CORS_ORIGIN`
  - Any OAuth or email provider credentials

Example production `.env` (DO NOT commit):

```
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/task-management?retryWrites=true&w=majority
JWT_SECRET=<strong-random-secret>
JWT_EXPIRATION=7d
FRONTEND_URL=https://app.example.com
SOCKET_IO_ENABLED=true
```

---

## 5. Networking, reverse proxy, and TLS
- Use a reverse proxy (nginx, Traefik, or cloud load balancer) to terminate TLS and forward traffic to services.
- Configure HTTP -> HTTPS redirects and HSTS.
- Set up health check endpoints (`/api/health`) for load balancers.
- For Socket.IO, ensure sticky sessions or use a message broker (Redis) with Socket.IO adapter when scaling multiple backend instances.

nginx sample for reverse proxy (simplified):

```nginx
server {
  listen 80;
  server_name api.example.com;
  return 301 https://$host$request_uri;
}

server {
  listen 443 ssl;
  server_name api.example.com;
  ssl_certificate /etc/ssl/certs/fullchain.pem;
  ssl_certificate_key /etc/ssl/private/privkey.pem;

  location / {
    proxy_pass http://backend:5000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
```

---

## 6. Scaling Socket.IO
- For horizontally scaled backend instances, configure a Socket.IO adapter using Redis to propagate events between instances:

```js
// server side
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

const pubClient = createClient({ url: process.env.REDIS_URL });
const subClient = pubClient.duplicate();
await Promise.all([pubClient.connect(), subClient.connect()]);
io.adapter(createAdapter(pubClient, subClient));
```

---

## 7. CI/CD pipeline (recommended)
- Build images in CI (GitHub Actions / GitLab CI / CircleCI).
- Run tests, lint, and build steps.
- Push images to registry and trigger deploy (via `kubectl`, `ecs deploy`, or updating a cloud run service).

Example GitHub Actions high-level steps:

```yaml
name: CI
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build backend
        run: |
          cd backend
          npm ci
          npm run build
      - name: Build frontend
        run: |
          cd frontend
          npm ci
          npm run build
      - name: Build and push Docker images
        uses: docker/build-push-action@v4
        with:
          push: true
          tags: ghcr.io/${{ github.repository }}/task-backend:${{ github.sha }}
```

---

## 8. Database migrations & backups
- If you add schema migrations, use a migration tool or scripts and run migrations during deploy.
- Schedule regular backups for MongoDB (use Atlas backup or `mongodump` + object storage).

Backup sample (not for large datasets):

```bash
mongodump --uri="$MONGODB_URI" --archive=backup-$(date +%F).gz --gzip
```

---

## 9. Observability
- Logs: centralize logs (CloudWatch, Stackdriver, Azure Monitor, or ELK). Ensure logs include request IDs and user IDs for tracing.
- Metrics: export Prometheus metrics or use a cloud monitoring solution.
- Tracing: instrument critical paths with OpenTelemetry or cloud tracing.

---

## 10. Post-deploy verification
- Smoke tests: ping `/api/health`, login flow, create/read/update/delete task, real-time events test.
- Check logs and metrics for errors.
- Verify TLS, CORS, and rate-limiting behavior.

Smoke test examples:

```bash
curl -I https://api.example.com/api/health
# Use a script to exercise auth and tasks endpoints
```

---

## 11. Rollback & emergency procedures
- Tag previous working image and keep at least one prior version in registry.
- In Kubernetes/ECS, perform a rollout to the previous revision.
- In Compose, re-deploy the previous image tag.

---

## 12. Security checklist
- Use HTTPS everywhere.
- Keep dependencies up-to-date; scan for vulnerabilities.
- Limit CORS to production origins.
- Harden headers (`helmet` already used in backend).
- Rotate secrets periodically and keep `JWT_SECRET` secure.

---

## 13. Cost & sizing notes
- Start with small instance types and autoscale based on metrics.
- Use managed DB (Atlas) rather than self-managed for reliability unless cost dictates.

---

## 14. Additional references
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- Socket.IO Redis Adapter: https://socket.io/docs/v4/using-middleware/#scaling
- Docker best practices: https://docs.docker.com/develop/develop-images/dockerfile_best-practices/

---

If you want, I can now:
- generate `k8s/` manifests for a Kubernetes deployment (Deployment, Service, Ingress, ConfigMap, Secret), or
- produce a GitHub Actions workflow that builds, tests, pushes images, and deploys to a chosen cloud provider.
