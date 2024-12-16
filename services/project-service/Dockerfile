FROM node:18-alpine

WORKDIR /app/project-service

COPY package.json .

RUN npm install

COPY . .

EXPOSE 5002

CMD ["npm", "start"]