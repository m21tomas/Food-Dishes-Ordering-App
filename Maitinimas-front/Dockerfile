FROM node:19-alpine3.16
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build
