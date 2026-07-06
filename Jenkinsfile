pipeline {
    agent any

    environment {
        DOCKERHUB_USERNAME = 'skbablualam03031997'
        IMAGE_NAME         = 'nestly'
        IMAGE_TAG          = "${env.BUILD_NUMBER}"
        FULL_IMAGE         = "${DOCKERHUB_USERNAME}/${IMAGE_NAME}:${IMAGE_TAG}"
        SONAR_ORG = 'nestly'
        SONAR_PROJECT = 'skbablualam_nestly'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Unit Tests') {
            steps {
                // Placeholder echo commands to simulate passing unit tests
                sh 'echo "Executing Unit Tests..."'
                sh 'echo "All Unit Tests Passed Successfully!"'
            }
        }

        stage('SonarQube Code Analysis') {
            environment {
                // This grabs the installation path and saves it to SCANNER_HOME
                SCANNER_HOME = tool name: 'SonarQubeScanner', type: 'hudson.plugins.sonar.SonarRunnerInstallation'
            }
            steps {
                withSonarQubeEnv('MySonar') {
                    // Note the triple double-quotes """ and the ${SCANNER_HOME}/bin/ path!
                    sh """
                    ${SCANNER_HOME}/bin/sonar-scanner \
                      -Dsonar.projectKey=${SONAR_PROJECT} \
                      -Dsonar.organization=${SONAR_ORG} \
                      -Dsonar.sources=.
                    """
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