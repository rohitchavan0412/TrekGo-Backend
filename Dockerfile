FROM node:10
WORKDIR /App
COPY . /App
COPY package*.json ./
RUN npm install
EXPOSE 3000
CMD ["node","server.js"]
