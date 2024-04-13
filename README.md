# Container Image Artifact Upload

Github action for uploading container image artifacts. It leverages github action's artifact in the background to share docker image across jobs. The artifact created by each run of this action will be visible in the list of artifacts for the workflow and is prefixed with `action_image_artifact_`. For eg. docker image `foo:latest` will be uploaded as `action_image_artifact_foo_latest`.

See [container-image-artifact-download](https://github.com/ishworkh/container-image-artifact-download).

## Inputs

### `image`

**Required** Image name that is to be uploaded.

### `retention_days`

**Optional** Number of retention days passed to underlying [`@actions/artifact uploadArtifact method`](https://github.com/actions/toolkit/tree/main/packages/artifact#available-options) 

### `container_engine`

**Optional** Container engine to use for packaging the image to be uploaded. Supports `docker`, `podman`. Defaults to `docker`.

## Outputs

### `artifact_name`

Name of artifact created in the process. Eg. `action_image_artifact_foo_latest` for `foo:latest` image.

## Example

Default `docker` container engine,

```yaml
...
jobs:
  build_and_upload:
    - name: Checkout project
      uses: actions/checkout@v2
      
    - name: Build image
      run: |
        docker build -t test_image:latest -<<EOF
        FROM busybox
        RUN touch abc.txt
        EOF

    - name: Upload image
      uses: ishworkh/container-image-artifact-upload@v1.1.1
      with:
        image: "test_image:latest"

```

Using `podman` engine,

```yaml
...
jobs:
  build_and_upload:
    - name: Checkout project
      uses: actions/checkout@v2
      
    - name: Build image
      run: |
        docker build -t test_image:latest -<<EOF
        FROM busybox
        RUN touch abc.txt
        EOF

    - name: Upload image
      uses: ishworkh/container-image-artifact-upload@v1.1.1
      with:
        image: "test_image:latest"
        container_engine: "podman"
```

With `rentention_days`,

```yaml
...
jobs:
  build_and_upload:
    - name: Checkout project
      uses: actions/checkout@v2
      
    - name: Build image
      run: |
        docker build -t test_image:latest -<<EOF
        FROM busybox
        RUN touch abc.txt
        EOF

    - name: Upload image
      uses: ishworkh/container-image-artifact-upload@v1.1.1
      with:
        image: "test_image:latest"
        retention_days: "2"

```

In conjuction with `docker/build-push-action@v2` buildx builds,

```yaml
jobs:
  build_and_upload:
    - name: Checkout project
      uses: actions/checkout@v2
      
    - name: Set up Docker Buildx
      id: buildx
      uses: docker/setup-buildx-action@v1
  
    - name: Build and push
      id: docker_build
      uses: docker/build-push-action@v2
      with:
        push: false
        builder: ${{ steps.buildx.outputs.name }}
        tags: "test_image:latest"
        load: true

    - name: Upload image
      uses: ishworkh/container-image-artifact-upload@v1.1.1
      with:
        image: "test_image:latest"

```

## Changelogs

### `v1.1.1`

- Fix readme

### `v1.1.0`

- Update for nodejs 20

### `v1.0.0`

- First release

## License

This library is under the MIT license.
