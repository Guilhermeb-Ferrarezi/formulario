# =========================
# STAGE 1 - BUILD
# =========================
FROM oven/bun:1.1 AS build

WORKDIR /app

# Copia apenas o package.json primeiro (cache)
COPY package.json ./

RUN bun install

# Copia o resto do projeto
COPY . .

# Build do Vite
RUN bun run build


# =========================
# STAGE 2 - NGINX
# =========================
FROM nginx:alpine

# Remove config default
RUN rm /etc/nginx/conf.d/default.conf

# Copia build do Vite
COPY --from=build /app/dist /usr/share/nginx/html

# Copia config do nginx (opcional, mas recomendado)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
