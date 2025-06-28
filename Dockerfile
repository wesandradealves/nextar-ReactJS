# Dockerfile para a aplicação web3 com Node.js e Next.js

# Use a imagem oficial do Node.js como base
FROM node:18-alpine

# Defina o diretório de trabalho no contêiner
WORKDIR /app

# Copie apenas os arquivos de dependências para o contêiner
COPY package.json package-lock.json ./
COPY .env ./

# Instale as dependências (incluindo devDependencies)
RUN npm install --include=dev

# Copie o restante dos arquivos do projeto
COPY . .

# Execute o build da aplicação
RUN npm run build

# Otimiza imagens PNG/JPG/JPEG/WEBP/AVIF durante o build (opcional, mas recomendado)
RUN npm install -g sharp-cli && \
    if [ -d ./public/img ]; then \
      find ./public/img -type f \( -iname '*.png' -o -iname '*.jpg' -o -iname '*.jpeg' \) -exec sh -c 'sharp "$1" --resize 1920 --to-format webp -o "${1%.*}.webp"' _ {} \;; \
    fi

RUN ls -la /app/.next

# Exponha a porta 3000 para o servidor de produção
EXPOSE 3000

# Comando para iniciar o servidor de produção
CMD ["npm", "run", "start"]
