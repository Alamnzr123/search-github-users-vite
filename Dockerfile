### Build stage
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts --prefer-offline

# Copy source and build
COPY . .
RUN npm run build

### Production stage
FROM nginx:1.26-alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx conf for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
