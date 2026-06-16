pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
               // git branch: 'main', url: 'https://github.com/your-username/ecom_web.git'
                checkout scm
            }
        }

        stage('Setup Environment') {
            steps {

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
