FROM php:8.3-cli-alpine

# Install base dependencies
RUN apk add --no-cache \
    bash git curl zip unzip autoconf g++ make pkgconfig \
    libpng-dev libjpeg-turbo-dev libzip-dev \
    nodejs npm linux-headers brotli-dev

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_mysql zip gd pcntl

# Install swoole with brotli support
RUN pecl install swoole \
    && docker-php-ext-enable swoole

# Install composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html