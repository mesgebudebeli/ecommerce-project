#!/bin/sh
# Container entrypoint: prepare config, migrate + seed, bind the host port,
# then hand off to Apache.
set -e
cd /var/www/html

# Railway/Render expose DATABASE_URL; Laravel's DB_URL expects the same value.
if [ -n "$DATABASE_URL" ] && [ -z "$DB_URL" ]; then
  export DB_URL="$DATABASE_URL"
fi

DB_CONNECTION="${DB_CONNECTION:-sqlite}"
export DB_CONNECTION

if [ "$DB_CONNECTION" = "sqlite" ]; then
  mkdir -p database
  [ -f database/database.sqlite ] || touch database/database.sqlite
  # A mounted volume may be root-owned; make sure the web user can write.
  chown -R www-data:www-data database 2>/dev/null \
    || chmod -R 0777 database 2>/dev/null || true
  export DB_DATABASE=/var/www/html/database/database.sqlite
fi

# Laravel needs an app key. Prefer setting APP_KEY in the host's env vars;
# otherwise generate an ephemeral one (sessions/tokens reset on redeploy).
if [ -z "$APP_KEY" ]; then
  echo "[entrypoint] APP_KEY not set - generating an ephemeral key."
  export APP_KEY="base64:$(php -r 'echo base64_encode(random_bytes(32));')"
fi

# Many hosts (Railway/Render) inject $PORT and expect the app to listen on it.
if [ -n "$PORT" ] && [ "$PORT" != "80" ]; then
  echo "[entrypoint] Binding Apache to port $PORT."
  sed -ri "s/^Listen 80$/Listen ${PORT}/" /etc/apache2/ports.conf
  sed -ri "s/:80>/:${PORT}>/" /etc/apache2/sites-available/000-default.conf
fi

php artisan config:clear
php artisan migrate --force
php artisan db:seed --force || true
php artisan config:cache

exec "$@"
