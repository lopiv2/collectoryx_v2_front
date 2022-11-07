# pull official base image
FROM node:18.10.0-alpine3.15 as builder

# set working directory
WORKDIR /app

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
COPY yarn.lock ./
RUN yarn install

# add app
COPY . ./

RUN yarn build

FROM httpd:alpine

COPY --from=builder /app/build /usr/local/apache2/htdocs
