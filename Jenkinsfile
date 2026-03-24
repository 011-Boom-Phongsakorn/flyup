pipeline {
    agent any

    environment {
        SONAR_TOKEN = credentials('SonarQubeTokens')
        // เพิ่ม PATH ให้ Jenkins รู้จัก node และ npm ที่เรากำลังจะโหลด
        PATH = "${env.WORKSPACE}/node-v20.12.0-linux-x64/bin:${env.PATH}"
    }

    stages {
        stage('Setup Dependencies') {
            steps {
                sh '''
                    # 1. ติดตั้ง curl และ unzip (เผื่อยังไม่มีใน Jenkins OS)
                    apt-get update && apt-get install -y curl unzip || apk add --no-cache curl unzip || true
                    
                    # 2. ดาวน์โหลด Node.js แบบ Binary โยนลง Workspace นี้เลย
                    if [ ! -d "node-v20.12.0-linux-x64" ]; then
                        echo "Downloading Node.js..."
                        curl -sSLo node.tar.xz https://nodejs.org/dist/v20.12.0/node-v20.12.0-linux-x64.tar.xz
                        tar -xf node.tar.xz
                        rm node.tar.xz
                    fi
                '''
            }
        }

        stage('Check Node') {
            steps {
                sh '''
                    node --version
                    npm --version
                '''
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

                    # โหลด Sonar Scanner สดลงมา
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
                sh '''
                    # NOTE: Jenkins Container สั่ง Docker Host ไม่ได้ 
                    # ส่วนนี้จะล้มเหลวแน่นอนเว้นแต่ตั้งค่า Docker socket mount แบบที่แนะนำไว้ก่อนหน้า
                    echo "Deploy Stage Started..."
                    echo "Cannot run 'docker compose' directly inside Jenkins container without Docker Socket mounted."
                    
                    # ลองคำสั่งเฉยๆ ถ้าพัง pipeline จะได้ไม่พัง
                    docker compose down || true
                    docker compose up -d --build || true
                    
                    echo "Deploy scripts executed (but likely failed due to missing docker daemon)"
                '''
            }
        }
    }
}
