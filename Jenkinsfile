pipeline {
    agent any

    environment {
        DOCKERHUB_USERNAME = 'skbablualam03031997'
        IMAGE_NAME         = 'nestly'
        IMAGE_TAG          = "${env.BUILD_NUMBER}"
        FULL_IMAGE         = "${DOCKERHUB_USERNAME}/${IMAGE_NAME}:${IMAGE_TAG}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Unit Tests') {
            steps {
                // Assumes Node.js environment. Make sure you have a "test" script in package.json
                sh 'npm install'
                sh 'npm test' 
            }
        }

        stage('SonarQube Code Analysis') {
            steps {
                // Assumes you have configured a SonarQube server in Jenkins named 'SonarQube-Server'
                withSonarQubeEnv('SonarQube-Server') {
                    sh 'sonar-scanner -Dsonar.projectKey=nestly -Dsonar.sources=.'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${FULL_IMAGE} -t ${DOCKERHUB_USERNAME}/${IMAGE_NAME}:latest ."
            }
        }

        stage('Trivy Image Scanning') {
            steps {
                // Scans the local image for High and Critical vulnerabilities before pushing
                sh "trivy image --severity HIGH,CRITICAL ${FULL_IMAGE}"
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
                    sh "docker push ${FULL_IMAGE}"
                    sh "docker push ${DOCKERHUB_USERNAME}/${IMAGE_NAME}:latest"
                }
            }
        }

        stage('Deploy to Minikube') {
            steps {
                sh """
                    sed -i "s|${DOCKERHUB_USERNAME}/${IMAGE_NAME}:latest|${FULL_IMAGE}|g" k8s/deployment.yaml
                    kubectl apply -f k8s/deployment.yaml
                    kubectl apply -f k8s/service.yaml
                    kubectl rollout status deployment/nestly-deployment
                """
            }
        }
    }

    post {
        always {
            sh 'docker logout'
        }
        success {
            sh '''
            echo "========== Pipeline Execution Successful =========="
            '''
            echo "Deployed ${FULL_IMAGE} to Minikube."
        }
        failure {
            sh '''
            echo "========== Pipeline Execution Failed =========="
            '''
        }
    }
}