# Nestly — Docker + Minikube + Jenkins demo

A small stay-listings web app (Node.js + Express) used to practice a full CI/CD flow: **VS Code → Docker → Docker Hub → Jenkins → Minikube**.

## 1. Run it locally first (sanity check)

```bash
cd nestly
npm install
npm start
# open http://localhost:3000

```

*(Note: If port 3000 is in use, find the PID with `lsof -i :3000` and kill it, or map to a different port).*

## 2. Build and test the Docker image

```bash
docker build -t nestly:local .
docker run -d -p 3000:3000 nestly:local
# open http://localhost:3000

```

## 3. Push to Docker Hub

```bash
docker login
docker tag nestly:local skbablualam03031997/nestly:latest
docker push skbablualam03031997/nestly:latest

```

## 4. Start Minikube and deploy manually

```bash
minikube start
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl get pods
minikube service nestly-service --url

```

## 5. Wire up Jenkins (Docker-in-Docker Setup)

Run Jenkins as a Docker container with the Docker socket mounted:

```bash
docker run -d --name jenkins -p 8080:8080 -p 50000:50000 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v jenkins_home:/var/jenkins_home \
  jenkins/jenkins:lts

```

### 5a. Configure Docker & Kubectl Inside Jenkins

Access the Jenkins container as root:

```bash
docker exec -u 0 -it jenkins /bin/bash

```

Install the required CLIs and fix socket permissions:

```bash
# Install Docker
apt-get update && apt-get install -y docker.io
chmod 666 /var/run/docker.sock

# Install Kubectl
curl -LO "[https://dl.k8s.io/release/$](https://dl.k8s.io/release/$)(curl -L -s [https://dl.k8s.io/release/stable.txt](https://dl.k8s.io/release/stable.txt))/bin/linux/amd64/kubectl"
chmod +x kubectl
mv kubectl /usr/local/bin/
exit

```

### 5b. Authenticate Jenkins to Minikube (Mac Host)

Since Jenkins is in a container, it needs a flattened kubeconfig that points to the Mac's internal Docker network.

Run this on your Mac terminal to generate the file:

```bash
kubectl config view --flatten > kubeconfig-jenkins.yaml

```

Open `kubeconfig-jenkins.yaml` and modify the `minikube` cluster block to look like this:

```yaml
clusters:
- cluster:
    insecure-skip-tls-verify: true
    server: [https://host.docker.internal:54533](https://host.docker.internal:54533)
  name: minikube

```

Copy it into the Jenkins container and fix permissions:

```bash
docker exec -u 0 -it jenkins mkdir -p /var/jenkins_home/.kube
docker cp kubeconfig-jenkins.yaml jenkins:/var/jenkins_home/.kube/config
docker exec -u 0 -it jenkins chown -R 1000:1000 /var/jenkins_home/.kube

```

### 5c. Run the Pipeline

Store your Docker Hub credentials in Jenkins (**Manage Jenkins → Credentials → Add → Username with password**, ID: `dockerhub-creds`).

Create a Pipeline job pointing to this repository. The `Jenkinsfile` will:

1. Checkout the code.
2. Build the Docker image.
3. Push it to Docker Hub.
4. Apply the Kubernetes manifests to Minikube.

## Project structure

```text
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

```

```
## Project Screenshots:

### CICD Pipeline
![alt text](<Screenshot 1948-04-15 at 3.37.33 PM.png>)

### Website 
![alt text](<Screenshot 1948-04-15 at 3.39.32 PM.png>)

### Random
![alt text](<Screenshot 1948-04-15 at 3.38.12 PM.png>)

![alt text](<Screenshot 1948-04-15 at 3.40.22 PM.png>)