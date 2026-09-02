# ==========================================
# Metaphrase AI 3.0 — React Frontend Container
# Stage 1: Build React SPA bundle
# ==========================================
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ==========================================
# Stage 2: Production Nginx Server (24/7 Resilient)
# ==========================================
FROM nginx:alpine

# Copy custom high-performance Nginx configuration
COPY <<EOF /etc/nginx/conf.d/default.conf
server {
    listen 80;
    server_name localhost;
    client_max_body_size 50M;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;

    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files \$uri \$uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://backend:8000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_connect_timeout 60s;
        proxy_send_timeout 120s;
        proxy_read_timeout 120s;
    }

    # Health check endpoint
    location /healthz {
        access_log off;
        return 200 "healthy\n";
    }
}
EOF

# Copy compiled assets from Stage 1
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
