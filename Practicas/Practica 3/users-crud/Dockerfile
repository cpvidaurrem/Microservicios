FROM node:18-alpine

WORKDIR /usr/src/app

# copiar package.json e instalar dependencias
COPY package*.json ./
RUN npm install --production

# copiar código
COPY . .

ENV PORT=8080

EXPOSE 8080

CMD ["node", "app.js"]
