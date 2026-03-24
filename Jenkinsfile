pipeline {
    agent any

    environment {
        SONAR_TOKEN = credentials('SonarQubeTokens')
    }

    stages {
        stage('Build & Test') {
            steps {
                // ดึงชื่อ Container ID ของ Jenkins ปัจจุบัน
                script {
                    env.JENKINS_CONTAINER = sh(script: 'cat /etc/hostname', returnStdout: true).trim()
                }
                
                // ใช้ --volumes-from เพื่อแชร์โฟลเดอร์ workspace เดียวกับ Jenkins ให้ Container ใหม่
                sh '''
                docker run --rm --volumes-from ${JENKINS_CONTAINER} -w ${WORKSPACE} node:20-alpine sh -c "
                    npm install && 
                    npm run lint && 
                    npm run build
                "
                '''
            }
        }

        // stage('Sonar Scan') {
        //     steps {
        //         withSonarQubeEnv('sonarcloud') {
        //             sh '''
        //             docker run --rm --volumes-from ${JENKINS_CONTAINER} -w ${WORKSPACE} \
        //                 -e SONAR_TOKEN=$SONAR_TOKEN \
        //                 sonarsource/sonar-scanner-cli \
        //                 -Dsonar.projectKey=sundayyogurt_flyup \
        //                 -Dsonar.organization=sundayyogurt \
        //                 -Dsonar.sources=src \
        //                 -Dsonar.exclusions=**/node_modules/**,**/dist/** \
        //                 -Dsonar.host.url=https://sonarcloud.io
        //             '''
        //         }
        //     }
        // }

        stage('Build & Deploy') {
            when {
                anyOf {
                    branch 'develop'
                    branch 'origin/develop'
                }
            }
            steps {
                // ตรงนี้ถ้าโปรเจกต์คุณจะ Build Docker Image ให้ใช้ ${WORKSPACE} เป็น Context ระวังเรื่อง Path ของ docker-compose ด้วย
                sh '''
                docker compose down || true
                docker compose up -d --build
                '''
            }
        }
    }
}