pipeline {
    agent any
    tools {
        maven 'Maven 3.6.0'
        jdk 'OpenJDK8'
    }

    environment {
    //Use Pipeline Utility Steps plugin to read information from pom.xml into env variables
    IMAGE = readMavenPom().getArtifactId()
    VERSION = readMavenPom().getVersion()
        // This can be nexus3 or nexus2
        NEXUS_VERSION = "nexus3"
        // This can be http or https
        NEXUS_PROTOCOL = "https"
        // Where your Nexus is running
        NEXUS_URL = "nexus.treehouse.devops-in-a-box.de"
        // Repository where we will upload the artifact
        NEXUS_REPOSITORY = "xidra"
        // Jenkins credential id to authenticate to Nexus OSS
        NEXUS_CREDENTIAL_ID = "nexus-credentials"
    }

    stages {
        stage ('Initialize') {
            steps {
                sh '''
                    echo "PATH = ${PATH}"
                    echo "M2_HOME = ${M2_HOME}"
                '''
            }
        }
        stage ('Build') {
            steps {
                sh 'mvn -Dmaven.test.failure.ignore=true clean package'
            }
            post {
                success {
                    echo "sucess"
                }
            }
        }
		stage('Sonarqube') {
    		environment {
        		scannerHome = tool 'SonarQubeScanner'
    		}
    		steps {
        		withSonarQubeEnv('sonarqube') {
            		sh "${scannerHome}/bin/sonar-scanner"
        		}
        		timeout(time: 10, unit: 'MINUTES') {
            		waitForQualityGate abortPipeline: true
        		}
    		}
		}
        stage("publish to nexus") {
            steps {
                script {
                    // Read POM xml file using 'readMavenPom' step , this step 'readMavenPom' is included in: https://plugins.jenkins.io/pipeline-utility-steps
                    pom = readMavenPom file: "pom.xml";

                    // Find built artifact under target folder
                    //filesByGlob = findFiles(glob: "target/${pom.artifactId}-${pom.version}.${pom.packaging}");
                    filesByGlob = findFiles(glob: "${pom.artifactId}-${pom.version}-delivery.zip");
                    // Print some info from the artifact found

                    echo "${filesByGlob[0].name} ${filesByGlob[0].path} ${filesByGlob[0].directory} ${filesByGlob[0].length} ${filesByGlob[0].lastModified}"
                    // Extract the path from the File found
                    artifactPath = filesByGlob[0].path;
                    // Assign to a boolean response verifying If the artifact name exists
                    artifactExists = fileExists artifactPath;
                    if(artifactExists) {
                        echo "*** File: ${artifactPath}, group: ${pom.groupId}, packaging: ${pom.packaging}, version ${pom.version}";
                        nexusArtifactUploader(
                            nexusVersion: NEXUS_VERSION,
                            protocol: NEXUS_PROTOCOL,
                            nexusUrl: NEXUS_URL,
                            groupId: pom.groupId,
                            version: pom.version,
                            repository: NEXUS_REPOSITORY,
                            credentialsId: NEXUS_CREDENTIAL_ID,
                            artifacts: [
                                // Artifact generated such as .jar, .ear and .war files.
                                [artifactId: pom.artifactId,
                                classifier: '',
                                file: artifactPath,
                                type: 'zip'],
                                // Lets upload the pom.xml file for additional information for Transitive dependencies
                                [artifactId: pom.artifactId,
                                classifier: '',
                                file: "pom.xml",
                                type: "pom"]
                            ]
                        );
                    } else {
                        error "*** File: ${artifactPath}, could not be found";
                    }
                }
            }
        }
        /*
        stage('Package')
        {
            steps {
//              xldCreatePackage artifactsPath: 'target', manifestPath: 'deployit-manifest.xml', darPath: '$JOB_NAME-$BUILD_NUMBER.0.dar'
//              echo "success"
            }
        }
        stage('Publish')
        {
            steps {
//              xldPublishPackage serverCredentials: '<user_name>', darPath: '$JOB_NAME-$BUILD_NUMBER.0.dar'
                echo "success"
            }
        }
        */
        stage('Start XLR Release')
        {
            steps {
//               xlrCreateRelease overrideCredentialId: 'technicalaccount', serverCredentials: 'technicalaccount',
//               template: 'LBBW/ComponentBuildTemplate', releaseTitle: 'Release for $BUILD_TAG', variables: [[propertyName: 'configurationVersion', propertyValue: '$BUILD_NUMBER.0']], startRelease: true
				 xlrCreateRelease serverCredentials: 'technicalaccount', template: 'LBBW Pilot/ComponentBuildTemplate', releaseTitle: 'Release for $BUILD_TAG', version: 'Release for $BUILD_TAG', variables: [[propertyName: 'jiraReleaseKey', propertyValue: 'DIAB-1'],[propertyName: 'component', propertyValue: 'DIAB-1'],[propertyName: 'version', propertyValue: 'DIAB-1']], startRelease: true    
            }
        }
    }
}
