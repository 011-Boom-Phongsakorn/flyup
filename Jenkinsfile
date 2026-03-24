pipeline {
    agent any

    // บอกให้ Jenkins เตรียม Node.js ให้ โดยอ้างอิงจากชื่อที่ตั้งไว้ใน Global Tool Configuration
    tools {
        nodejs 'node20' // *ต้องไปตั้งชื่อนี้ใน Jenkins ก่อน*
    }

    environment {
        SONAR_TOKEN = credentials('SonarQubeTokens')
    }

    stages {
        stage('Check Environment') {
            steps {
                sh 'node --version'
                sh 'npm --version'
                
                // เช็คว่ามี wget/curl unzip ไหมสำหรับโหลด Sonar
                sh 'apt-get update && apt-get install -y curl unzip || apk add --no-cache curl unzip || echo "Skip install"'
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
                    // ใช้ Sonar Scanner แบบ Download สด เพราะไม่มี Docker
                    sh '''
                    rm -rf sonar-scanner*

                    curl -sSLo sonar-scanner.zip https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-5.0.1.3006-linux.zip
                    unzip -o sonar-scanner.zip

                    ./sonar-scanner-*/bin/sonar-scanner \
                      -Dsonar.projectKey=sundayyogurt_flyup \
                      -Dsonar.organization=sundayyogurt \
                      -Dsonar.sources=src \
                      -Dsonar.exclusions=**/node_modules/**,**/dist/** \
                      -Dsonar.host.url=https://sonarcloud.io \
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
                // TODO: Jenkins Server ต้องสามารถสั่งรัน Docker ของเครื่อง Host ได้
                sh '''
                    # ถ้า Jenkins ไม่มี Docker 명령이, 부분นี้จะพัง
                    docker compose down || true
                    docker compose up -d --build
                '''
            }
        }
    }
}
