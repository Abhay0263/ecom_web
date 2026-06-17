// vars/dockerPush.groovy
/**
 * Custom step to push a Docker image to a registry (e.g. Docker Hub) using Jenkins Docker Pipeline DSL.
 *
 * @param config Map containing:
 *               - image (Object): The Docker image object returned by dockerBuild (optional if imageName is provided)
 *               - imageName (String): The Docker image name/tag string (optional if image object is provided)
 *               - registryUrl (String): The target registry URL (default: 'https://index.docker.io/v1/')
 *               - credentialsId (String): The Jenkins credentials ID for the registry (default: 'docker-hub-credentials')
 *               - tags (List): List of tags to push (default: ['latest'])
 */
def call(Map config = [:]) {
    def registryUrl = config.registryUrl ?: 'https://index.docker.io/v1/'
    def credentialsId = config.credentialsId ?: 'docker-hub-credentials'
    def tags = config.tags ?: ['latest']

    echo "[Shared Library] Pushing image to registry: ${registryUrl} using credentials: ${credentialsId}"

    // Authenticate and push within registry block
    docker.withRegistry(registryUrl, credentialsId) {
        if (config.image) {
            def img = config.image
            for (tag in tags) {
                echo "[Shared Library] Pushing image object with tag: ${tag}"
                img.push(tag)
            }
        } else if (config.imageName) {
            def img = docker.image(config.imageName)
            for (tag in tags) {
                echo "[Shared Library] Pushing image name '${config.imageName}' with tag: ${tag}"
                img.push(tag)
            }
        } else {
            error "Either 'image' object or 'imageName' string must be provided to dockerPush step"
        }
    }
}
