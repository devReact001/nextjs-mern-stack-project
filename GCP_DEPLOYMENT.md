# GCP Deployment Guide — MERN Stack on Cloud Run

## Prerequisites
- GCP account with $300 free credit
- `gcloud` CLI installed → https://cloud.google.com/sdk/docs/install
- Docker installed locally

---

## Step 1 — Create GCP Project

```bash
# Login
gcloud auth login

# Create project
gcloud projects create mern-stack-app --name="MERN Stack App"

# Set as default
gcloud config set project mern-stack-app

# Enable billing (required for Cloud Run)
# Go to: console.cloud.google.com/billing
```

---

## Step 2 — Enable Required APIs

```bash
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  secretmanager.googleapis.com \
  sourcerepo.googleapis.com
```

---

## Step 3 — Create Artifact Registry Repository

```bash
gcloud artifacts repositories create mern-stack \
  --repository-format=docker \
  --location=asia-south1 \
  --description="MERN Stack Docker images"
```

---

## Step 4 — Store Secrets in Secret Manager

```bash
# MongoDB URI
echo -n "mongodb+srv://user:pass@cluster.mongodb.net/merndb" | \
  gcloud secrets create MONGO_URI --data-file=-

# JWT Secret
echo -n "your-super-secret-jwt-key-here" | \
  gcloud secrets create JWT_SECRET --data-file=-
```

---

## Step 5 — Grant Cloud Build permissions

```bash
# Get your project number
PROJECT_NUMBER=$(gcloud projects describe mern-stack-app --format="value(projectNumber)")

# Grant Secret Manager access to Cloud Build
gcloud projects add-iam-policy-binding mern-stack-app \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# Grant Cloud Run deploy permission to Cloud Build
gcloud projects add-iam-policy-binding mern-stack-app \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/run.admin"

# Grant service account user permission
gcloud projects add-iam-policy-binding mern-stack-app \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"
```

---

## Step 6 — Push Code to Cloud Source Repositories

```bash
# Create repo
gcloud source repos create mern-stack-app

# Add as remote
git remote add google \
  https://source.developers.google.com/p/mern-stack-app/r/mern-stack-app

# Push code
git push google main
```

---

## Step 7 — Deploy Backend First (to get its URL)

```bash
# Build and push backend image manually first
gcloud builds submit ./server \
  --tag asia-south1-docker.pkg.dev/mern-stack-app/mern-stack/mern-backend:latest

# Deploy backend to Cloud Run
gcloud run deploy mern-backend \
  --image=asia-south1-docker.pkg.dev/mern-stack-app/mern-stack/mern-backend:latest \
  --region=asia-south1 \
  --platform=managed \
  --allow-unauthenticated \
  --port=8080 \
  --memory=512Mi \
  --set-secrets=MONGO_URI=MONGO_URI:latest,JWT_SECRET=JWT_SECRET:latest

# ← Copy the backend URL from output e.g.:
# https://mern-backend-abc123-el.a.run.app
```

---

## Step 8 — Update CORS with Backend URL

Update `server/src/index.ts` — add your Cloud Run backend URL to the CORS origins list:
```typescript
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://nextjs-mern-stack-project.vercel.app",
    "https://mern-frontend-XXXXXX-el.a.run.app"  // ← add frontend URL
  ],
  credentials: true
}));
```

---

## Step 9 — Update cloudbuild.yaml

Edit `cloudbuild.yaml` and replace `_BACKEND_URL` default value with your actual backend URL:
```yaml
substitutions:
  _REGION: asia-south1
  _REPO: mern-stack
  _BACKEND_URL: https://mern-backend-XXXXXX-el.a.run.app  # ← your URL here
```

---

## Step 10 — Set Up Cloud Build Trigger (CI/CD)

```bash
# Create trigger connected to Cloud Source Repositories
gcloud builds triggers create cloud-source-repositories \
  --name=mern-stack-deploy \
  --repo=mern-stack-app \
  --branch-pattern=^main$ \
  --build-config=cloudbuild.yaml
```

Or via console: **Cloud Build → Triggers → Create Trigger**

---

## Step 11 — Push to trigger deployment

```bash
git add .
git commit -m "add GCP deployment config"
git push google main
# ← This triggers Cloud Build automatically!
```

---

## Architecture After Deployment

```
Developer pushes to Cloud Source Repositories
              ↓
         Cloud Build triggers
              ↓
    ┌─────────────────────────┐
    │  Build Docker images    │
    │  Push to Artifact       │
    │  Registry               │
    └────────────┬────────────┘
                 ↓
    ┌────────────────────────────────────┐
    │           Cloud Run                │
    │  mern-frontend  |  mern-backend    │
    │  (Next.js)      |  (Node.js)       │
    └────────────────────────────────────┘
                 ↓
         MongoDB Atlas
         (existing cloud DB)
```

---

## Environment Variables Summary

| Secret | Where stored | Used by |
|--------|-------------|---------|
| `MONGO_URI` | Secret Manager | Backend Cloud Run |
| `JWT_SECRET` | Secret Manager | Backend Cloud Run |
| `NEXT_PUBLIC_API_URL` | Cloud Build substitution | Frontend build |

---

## Estimated GCP Cost (with $300 credit)

| Service | Monthly cost |
|---------|-------------|
| Cloud Run (2 services) | ~$5-10 |
| Cloud Build (120 min/day free) | ~$0 |
| Artifact Registry | ~$0.10 |
| Secret Manager | ~$0.06 |
| **Total** | **~$5-10/month** |

Your $300 credit covers **30+ months** at this usage level.
