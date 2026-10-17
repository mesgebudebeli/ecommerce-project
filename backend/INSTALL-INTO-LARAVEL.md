# Install backend template into Laravel

1. Run `composer create-project laravel/laravel backend-app`.
2. Install a MongoDB Laravel integration compatible with that Laravel version:
   `composer require mongodb/laravel-mongodb`
3. Copy `routes/api.php`, `app/Models/`, `app/Http/Controllers/`, `app/Http/Middleware/`, and `app/Services/` into the Laravel app. Copy `tests/Feature/` if you want the example API tests.
4. Merge the entries in `config/services.php.append` into the existing `config/services.php` return array.
5. Register the `admin` middleware alias using `bootstrap/app.php.middleware-note`.
6. Configure MongoDB connection in Laravel's `config/database.php` using the official integration docs. Do not blindly replace the whole config file.
7. Configure a token system compatible with the selected MongoDB user model. The sample `AuthController` explicitly reports an unconfigured token system rather than pretending it works.
8. Add tests and check the exact APIs against your Laravel/MongoDB package versions before deploying.

This is an application source template, not a replacement for Laravel's framework files or `vendor/`.
