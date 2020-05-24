# Usa a imagem do node do docker hub como base
FROM node 

# Cria o diretorio e seta ele como pasta de trabalho
WORKDIR /app/meat-api

# Copia os arquivos de pacote
COPY package*.json ./

# Instala as depencias
RUN npm install

# Copia todos os arquivos excluindo os arquivo do .dockerignore
COPY . .

# Build a app
RUN npm run build

# Expoe a porta 3000 do container
EXPOSE 3000

# Inicia a aplicação
CMD ["npm", "start"]