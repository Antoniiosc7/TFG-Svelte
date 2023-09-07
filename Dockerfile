# Usa una imagen base de Node.js
FROM node:14

# Establece el directorio de trabajo en /app
WORKDIR /app

# Copia los archivos de la aplicación al directorio de trabajo
COPY . .

# Instala las dependencias del proyecto
RUN npm install

RUN npm install -g http-server

# Expone el puerto en el que se ejecutará la aplicación (puerto 8083)
EXPOSE 8083

# Comando para iniciar la aplicación usando nohup
CMD ["nohup", "http-server", "--port", "8083", "&"]
