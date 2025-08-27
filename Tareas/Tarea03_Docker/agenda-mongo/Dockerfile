# Imagen base de Node
FROM node:18

# Crear directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del proyecto
COPY . .

# Exponer el puerto de la app
EXPOSE 3000

# Comando para ejecutar
CMD ["node", "app.js"]
