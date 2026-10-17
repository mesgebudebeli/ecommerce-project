# E-Shop Laravel API - container image for Railway / Render / Fly.io / any Docker host.
# Build context is this directory (backend-app/).
FROM php:8.2-apache

# --- System packages & PHP extensions -------------------------------------
# pdo_sqlite  -> local / volume-backed SQLite
# pdo_pgsql   -> managed Postgres (Railway, Render, Supabase, ...)
# pdo_mysql   -> managed MySQL/MariaDB
RUN apt-get update && apt-get install -y --no-install-recommends \
        git unzip libzip-dev libsqlite3-dev libpq-dev \
    && docker-php-ext-install -j"$(nproc)" pdo pdo_sqlite pdo_mysql pdo_pgsql zip bcmath \
    && a2enmod rewrite headers \
    && rm -rf /var/lib/apt/lists/*

# --- Composer --------------------------------------------------------------
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# --- Serve Laravel's public/ as the Apache document root -------------------
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf \
 && sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf \
 && printf '%s\n' \
      '<Directory /var/www/html/public>' \
      '    Options FollowSymLinks' \
      '    AllowOverride All' \
      '    Require all granted' \
      '</Directory>' > /etc/apache2/conf-available/laravel.conf \
 && a2enconf laravel

WORKDIR /var/www/html

# --- PHP dependencies (kept in their own layer for faster rebuilds) --------
COPY composer.json composer.lock* ./
RUN composer install --no-dev --no-interaction --no-scripts --prefer-dist

# --- Application code ------------------------------------------------------
COPY . .

RUN composer dump-autoload --optimize --no-scripts \
 && chown -R www-data:www-data storage bootstrap/cache database \
 && chmod -R ug+rwX storage bootstrap/cache database

# Entrypoint runs migrations + seeding, maps the host $PORT, then starts Apache.
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN sed -i 's/\r$//' /usr/local/bin/entrypoint.sh && chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 80
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["apache2-foreground"]
