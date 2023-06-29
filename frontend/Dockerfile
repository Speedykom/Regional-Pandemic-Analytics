FROM node:18-alpine as common-build-stage

WORKDIR /frontend

COPY . .

RUN npm install -g npm@latest

RUN npm install

EXPOSE 3000

FROM common-build-stage as development-build-stage

RUN npm run build

CMD ["npm", "run", "dev"]

FROM common-build-stage as production-build-stage

RUN npm run build

CMD ["npm", "run", "start"]
