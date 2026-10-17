@echo off
REM ============================================================
REM  E-Shop API launcher
REM  Starts the Laravel backend on http://127.0.0.1:8000
REM  Keep this window open while you use the site.
REM ============================================================

set "PHP=C:\xampp\php\php.exe"
if not exist "%PHP%" set "PHP=php"

echo Starting E-Shop API on http://127.0.0.1:8000 ...
"%PHP%" "%~dp0artisan" serve --host=127.0.0.1 --port=8000
