# Imagen base Node.js
FROM node:18-alpine

# Crear directorio de trabajo
WORKDIR /usr/src/app

# Copiar package.json e instalar dependencias
COPY package*.json ./
RUN npm install --production

# Copiar el resto del código
COPY . .

# Exponer puerto de la app
EXPOSE 3000

# Comando por defecto para iniciar la app
CMD ["node", "app.js"]
