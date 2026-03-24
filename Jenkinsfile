pipeline {
    agent {
        docker {
            image 'node:20-alpine'
            args '-v /var/run/docker.sock:/var/run/docker.sock'
        }
    }

    environment {
        SONAR_TOKEN = credentials('SonarQubeTokens')
    }

    stages {
        stage('Check Node') {
            steps {
                sh 'node --version'
                sh 'npm --version'
            }
        }

        stage('Install') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Sonar Scan') {
            steps {
                withSonarQubeEnv('sonarcloud') {
                    sh '''
                    rm -rf sonar-scanner*

                    apk add --no-cache curl unzip openjdk17

                    curl -sSLo sonar-scanner.zip https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-5.0.1.3006-linux.zip
                    unzip sonar-scanner.zip

                    ./sonar-scanner-*/bin/sonar-scanner \
                      -Dsonar.projectKey=sundayyogurt_flyup \
                      -Dsonar.organization=sundayyogurt \
                      -Dsonar.sources=src \
                      -Dsonar.exclusions=**/node_modules/**,**/dist/** \
                      -Dsonar.login=$SONAR_TOKEN
                    '''
                }
            }
        }

        stage('Build & Deploy') {
            when {
                expression {
                    return env.GIT_BRANCH == 'origin/develop' || env.GIT_BRANCH == 'develop'
                }
            }
            steps {
                // เพิ่มคำสั่ง cd เข้าไปในโฟลเดอร์ที่เก็บไฟล์ docker-compose.yml ของคุณ
                sh '''
                    apk add --no-cache docker-cli docker-compose-plugin
                    
                    # ตรวจสอบว่า path นี้ตรงกับโฟลเดอร์โปรเจกต์ใน Jenkins Workspace
                    docker compose down
                    docker compose up -d --build
                '''
            }
        }
    }
}
