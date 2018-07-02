FROM node:9.0.0
MAINTAINER Meng <mengziwen@zhiguaniot.com>
COPY build /usr/app/src/build
COPY config /usr/app/src/config
COPY src /usr/app/src/src
COPY test /usr/app/src/test
COPY index.html /usr/app/src/index.html
COPY package.json /usr/app/src/package.json
COPY .postcssrc.js /usr/app/src/.postcssrc.js
EXPOSE 8088
WORKDIR /usr/app/src
RUN npm config set registry=https://registry.npm.taobao.org && npm install
ENTRYPOINT npm start

#FROM node:9.0.0
#MAINTAINER Meng <mengziwen@zhiguaniot.com>
#COPY dist /usr/app/src/dist
#EXPOSE 8088
#WORKDIR /usr/app/src/dist
#ENTRYPOINT npm start
