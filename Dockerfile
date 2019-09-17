FROM node:12-alpine
WORKDIR /usr/src/app
ADD . /usr/src/app/
ADD public/ public
RUN npm install
RUN apk --update add imagemagick potrace && \
    rm -rf /var/cache/apk/*
CMD [ "node", "app.js"] 
EXPOSE 8000
