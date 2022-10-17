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

# RUN yarn build

# start app
CMD ["yarn", "start"]
