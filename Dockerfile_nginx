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

# Bundle static assets with nginx
FROM nginx:1.23.2-alpine

# Copy built assets from `builder` image
COPY --from=builder /app/build /usr/share/nginx/html
# Add your nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Expose port
EXPOSE 8082
# Start nginx
CMD ["nginx", "-g", "daemon off;"]
