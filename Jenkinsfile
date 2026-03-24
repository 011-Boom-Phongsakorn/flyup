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
                    // ใช้ Docker ของเครื่อง Host รัน Scanner ให้ โดยส่ง Token เข้าไป
                    sh '''
                    docker run --rm \
                        -v ${WORKSPACE}:/usr/src \
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
