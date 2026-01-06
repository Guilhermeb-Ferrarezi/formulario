FROM oven/bun:1.1.38

WORKDIR /app

# copia apenas arquivos de dependência primeiro (cache)
COPY package.json bun.lockb* ./

RUN bun install --production

# copia o resto
COPY . .

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["bun", "run", "src/server.ts"]
