![favicon-1](https://user-images.githubusercontent.com/58883759/199532747-fb997fdb-8551-46f9-9075-b3f64f57b4a2.png)

Collectoryx is a manager where you can add your own collections and objects and keep track of the ones you own, as well as the money they cost, images, import items from online databases, and so on.

## Version Tags

This image provides various versions that are available via tags. Please read the descriptions carefully and exercise caution when using unstable or development tags.

| Tag | Available | Description |
| :----: | :----: |--- |
| latest | ✅ | Stable releases from Collectoryx (currently 1.5.0) |

## Application Setup

As you will see in the Docker Compose below, you need an image of the Collectoryx Backend and Frontend, as well as the dependency on a Maria DB Database, which if you already have it configured in your Stack, is simply to change the parameters of the API environment variable in the docker-compose, putting the IP and user and password of the database.

Essential: 
- Leave the uploads volume as it is created because both, Backend and Frontend have to share it.
- Config.js file has this content: 
   - window.env = { API_URL: "https://api-collectoryx.domain" };

If you need to call the backend api with traefik or another reverse proxy, you need to change the API_URL in config.js file to your api route. IF NOT, THE APP WON´T WORK

Access the webui at `<your-ip>:8082`

## Usage

Here are some example snippets to help you get started creating a container.

## Screenshots

![Screenshot_2](https://user-images.githubusercontent.com/58883759/199770991-e580b849-efd6-4731-85d1-a81e42c886b5.png)

![Screenshot_3](https://user-images.githubusercontent.com/58883759/199771032-e7de364b-2302-4fcd-a630-8cb166712949.png)

![Screenshot_4](https://user-images.githubusercontent.com/58883759/199771142-dd8465fb-2465-4dfc-b70b-74d7e2a5b3cd.png)

![Screenshot_5](https://user-images.githubusercontent.com/58883759/199771173-f3117ca8-c00b-4c3e-ba1b-660b09253043.png)

![Screenshot_6](https://user-images.githubusercontent.com/58883759/199771191-e04f1543-3d56-41df-9eb1-f1050afa3ec2.png)

![Screenshot_7](https://user-images.githubusercontent.com/58883759/199771208-548e4987-f6b0-40c9-8f0e-9f199a43259d.png)

### docker-compose (recommended)

```yaml
---
version: "3.9"

services:
  api:
    image: lopiv2/collectoryx-api:latest
    ports:
      - "8080:8080"
    depends_on:
      - mariadb
    volumes:
      - uploads:/app/uploads:rw
    environment:
      SPRING_APPLICATION_JSON: '{"spring":{"datasource":{"url":"jdbc:mariadb://mariadb:3306/collectoryx", "username": "root", "password": "root-password"}},"collectoryx.upload-directory":"/app/uploads/"}'

  front:
    image: lopiv2/collectoryx-front:latest
    ports:
      - "8082:8082"
    depends_on:
      - api
    volumes:
      - uploads:/app/public/images/uploads:ro
      - type: bind
        source: ./config.js
        target: /usr/local/apache2/htdocs/config.js


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
  * or update a single image: `docker-compose pull collectoryx`
* Let compose update all containers as necessary: `docker-compose up -d`
  * or update a single container: `docker-compose up -d collectoryx`
* You can also remove the old dangling images: `docker image prune`

## Backend Github

https://github.com/lopiv2/collectoryx_v2_api
