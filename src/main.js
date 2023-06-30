
const { getUploader, createArtifactUploader } = require('container-image-artifact');
const githubActionIO = require('./actions_io');

const INPUT_IMAGE = 'image';
const INPUT_RETENTION_DAYS = 'retention_days';
const INPUT_CONTAINER_ENGINE = 'container_engine';

const OUTPUT_ARTIFACT_NAME = 'artifact_name';

async function runAction(getInput, writeOutput) {
    const imageName = getInput(INPUT_IMAGE, true);
    const retentionDays = parseInt(getInput(INPUT_RETENTION_DAYS));
    const containerEngineName = getInput(INPUT_CONTAINER_ENGINE);

    const upload = getUploader(createArtifactUploader(), containerEngineName.trim());
    const artifactName = await upload(imageName, retentionDays);
    writeOutput(OUTPUT_ARTIFACT_NAME, artifactName);
}

runAction(githubActionIO.getInput, githubActionIO.writeOutput)
    .then(() => console.log("Uploading finished"))
    .catch((err) => githubActionIO.fail(err));
