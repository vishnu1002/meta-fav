FROM node:23-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN npm install -g serve

ENV NODE_ENV=production

CMD [ "serve", "-s", "build", "-l", "4173" ]

EXPOSE 4173