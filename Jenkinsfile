pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo 'Pulling latest code from GitHub...'
                // Jenkins pulls the code from SCM automatically if configured in UI.
                // Or you can specify a git URL like:
                // git branch: 'main', url: 'https://github.com/your-username/ecom_web.git'
                checkout scm
            }
        }

        stage('Setup Environment') {
            steps {
                echo 'Setting up environment file...'
                // Since .env is ignored in Git, ensure we have one for docker compose
                sh 'cp -n .env.example .env || true'
            }
        }

        stage('Test') {
            steps {
                echo 'Running unit tests inside backend container...'
                sh 'docker compose run --rm backend npm test'
            }
        }

        stage('Build') {
            steps {
                echo 'Building production Docker images...'
                sh 'docker compose build'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying containers...'
                sh 'docker compose down'
                sh 'docker compose up -d'
            }
        }
    }
}
