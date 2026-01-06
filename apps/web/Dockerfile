# ---------- build ----------
FROM oven/bun:1.1 AS build

WORKDIR /app

# copia apenas package.json
COPY package.json ./
RUN bun install

# copia o resto do código
COPY . .

# build do Vite
RUN bun run build


# ---------- runtime ----------
FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

RUN printf "server {\n\
  listen 80;\n\
  server_name _;\n\
  root /usr/share/nginx/html;\n\
  index index.html;\n\
  location / {\n\
    try_files \$uri \$uri/ /index.html;\n\
  }\n\
}\n" > /etc/nginx/conf.d/app.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
