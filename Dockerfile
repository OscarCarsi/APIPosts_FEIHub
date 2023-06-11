FROM node:19-alpine3.16
EXPOSE 8082
COPY . ./app
WORKDIR /app
RUN npm install
CMD [ "node" , "app" ]