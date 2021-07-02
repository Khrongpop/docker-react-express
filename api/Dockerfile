# pull official base image
FROM node:alpine

RUN yarn global add nodemon 

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY yarn.lock ./
RUN yarn install

# add app
COPY . ./

EXPOSE 8080

# start app
CMD ["yarn", "serve"]    