FROM registry.cn-hangzhou.aliyuncs.com/swtech/xenode
MAINTAINER Meng <mengziwen@zhiguaniot.com>
COPY build /usr/app/src/build
COPY config /usr/app/src/config
COPY node_modules /usr/app/src/node_modules
COPY src /usr/app/src/src
COPY test /usr/app/src/test
COPY index.html /usr/app/src/index.html
COPY package.json /usr/app/src/package.json
COPY .postcssrc.js /usr/app/src/.postcssrc.js
ENV PORT 8088
EXPOSE 8088
WORKDIR /usr/app/src
RUN npm install
RUN chmod -R 777 /usr/app
ENTRYPOINT npm start
