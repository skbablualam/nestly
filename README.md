# Nestly — Docker + Minikube + Jenkins demo

A small stay-listings web app (Node.js + Express) used to practice a full
CI/CD flow: **VS Code → Docker → Docker Hub → Jenkins → Minikube**.

## 1. Run it locally first (sanity check)

```bash
cd nestly
npm install
npm start
# open http://localhost:3000
```

## 2. Build and test the Docker image

```bash
docker build -t nestly:local .
docker run -p 3000:3000 nestly:local
# open http://localhost:3000
```

## 3. Push to Docker Hub

```bash
docker login
docker tag nestly:local YOUR_DOCKERHUB_USERNAME/nestly:latest
docker push YOUR_DOCKERHUB_USERNAME/nestly:latest
```

Replace `YOUR_DOCKERHUB_USERNAME` in `k8s/deployment.yaml` and `Jenkinsfile`
with your real Docker Hub username.

## 4. Start Minikube and deploy manually (before wiring up Jenkins)

```bash
minikube start
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl get pods
minikube service nestly-service --url
```

That last command prints a URL — open it in your browser to see the site
running from your Minikube cluster.

## 5. Wire up Jenkins

You have two common options on macOS:

- **Jenkins as a Docker container**: run it with the Docker socket mounted
  so it can build images:
  ```bash
  docker run -d --name jenkins -p 8080:8080 -p 50000:50000 \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v jenkins_home:/var/jenkins_home \
    jenkins/jenkins:lts
  ```
- **Jenkins installed natively** (via Homebrew), which tends to play more
  nicely with `kubectl`/`minikube` context on the same machine.

Either way, Jenkins needs:
- Docker CLI available to the Jenkins agent
- `kubectl` configured to point at your Minikube context
  (`kubectl config use-context minikube`)
- A Docker Hub credential stored in Jenkins:
  **Manage Jenkins → Credentials → Add → Username with password**,
  ID: `dockerhub-creds`

Then create a **Pipeline** job in Jenkins pointing at this repo, using the
included `Jenkinsfile`. Each build will:
1. Checkout the code
2. Build the Docker image
3. Push it to Docker Hub
4. Apply the Kubernetes manifests to Minikube and roll out the new image

## Project structure

```
nestly/
├── server.js          # Express server + API
├── package.json
├── public/            # Frontend (HTML/CSS/JS)
├── Dockerfile
├── k8s/
│   ├── deployment.yaml
│   └── service.yaml
└── Jenkinsfile
```

## Notes

- This is a generic "vacation rental listings" demo app, not affiliated
  with or branded as Airbnb — just useful for practicing the same
  deploy pipeline.
- `k8s/service.yaml` uses `NodePort` (30080) so it's reachable straight
  from Minikube without an Ingress controller. That's fine for local
  learning; for anything closer to production you'd move to an Ingress.
