# Lightweight Nginx container to serve the static client and proxy requests
FROM nginx:alpine

# Remove the default configuration and assets
RUN rm -rf /etc/nginx/conf.d/default.conf /usr/share/nginx/html/*

# Copy custom Nginx proxy configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy client application source code
COPY index.html styles.css app.js /usr/share/nginx/html/

# Copy static assets (product photos, icons)
COPY assets /usr/share/nginx/html/assets

# Expose HTTP port
EXPOSE 80

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
