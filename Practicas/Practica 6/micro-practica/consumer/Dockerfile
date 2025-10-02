FROM node:20-alpine
WORKDIR /app

# copiar package.json desde la subcarpeta consumer/
COPY consumer/package*.json ./
RUN npm install --production

# copiar el resto del código desde la subcarpeta consumer/
COPY consumer/. .

CMD ["node", "index.js"]
