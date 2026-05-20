# Use the official lightweight Nginx Alpine image
FROM nginx:stable-alpine

# Remove the default Nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf

# Copy your custom gateway routing rules into the container
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80 to the Docker bridge network
EXPOSE 80

# Start Nginx in the foreground so the container stays active
CMD ["nginx", "-g", "daemon off;"]