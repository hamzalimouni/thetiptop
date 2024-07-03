pipeline {
    agent any

    tools {
        nodejs 'node'
    }

    environment {
        versionFile = 'thetiptop_dev_version'
        defaultVersion = '1.0.0'
        version = getVersionFromFile(versionFile, defaultVersion)
    }

    stages {
        stage("Verify Tooling") {
            steps {
                sh '''
                    docker version
                    docker info
                '''
            }
        }

        stage('SonarQube analysis') {
            steps {
                script {
                    scannerHome = tool 'sonarqube'
                }
                withSonarQubeEnv('SonarQube#1') {
                    sh """
                        ${scannerHome}/bin/sonar-scanner \
                        -Dsonar.projectKey=node \
                        -Dsonar.sources=. \
                        -X
                    """
                }
            }
        }

        stage('Tests') {
            when {
                expression { env.BRANCH_NAME == 'dev' }
            }
            steps {
                sh 'rm -rf node_modules'
                sh 'npm install'
                sh 'npm test'
            }
        }

        stage('Build') {
            when {
                expression { env.BRANCH_NAME == 'dev' }
            }
            steps {
                script {
                    version = incrementVersion(version)
                    echo "Building version: $version"
                    writeFile file: versionFile, text: version
                    docker.build("dsp5archi/thetiptop_backend_dev:$version", "-f Dockerfile.dev .")
                }
            }
        }

        stage('Backup to Docker Hub') {
            when {
                expression { env.BRANCH_NAME == 'dev' }
            }
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'dockerhub_credentials') {
                        docker.image("dsp5archi/thetiptop_backend_dev:$version").push("$version")
                        docker.image("dsp5archi/thetiptop_backend_dev:$version").push("latest")
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    switch (env.BRANCH_NAME) {
                        case 'main':
                            sh 'docker-compose -f docker-compose.prod.yml down && docker-compose -f docker-compose.prod.yml up -d --build'
                            break
                        case 'dev':
                            sh 'docker-compose -f docker-compose.dev.yml down && docker-compose -f docker-compose.dev.yml up -d --build'
                            break
                        case 'uat':
                            sh 'docker-compose -f docker-compose.uat.yml down && docker-compose -f docker-compose.uat.yml up -d --build'
                            break
                        default:
                            echo "Branch ${env.BRANCH_NAME} not handled in the build stage"
                    }
                }
            }
        }

        stage('Push to UAT') {
            when {
                expression { env.BRANCH_NAME == 'dev' }
            }
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'gitea', usernameVariable: 'GIT_USERNAME', passwordVariable: 'GIT_PASSWORD')]) {
                        sh '''
                            git config --global credential.helper store
                            git checkout uat
                            git pull origin uat
                            git merge origin/dev
                        '''
                            def remoteUrl = 'https://gitea.dsp5-archi-f23-15m-g4.fr/dsp/thetiptop_backend.git'
                            def encodedPassword = URLEncoder.encode(GIT_PASSWORD, 'UTF-8').replace('+', '%20')
                            sh "git push ${remoteUrl.replaceFirst('https://', 'https://' + GIT_USERNAME + ':' + encodedPassword + '@')}"
                    }
                }
            }
        }
    }
}

def getVersionFromFile(file, defaultVersion) {
    def version = defaultVersion
    if (fileExists(file)) {
        version = readFile(file).trim()
    }
    return version
}

def fileExists(file) {
    def exists = false
    try {
        exists = sh(script: "[ -e ${file} ]", returnStatus: true) == 0
    } catch (Exception e) {
        echo "Error checking file existence: ${e.message}"
    }
    return exists
}


def incrementVersion(version) {
    def (major, minor, patch) = version.split(/\./).collect { it.toInteger() }
    patch += 1
    return "${major}.${minor}.${patch}"
}
