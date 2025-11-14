FROM node:20-alpine

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar el resto del código
COPY . .

# Exponer puerto
EXPOSE 5173

# Comando por defecto (se puede sobrescribir en docker-compose)
CMD ["npm", "run", "dev", "--", "--host"]
