// jenkins-shared-library/vars/dockerBuild.groovy
/**
 * Custom step to build a Docker image using native Jenkins Docker Pipeline DSL.
 *
 * @param config Map containing:
 *               - imageName (String): The tag/name for the built image (required)
 *               - context (String): The build context directory (default: '.')
 *               - dockerfile (String): Path to the Dockerfile relative to context (default: 'Dockerfile')
 *               - target (String): Optional multi-stage build target
 *               - buildArgs (String): Optional additional build arguments
 */
def call(Map config = [:]) {
    if (!config.imageName) {
        error "imageName is a required parameter for dockerBuild step"
    }

    def imageName = config.imageName
    def context = config.context ?: '.'
    def dockerfile = config.dockerfile ?: 'Dockerfile'
    def target = config.target ?: ''
    def buildArgs = config.buildArgs ?: ''

    echo "[Shared Library] Building Docker image: ${imageName} from context: ${context} using ${dockerfile}"
    
    // Build the options string for docker.build
    def buildOptions = "-f ${context}/${dockerfile}"
    if (target) {
        buildOptions += " --target ${target}"
    }
    if (buildArgs) {
        buildOptions += " ${buildArgs}"
    }

    // Call the Jenkins Docker Pipeline plugin's build step
    def img = docker.build(imageName, "${buildOptions} ${context}")
    return img
}
