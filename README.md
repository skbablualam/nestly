<div align="center">

# 🏡 **N E S T L Y**
### *An Airbnb-Inspired Full Stack Application with Enterprise DevOps Automation*

<img src="https://img.shields.io/badge/Node.js-Express-success?style=for-the-badge&logo=node.js"/>
<img src="https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker"/>
<img src="https://img.shields.io/badge/Kubernetes-Minikube-326CE5?style=for-the-badge&logo=kubernetes"/>
<img src="https://img.shields.io/badge/Jenkins-CI/CD-D24939?style=for-the-badge&logo=jenkins"/>
<img src="https://img.shields.io/badge/SonarCloud-Code%20Quality-F3702A?style=for-the-badge&logo=sonarcloud"/>
<img src="https://img.shields.io/badge/Trivy-Security-1904DA?style=for-the-badge"/>
<img src="https://img.shields.io/badge/Prometheus-Monitoring-E6522C?style=for-the-badge&logo=prometheus"/>
<img src="https://img.shields.io/badge/Grafana-Dashboards-F46800?style=for-the-badge&logo=grafana"/>

### ⭐ Enterprise DevOps CI/CD Project

*A modern Airbnb-inspired web application demonstrating an end-to-end DevOps workflow from development to production deployment.*

</div>

---

# 📖 About Nestly

**Nestly** is a modern stay-listing web application inspired by **Airbnb** and built using **Node.js** and **Express.js**.

This project was created to demonstrate how a real-world application moves through a complete **Enterprise DevOps Lifecycle**, including automated testing, code quality analysis, security scanning, Docker containerization, Kubernetes deployment, and monitoring.

> **⚠️ Disclaimer**
>
> This project is inspired by Airbnb for learning purposes only. It is an independent implementation and is **not affiliated with or endorsed by Airbnb**.

---

# 🚀 Enterprise DevOps Pipeline

```text
                Developer
                    │
                    ▼
            Push Code to GitHub
                    │
                    ▼
             Jenkins Pipeline
                    │
     ┌──────────────┼──────────────┐
     ▼              ▼              ▼
 Unit Tests     SonarCloud     Trivy Scan
   (Jest)      Code Quality    Security
     │              │              │
     └──────────────┼──────────────┘
                    ▼
            Docker Image Build
                    │
                    ▼
            Push to Docker Hub
                    │
                    ▼
       Deploy to Kubernetes (Minikube)
                    │
                    ▼
      Prometheus + Grafana Monitoring
```

---

# ⚡ Tech Stack

| Category | Technologies |
|----------|--------------|
| Backend | Node.js, Express.js |
| Testing | Jest, Supertest |
| Code Quality | SonarCloud |
| Security | Trivy |
| Containerization | Docker |
| CI/CD | Jenkins |
| Orchestration | Kubernetes (Minikube) |
| Monitoring | Prometheus, Grafana |
| Registry | Docker Hub |
| Version Control | Git, GitHub |

---

# 📂 Project Structure

```text
nestly/
│
├── server.js                 # Express Server
├── server.test.js            # Jest Unit Tests
├── package.json              # Project Dependencies
├── public/                   # Frontend Assets
│
├── Dockerfile
├── Jenkinsfile
│
├── k8s/
│   ├── deployment.yaml
│   └── service.yaml
│
└── README.md
```

---

# 💻 Run Locally

Clone the repository

```bash
git clone https://github.com/<your-username>/nestly.git

cd nestly
```

Install dependencies

```bash
npm install
```

Start the application

```bash
npm start
```

Open your browser

```
http://localhost:3000
```

---

# 🐳 Docker

Build the Docker image

```bash
docker build -t nestly:local .
```

Run the container

```bash
docker run -d -p 3000:3000 nestly:local
```

Visit

```
http://localhost:3000
```

---

# 📦 Push Image to Docker Hub

```bash
docker login

docker tag nestly:local skbablualam03031997/nestly:latest

docker push skbablualam03031997/nestly:latest
```

---

# ☸️ Deploy to Kubernetes

Start Minikube

```bash
minikube start
```

Deploy resources

```bash
kubectl apply -f k8s/deployment.yaml

kubectl apply -f k8s/service.yaml
```

Verify

```bash
kubectl get pods

kubectl get svc
```

Access the application

```bash
minikube service nestly-service --url
```

---

# 🔄 Jenkins CI/CD Setup

Run Jenkins

```bash
docker run -d \
--name jenkins \
-p 8080:8080 \
-p 50000:50000 \
-v /var/run/docker.sock:/var/run/docker.sock \
-v jenkins_home:/var/jenkins_home \
jenkins/jenkins:lts
```

Enter Jenkins container

```bash
docker exec -u 0 -it jenkins bash
```

---

