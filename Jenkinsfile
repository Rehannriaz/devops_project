pipeline {
    agent any
    
    environment {
        DOCKER_COMPOSE_DEV = 'docker-compose-dev.yml'
        DOCKER_COMPOSE_TEST = 'docker-compose-test.yml'
        DOCKER_COMPOSE_STAGING = 'docker-compose-staging.yml'
        REPO = 'https://github.com/Rehannriaz/devops_project.git'
        BRANCH = ''
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    // Fetch the latest changes from the repository based on branch
                    if (env.BRANCH == 'dev') {
                        git branch: 'dev', url: REPO
                    } else if (env.BRANCH == 'testing') {
                        git branch: 'testing', url: REPO
                    } else if (env.BRANCH == 'main') {
                        git branch: 'main', url: REPO
                    } else {
                        error "Unknown branch"
                    }
                }
            }
        }

        stage('Build and Deploy Dev') {
            when {
                branch 'dev'
            }
            steps {
                script {
                    // Build and deploy using Docker Compose for the dev environment
                    sh 'docker-compose -f $DOCKER_COMPOSE_DEV up --build -d'
                }
            }
        }

        stage('Build and Deploy Testing') {
            when {
                branch 'testing'
            }
            steps {
                script {
                    // Build and deploy using Docker Compose for the testing environment
                    sh 'docker-compose -f $DOCKER_COMPOSE_TEST up --build -d'
                }
            }
        }

        stage('Run Tests') {
            when {
                branch 'testing'
            }
            steps {
                script {
                    // Run your testing framework (e.g., Mocha, Jest)
                    sh 'npm test --prefix frontend'
                    sh 'npm test --prefix backend'
                }
            }
        }

        stage('Merge to Main and Deploy Staging') {
            when {
                branch 'main'
            }
            steps {
                script {
                    // Deploy to Staging
                    sh 'docker-compose -f $DOCKER_COMPOSE_STAGING up --build -d'
                }
            }
        }

        stage('Clean Up') {
            steps {
                script {
                    // Clean up Docker containers after deployment
                    sh 'docker-compose -f $DOCKER_COMPOSE_DEV down'
                    sh 'docker-compose -f $DOCKER_COMPOSE_TEST down'
                    sh 'docker-compose -f $DOCKER_COMPOSE_STAGING down'
                }
            }
        }
    }

    post {
        success {
            echo 'Deployment Successful!'
        }
        failure {
            echo 'Deployment Failed'
        }
    }
}
