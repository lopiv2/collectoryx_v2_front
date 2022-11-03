![favicon-1](https://user-images.githubusercontent.com/58883759/199532747-fb997fdb-8551-46f9-9075-b3f64f57b4a2.png)

Collectoryx is a manager where you can add your own collections and objects and keep track of the ones you own, as well as the money they cost, images, import items from online databases, and so on.

## Version Tags

This image provides various versions that are available via tags. Please read the descriptions carefully and exercise caution when using unstable or development tags.

| Tag | Available | Description |
| :----: | :----: |--- |
| latest | ✅ | Stable releases from Collectoryx (currently v1) |

## Application Setup

As you will see in the Docker Compose below, you need an image of the Collectoryx Backend and Frontend, as well as the dependency on a Maria DB Database, which if you already have it configured in your Stack, is simply to change the parameters of the API environment variable in the docker-compose, putting the IP and user and password of the database.

Essential: Leave the uploads volume as it is created because both, Backend and Frontend have to share it.

Access the webui at `<your-ip>:8082`

## Usage

Here are some example snippets to help you get started creating a container.

### docker-compose (recommended)

```yaml
---
version: "3.9"

services:
  api:
    #build: .
    image: collectoryx-api
    ports:
      - "8080:8080"
    depends_on:
      - mariadb
    volumes:
      - uploads:/app/uploads:rw
    environment:
      SPRING_APPLICATION_JSON: '{"spring":{"datasource":{"url":"jdbc:mariadb://mariadb:3306/collectoryx", "username": "root", "password": "root-password"}},"collectoryx.upload-directory":"/app/uploads/"}'

  front:
    #build: .
    image: collectoryx-front
    ports:
      - "8082:8082"
    depends_on:
      - api
    volumes:
      - uploads:/app/public/images/uploads:ro


  mariadb:
    image: "mariadb:10.9"
    ports:
      - "33306:3306"
    environment:
      MARIADB_USER: collectoryx
      MARIADB_PASSWORD: password
      MARIADB_ROOT_PASSWORD: root-password
      MARIADB_DATABASE: collectoryx

volumes:
  uploads:

```

## Parameters

Container images are configured using parameters passed at runtime (such as those above).

| Parameter | Function |
| :----: | --- |
| `-p 8082` | The port for the Collectoryx webinterface |

## Updating Info

Below are the instructions for updating containers:

### Via Docker Compose

* Update all images: `docker-compose pull`
  * or update a single image: `docker-compose pull sonarr`
* Let compose update all containers as necessary: `docker-compose up -d`
  * or update a single container: `docker-compose up -d sonarr`
* You can also remove the old dangling images: `docker image prune`

## Frontend Github

https://github.com/lopiv2/collectoryx_v2_api
