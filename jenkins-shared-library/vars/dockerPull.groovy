// jenkins-shared-library/vars/dockerPull.groovy
/**
 * Custom step to pull a Docker image from a registry (e.g. Docker Hub) using Jenkins Docker Pipeline DSL.
 *
 * @param config Map containing:
 *               - imageName (String): The Docker image name/tag string (required)
 *               - registryUrl (String): The target registry URL (default: 'https://index.docker.io/v1/')
 *               - credentialsId (String): The Jenkins credentials ID for the registry (default: 'docker-hub-credentials')
 */
def call(Map config = [:]) {
    if (!config.imageName) {
        error "imageName is a required parameter for dockerPull step"
    }

    def registryUrl = config.registryUrl ?: 'https://index.docker.io/v1/'
    def credentialsId = config.credentialsId ?: 'docker-hub-credentials'

    echo "[Shared Library] Pulling image '${config.imageName}' from registry: ${registryUrl} using credentials: ${credentialsId}"

    // Authenticate and pull within registry block
    docker.withRegistry(registryUrl, credentialsId) {
        def img = docker.image(config.imageName)
        img.pull()
    }
}
