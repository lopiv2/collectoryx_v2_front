# pull official base image
FROM node:18.10.0-alpine3.15 as builder

ARG REACT_APP_API_URL

# set working directory
WORKDIR /app

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
COPY yarn.lock ./
RUN yarn install
# add app
COPY . ./

#Environment variables
ENV REACT_APP_API_URL=$REACT_APP_API_URL

RUN yarn build

FROM httpd:alpine

COPY --from=builder /app/build /usr/local/apache2/htdocs
#COPY httpd.conf /usr/local/apache2/conf/httpd.conf
