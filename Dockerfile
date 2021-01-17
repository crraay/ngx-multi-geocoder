FROM node:12-alpine AS builder

WORKDIR /code

COPY package.json /code/package.json

RUN npm install

COPY . /code

RUN npm run build



FROM nginx:1.13-alpine

COPY --from=builder /code/dist /usr/share/nginx/html

EXPOSE 80