# ⚙️ Install Required Tools Inside Jenkins

### Docker

```bash
apt-get update
apt-get install -y docker.io
chmod 666 /var/run/docker.sock
```

### Kubectl

```bash
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"

chmod +x kubectl

mv kubectl /usr/local/bin/
```

### Trivy

```bash
apt-get install -y wget apt-transport-https gnupg lsb-release

wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key \
| gpg --dearmor \
| tee /usr/share/keyrings/trivy.gpg >/dev/null

echo "deb [signed-by=/usr/share/keyrings/trivy.gpg] https://aquasecurity.github.io/trivy-repo/deb $(lsb_release -sc) main" \
| tee /etc/apt/sources.list.d/trivy.list

apt-get update

apt-get install -y trivy
```

---

# ☸️ Configure Kubernetes Access

Generate flattened kubeconfig

```bash
kubectl config view --flatten > kubeconfig-jenkins.yaml
```

Update cluster configuration

```yaml
clusters:
- cluster:
    insecure-skip-tls-verify: true
    server: https://host.docker.internal:<MINIKUBE_PORT>
  name: minikube
```

Copy configuration

```bash
docker exec -u 0 -it jenkins mkdir -p /var/jenkins_home/.kube

docker cp kubeconfig-jenkins.yaml jenkins:/var/jenkins_home/.kube/config

docker exec -u 0 -it jenkins chown -R 1000:1000 /var/jenkins_home/.kube
```

---

# 🔍 Configure SonarCloud

Install

- SonarQube Scanner Plugin

Configure

- DockerHub Credentials
- SonarCloud Token
- SonarQube Server
- SonarQube Scanner Tool

---

# 📊 Monitoring Stack

Enable Metrics Server

```bash
minikube addons enable metrics-server
```

Install Monitoring Stack

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts

helm repo update

helm install monitoring prometheus-community/kube-prometheus-stack
```

Access Grafana

```bash
kubectl port-forward svc/monitoring-grafana 3000:80
```

Default Login

```
Username : admin

Password : prom-operator
```

---

# ✅ CI/CD Pipeline Includes

✔ GitHub Source Control

✔ Jenkins Automation

✔ Jest Unit Testing

✔ SonarCloud Static Code Analysis

✔ Docker Image Build

✔ Trivy Vulnerability Scan

✔ Docker Hub Image Push

✔ Kubernetes Deployment

✔ Prometheus Monitoring

✔ Grafana Dashboard

---

# 📸 Project Screenshots

## 🚀 Jenkins CI/CD Pipeline

> Add Screenshot Here
![alt text](<Screenshot 1948-04-16 at 12.09.39 AM.png>)
---

## 🏡 Nestly Website

> Add Screenshot Here
![alt text](<Screenshot 1948-04-15 at 3.39.32 PM-1.png>)
---

## ☸️ Kubernetes Deployment

> Add Screenshot Here
![alt text](<Screenshot 1948-04-16 at 12.04.15 AM.png>)
---

## 🔒 Trivy Security Scan

> Add Screenshot Here
![alt text](<Screenshot 1948-04-15 at 9.26.38 PM.png>)
---

## 📈 SonarCloud Analysis

> Add Screenshot Here
![alt text](<Screenshot 1948-04-15 at 11.10.33 PM.png>)
---

## 📊 Grafana Dashboard

> Add Screenshot Here
![alt text](<Screenshot 1948-04-15 at 9.22.08 PM.png>)
---

# 🌟 Future Enhancements

- User Authentication
- Booking System
- Payment Gateway
- AWS EKS Deployment
- Terraform Infrastructure
- GitHub Actions Pipeline
- ArgoCD GitOps
- Helm Charts
- AWS CloudWatch Integration

---

# 👨‍💻 About Me

<div align="center">

# 👋 Hi, I'm **Bablu Alam**

### ☁️ AWS DevOps Engineer | Cloud Enthusiast | Automation Engineer

Passionate about designing scalable cloud infrastructure and building enterprise-grade DevOps pipelines using AWS and modern cloud-native technologies.

I enjoy automating deployments, improving CI/CD workflows, implementing Infrastructure as Code, and working with Kubernetes-based platforms.

### 🚀 Core Skills

☁️ AWS

🐳 Docker

☸️ Kubernetes

🔄 Jenkins

📦 Git & GitHub

🏗 Terraform

⚙️ Ansible

🐧 Linux

📊 Prometheus

📈 Grafana

🔍 SonarCloud

🛡 Trivy

⚡ Bash Scripting

🟨 JavaScript

🟩 Node.js

</div>

---

<div align="center">

## ⭐ If you found this project helpful, consider giving it a Star!

**Happy Learning & Happy Automating 🚀**

Made with ❤️ by **Bablu Alam**

</div>