FROM node:20-alpine
WORKDIR /app

# copiar package.json desde la subcarpeta producer/
COPY producer/package*.json ./
RUN npm install --production

# copiar el resto del código desde la subcarpeta producer/
COPY producer/. .

CMD ["node", "index.js"]
