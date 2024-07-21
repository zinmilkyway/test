FROM node:alpine

WORKDIR /usr/src/app
COPY package*.json ./
COPY yarn.lock ./

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 4004

# Command to run the application
CMD ["node", "dist/main"]