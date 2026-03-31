# Stage 1: Build app
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build (this creates dist/public)
RUN npm run build

# Stage 2: nginx
FROM nginx:alpine

# ✅ CORRECT PATH
COPY --from=builder /app/dist/public /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
