pipeline {
    agent any // เราใช้ any เพราะเราลง Docker CLI ไว้ใน Jenkins แล้ว

    environment {
        SONAR_TOKEN = credentials('SonarQubeTokens')
    }

    stages {
        stage('Build & Test') {
            steps {
                // ใช้ docker run เพื่อดึง Node เข้ามาทำงานเฉพาะตอน Build
                sh '''
                docker run --rm -v ${WORKSPACE}:/app -w /app node:20-alpine sh -c "
                    npm ci && 
                    npm run lint && 
                    npm run build
                "
                '''
            }
        }

        stage('Sonar Scan') {
            steps {
                withSonarQubeEnv('sonarcloud') {
                    // ใช้ Image ของ Sonar Scanner โดยตรง (มี Java ในตัว ไม่ต้องลงเพิ่ม)
                    sh '''
                    docker run --rm -v ${WORKSPACE}:/usr/src \
                        -e SONAR_TOKEN=$SONAR_TOKEN \
                        sonarsource/sonar-scanner-cli \
                        -Dsonar.projectKey=sundayyogurt_flyup \
                        -Dsonar.organization=sundayyogurt \
                        -Dsonar.sources=src \
                        -Dsonar.exclusions=**/node_modules/**,**/dist/** \
                        -Dsonar.host.url=https://sonarcloud.io
                    '''
                }
            }
        }

        stage('Build & Deploy') {
            when {
                anyOf {
                    branch 'develop'
                    branch 'origin/develop'
                }
            }
            steps {
                sh '''
                docker compose down
                docker compose up -d --build
                '''
            }
        }
    }
}