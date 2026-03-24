pipeline {
    agent any

    environment {
        SONAR_TOKEN = credentials('SonarQubeTokens')
    }

    stages {
        stage('Build & Test') {
            steps {
                // ดึงชื่อ Container ID ของ Jenkins ปัจจุบั
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
                expression {
                    return env.GIT_BRANCH == 'origin/develop' || env.GIT_BRANCH == 'develop'
                }
            }
            steps {
                // 1. Sync source code จาก Jenkins workspace ไปยัง folder บน Host
                sh '''
                docker run --rm \
                    --volumes-from ${JENKINS_CONTAINER} \
                    -v /root/apps/my-project/flyup:/deploy \
                    alpine sh -c "rm -rf /deploy/* && cp -r ${WORKSPACE}/. /deploy/"
                '''

                // 2. Build & Run จาก Host path (Docker daemon เห็น path นี้ได้)
                sh '''
                docker compose -f /root/apps/my-project/flyup/docker-compose.yml down || true
                docker compose -f /root/apps/my-project/flyup/docker-compose.yml up -d --build
                '''
            }
        }
    }
}