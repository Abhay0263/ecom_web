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
             bat 'if not exist .env copy .env.example .env'
            }
        }

        stage('Test') {
            steps {
                echo 'Running unit tests during Docker build builder stage...'
                bat 'docker build --target builder ./backend'
            }
        }

        stage('Build') {
            steps {
                echo 'Building production Docker images...'
                bat 'docker compose build'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying containers...'
                bat 'docker compose down'
                bat 'docker compose up -d'
            }
        }
    }
}
