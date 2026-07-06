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

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${FULL_IMAGE} -t ${DOCKERHUB_USERNAME}/${IMAGE_NAME}:latest ."
            }
        }

        stage('Push to Docker Hub') {
            steps {
                // Create this credential in Jenkins: Manage Jenkins > Credentials
                // Kind: Username with password, ID: dockerhub-creds
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
                // Assumes Jenkins agent has kubectl configured against your Minikube cluster
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
            echo "Deployed ${FULL_IMAGE} to Minikube."
        }
        failure {
            echo "Pipeline failed — check the stage logs above."
        }
    }
}
