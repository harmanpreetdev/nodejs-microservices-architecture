FROM node:18-alpine

WORKDIR /app/email-service

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5003

CMD ["npm", "start"]