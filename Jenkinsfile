@Library('ecom-shared-library') _

pipeline {
    agent any

    environment {
        DOCKER_HUB = credentials('docker-hub-credentials')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Setup Environment') {
            steps {
                bat 'if not exist .env copy .env.example .env'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying containers...'
                script {
                    dockerPull(
                        imageName: "${env.DOCKER_HUB_USR}/ecom-backend:latest",
                        credentialsId: 'docker-hub-credentials'
                    )
                    dockerPull(
                        imageName: "${env.DOCKER_HUB_USR}/ecom-frontend:latest",
                        credentialsId: 'docker-hub-credentials'
                    )
                }
                bat 'docker compose down'
                bat 'docker compose up -d'
            }
        }
    }
}


