FROM php:8.3-cli-alpine

# Install system dependencies
RUN apk add --no-cache \
    bash git curl zip unzip autoconf g++ make pkgconfig \
    libpng-dev libjpeg-turbo-dev libzip-dev \
    nodejs yarn linux-headers brotli-dev

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_mysql zip gd pcntl sockets

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy entire app source first (including artisan)
COPY . .

# Install PHP dependencies (no dev for smaller image)
RUN composer install --no-dev --optimize-autoloader

# Install Node dependencies and build frontend assets
RUN yarn install --frozen-lockfile
RUN yarn build

# Expose Laravel port
EXPOSE 8000

# Start Laravel built-in server with env var port support
CMD ["sh", "-c", "php artisan serve --host=0.0.0.0 --port=${APP_PORT}"]