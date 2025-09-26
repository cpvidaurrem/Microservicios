# Imagen base ligera con Node.js
FROM node:20-alpine 

# Carpeta de trabajo dentro del contenedor
WORKDIR /usr/src/app

# copiar package.json e instalar dependencias
COPY package*.json ./
RUN npm install --production

# Copiamos el resto del proyecto (código fuente, vistas, etc.)
COPY . .

# definir variable de entorno para puerto
ENV PORT=8080

# Expone el puerto donde corre Express
EXPOSE 8080

# comandos por defecto para iniciar la app en el contenedor
CMD ["node", "app.js"]
